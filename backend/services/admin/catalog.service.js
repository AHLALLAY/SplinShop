import { z } from "zod";
import { catalogSchema } from "../../utils/validation.js";
import db from "../../databases/connection.js";
class CatalogService {

    async addCatalog(catalog) {
        const result = catalogSchema.safeParse(catalog);
        if (!result.success) {
            const fieldErrors = z.flattenError(result.error).fieldErrors;
            throw Object.assign(new Error('validation échouée'), {
                statusCode: 400,
                fieldErrors,
            });
        }
        const { name, slug, imgUrl, description } = result.data;

        try {
            const createdCatalog = await db.prisma.catalog.create({
                data: { name, slug, imgUrl, description },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    imgUrl: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return createdCatalog;
        } catch (e) {
            if (e?.code === "P2002") {
                throw Object.assign(
                    new Error("Ce nom ou ce slug est déjà utilisé."),
                    { statusCode: 409 },
                );
            }
            throw e;
        }
    }
}

export default new CatalogService();