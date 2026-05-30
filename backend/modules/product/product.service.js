import { productSchema } from '../../utils/validationRules.js';
import { parseOrThrow } from '../../utils/parseOrThrow.js';
import { rethrowPrismaError } from '../../utils/prismaErrors.js';
import { AppError } from '../../utils/AppError.js';
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
    isHidden: true,
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

    async getProductsByCatalog(catalogId, forAdmin = false) {
        const id = parseCatalogId(catalogId);
        await assertCatalogExists(id);

        const where = {
            catalogId: id,
            isDeleted: false,
            status: 'active',
        };
        if (!forAdmin) where.isHidden = false;

        return db.prisma.product.findMany({
            where,
            orderBy: { createdAt: 'asc' },
            select: productWithImagesSelect,
        });
    }

    async hideOrShowProduct(productId) {
        const product = await db.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product || product.isDeleted) {
            throw new AppError('Produit introuvable', 404);
        }
        try {
            const newValue = !product.isHidden;
            return await db.prisma.product.update({
                where: { id: productId },
                data: { isHidden: newValue },
                select: productWithImagesSelect,
            });
        } catch (e) {
            rethrowPrismaError(e, 'Erreur lors de la modification du produit.');
        }
    }
}

export default new ProductService();
