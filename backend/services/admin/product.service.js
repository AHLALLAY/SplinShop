import { productSchema } from "../../utils/validation.js";
import { z } from "zod";
import db from "../../databases/connection.js";
import uploadService from "../../upload/upload.service.js";

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
        orderBy: [{ isPrimary: "desc" }, { id: "asc" }],
    },
};

class ProductService {
    async addProduct(product, files = []) {
        const result = productSchema.safeParse(product);
        if (!result.success) {
            const fieldErrors = z.flattenError(result.error).fieldErrors;
            throw Object.assign(new Error("validation échouée"), {
                statusCode: 400,
                fieldErrors,
            });
        }

        const { catalogId, name, price, quantity, slug, description } = result.data;
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
                    prefix: "products",
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

            return await db.prisma.product.findUnique({
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
            if (e?.code === "P2002") {
                throw Object.assign(new Error("Ce slug est déjà utilisé."), { statusCode: 409 });
            }
            throw e;
        }
    }

    async getProductsByCatalog(catalogId) {
        const idResult = productSchema.shape.catalogId.safeParse(catalogId);
        if (!idResult.success) {
            throw Object.assign(new Error("Catalog invalide"), { statusCode: 400 });
        }
        try {
            return await db.prisma.product.findMany({
                where: { catalogId: idResult.data, isDeleted: false },
                orderBy: { createdAt: "desc" },
                select: productWithImagesSelect,
            });
        } catch (e) {
            throw e;
        }
    }
}

export default new ProductService();
