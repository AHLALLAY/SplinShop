import { z } from "zod";
import { catalogSchema } from "../../utils/validation.js";
import db from "../../databases/connection.js";
import uploadService from '../../upload/upload.service.js';

class CatalogService {

    async addCatalog(catalog, file) {
        const result = catalogSchema.safeParse(catalog);
        if (!result.success) {
            const fieldErrors = z.flattenError(result.error).fieldErrors;
            throw Object.assign(new Error('validation échouée'), {
                statusCode: 400,
                fieldErrors,
            });
        }
        let { name, slug, imgUrl, description } = result.data;
        let uploadedFile = null;

        if (file) {
            uploadedFile = await uploadService.putBuffer({
                buffer: file.buffer,
                mimetype: file.mimetype,
                originalName: file.originalname,
                prefix: 'catalogs',
            });
            imgUrl = uploadedFile.url;
        }

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
            if (file && uploadedFile?.objectName) {
                await uploadService.removeObject(uploadedFile.objectName);
            }
            if (e?.code === "P2002") {
                throw Object.assign(
                    new Error("Ce nom ou ce slug est déjà utilisé."),
                    { statusCode: 409 },
                );
            }
            throw e;
        }
    }

    async getCatalogs() {
        return await db.prisma.catalog.findMany({
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
    }
}

export default new CatalogService();