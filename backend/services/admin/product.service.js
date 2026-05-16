import { productSchema } from "../../utils/validation.js";
import { z } from 'zod';
import db from "../../databases/connection.js";

class ProductService {
    async addProduct(product) {
        const result = productSchema.safeParse(product);
        if (!result.success) {
            const fieldErrors = z.flattenError(result.error).fieldErrors;
            throw Object.assign(new Error('validation échouée'), {
                statusCode: 400,
                fieldErrors,
            });
        }
        const { catalogId, name, price, quantity, slug, description } = result.data;
        try {
            const createdProduct = await db.prisma.product.create({
                data: { catalogId, name, price, quantity, slug, description },
                select: {
                    id: true,
                    catalogId: true,
                    name: true,
                    price: true,
                    quantity: true,
                    slug: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return createdProduct;
        } catch (e) {
            throw e;
        }
    }
}

export default new ProductService();