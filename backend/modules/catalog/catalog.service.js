import { catalogSchema } from '../../utils/validationRules.js';
import { parseOrThrow } from '../../utils/parseOrThrow.js';
import { rethrowPrismaError } from '../../utils/prismaErrors.js';
import db from '../../databases/connection.js';
import uploadService from '../../upload/upload.service.js';

const catalogPublicSelect = {
    id: true,
    name: true,
    slug: true,
    imgUrl: true,
    description: true,
    createdAt: true,
    updatedAt: true,
};

class CatalogService {
    async addCatalog(catalog, file) {
        let { name, slug, imgUrl, description } = parseOrThrow(catalogSchema, catalog);
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
            return await db.prisma.catalog.create({
                data: { name, slug, imgUrl, description },
                select: catalogPublicSelect,
            });
        } catch (e) {
            if (file && uploadedFile?.objectName) {
                await uploadService.removeObject(uploadedFile.objectName);
            }
            rethrowPrismaError(e, 'Ce nom ou ce slug est déjà utilisé.');
        }
    }

    async getCatalogs() {
        return db.prisma.catalog.findMany({
            where: {
                isDeleted: false,
                status: 'active',
            },
            select: catalogPublicSelect,
            orderBy: { createdAt: 'desc' },
        });
    }
}

export default new CatalogService();
