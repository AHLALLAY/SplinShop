import { z } from 'zod';
import { catalogSchema } from '../../utils/validationRules.js';
import { parseOrThrow } from '../../utils/parseOrThrow.js';
import { AppError } from '../../utils/AppError.js';
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

const catalogAdminSelect = {
    ...catalogPublicSelect,
    isHidden: true,
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

    async getCatalogs(forAdmin = false) {
        const where = {
            isDeleted: false,
        };
        if (!forAdmin) {
            where.isHidden = false;
        }

        return db.prisma.catalog.findMany({
            where,
            select: forAdmin ? catalogAdminSelect : catalogPublicSelect,
            orderBy: { createdAt: 'asc' },
        });
    }

    async hideOrShowCatalog(catalogId) {
        const idResult = z.uuid({ message: 'catalogue invalide' }).safeParse(catalogId);
        if (!idResult.success) {
            throw new AppError('catalogue invalide', 400);
        }
        const catalog = await db.prisma.catalog.findUnique({
            where: { id: idResult.data },
        });
        if (!catalog || catalog.isDeleted) {
            throw new AppError('Catalogue introuvable', 404);
        }
        try {
            const newValue = !catalog.isHidden;
            return await db.prisma.catalog.update({
                where: { id: idResult.data },
                data: { isHidden: newValue },
                select: catalogAdminSelect,
            });
        } catch (e) {
            rethrowPrismaError(e, 'Erreur lors de la modification du catalogue.');
        }
    }
}

export default new CatalogService();
