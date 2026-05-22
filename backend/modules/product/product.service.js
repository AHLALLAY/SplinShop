import { productSchema } from '../../utils/validationRules.js';
import { parseOrThrow } from '../../utils/parseOrThrow.js';
import { rethrowPrismaError } from '../../utils/prismaErrors.js';
import db from '../../databases/connection.js';
import uploadService from '../../upload/upload.service.js';
import { parseCatalogId, assertCatalogExists } from '../../utils/catalogHelpers.js';

const productWithImagesSelect = {
    id: true,
    catalogId: true,
    name: true,
    price: true,
    quantity: true,
    slug: true,
    description: true,
    createdAt: true,
    updatedAt: true,
    images: {
        select: { id: true, imgUrl: true, isPrimary: true },
        orderBy: [{ isPrimary: 'desc' }, { id: 'asc' }],
    },
};

class ProductService {
    /**
     * Crée un produit avec images optionnelles.
     * @param {object} product
     * @param {Express.Multer.File[]} [files]
     */
    async addProduct(product, files = []) {
        const { catalogId, name, price, quantity, slug, description } = parseOrThrow(
            productSchema,
            product,
        );

        await assertCatalogExists(catalogId);

        const fileList = Array.isArray(files) ? files : [];
        const uploadedObjects = [];
        let productId = null;

        try {
            const createdProduct = await db.prisma.product.create({
                data: { catalogId, name, price, quantity, slug, description },
            });
            productId = createdProduct.id;

            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];
                const uploaded = await uploadService.putBuffer({
                    buffer: file.buffer,
                    mimetype: file.mimetype,
                    originalName: file.originalname,
                    prefix: 'products',
                });
                uploadedObjects.push(uploaded.objectName);

                await db.prisma.image.create({
                    data: {
                        productId: createdProduct.id,
                        imgUrl: uploaded.url,
                        isPrimary: i === 0,
                    },
                });
            }

            return db.prisma.product.findUnique({
                where: { id: createdProduct.id },
                select: productWithImagesSelect,
            });
        } catch (e) {
            for (const objectName of uploadedObjects) {
                await uploadService.removeObject(objectName);
            }
            if (productId) {
                await db.prisma.image.deleteMany({ where: { productId } }).catch(() => {});
                await db.prisma.product.delete({ where: { id: productId } }).catch(() => {});
            }
            rethrowPrismaError(e, 'Ce slug est déjà utilisé.');
        }
    }

    async getProductsByCatalog(catalogId) {
        const id = parseCatalogId(catalogId);
        await assertCatalogExists(id);

        return db.prisma.product.findMany({
            where: {
                catalogId: id,
                isDeleted: false,
                status: 'active',
            },
            orderBy: { createdAt: 'desc' },
            select: productWithImagesSelect,
        });
    }
}

export default new ProductService();
