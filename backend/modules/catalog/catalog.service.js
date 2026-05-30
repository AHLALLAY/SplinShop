import { catalogSchema } from '../../utils/validationRules.js';
import { parseOrThrow } from '../../utils/parseOrThrow.js';
import { AppError } from '../../utils/AppError.js';
import { rethrowPrismaError } from '../../utils/prismaErrors.js';
import db from '../../databases/connection.js';
import uploadService from '../../upload/upload.service.js';
import { objectNameFromPublicUrl } from '../../upload/uploadHandler.js';
import { slugify } from '../../utils/slug.js';
import { parseCatalogId, findCatalogBySlug } from '../../utils/catalogHelpers.js';

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

const imagesSelect = {
    id: true,
    imgUrl: true,
    isPrimary: true,
};

class CatalogService {
    /**
     * Crée un catalogue (slug auto si absent).
     * @param {object} catalog
     * @param {Express.Multer.File} [file]
     */
    async addCatalog(catalog, file) {
        let { name, slug, imgUrl, description } = parseOrThrow(catalogSchema, catalog);
        const resolvedSlug = slug ?? slugify(name);
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
                data: { name, slug: resolvedSlug, imgUrl, description },
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

    async getCatalogBySlug(slug, forAdmin = false) {
        const catalog = await findCatalogBySlug(slug);
        if (!catalog) {
            throw new AppError('Catalogue introuvable', 404);
        }
        if (!forAdmin && catalog.isHidden) {
            throw new AppError('Catalogue introuvable', 404);
        }
        return db.prisma.catalog.findUnique({
            where: { id: catalog.id },
            select: forAdmin ? catalogAdminSelect : catalogPublicSelect,
        });
    }

    async updateCatalog(catalogId, catalog, file) {
        const id = parseCatalogId(catalogId);
        const existing = await db.prisma.catalog.findUnique({
            where: { id },
        });
        if (!existing || existing.isDeleted) {
            throw new AppError('Catalogue introuvable', 404);
        }

        const { name, slug, description } = parseOrThrow(catalogSchema, catalog);
        const resolvedSlug = slug ?? slugify(name);

        let imgUrl = existing.imgUrl;
        let uploadedFile = null;
        let oldObjectName = null;

        if (file) {
            uploadedFile = await uploadService.putBuffer({
                buffer: file.buffer,
                mimetype: file.mimetype,
                originalName: file.originalname,
                prefix: 'catalogs',
            });
            imgUrl = uploadedFile.url;
            oldObjectName = objectNameFromPublicUrl(existing.imgUrl);
        }

        try {
            const updated = await db.prisma.catalog.update({
                where: { id },
                data: {
                    name,
                    slug: resolvedSlug,
                    description,
                    imgUrl,
                },
                select: catalogAdminSelect,
            });

            if (oldObjectName) {
                await uploadService.removeObject(oldObjectName).catch(() => { });
            }

            return updated;
        } catch (e) {
            if (uploadedFile?.objectName) {
                await uploadService.removeObject(uploadedFile.objectName).catch(() => { });
            }
            rethrowPrismaError(e, 'Ce nom ou ce slug est déjà utilisé.');
        }
    }

    async hideOrShowCatalog(catalogId) {
        const id = parseCatalogId(catalogId);
        const catalog = await db.prisma.catalog.findUnique({
            where: { id },
        });
        if (!catalog || catalog.isDeleted) {
            throw new AppError('Catalogue introuvable', 404);
        }
        try {
            const newValue = !catalog.isHidden;
            return await db.prisma.catalog.update({
                where: { id },
                data: { isHidden: newValue },
                select: catalogAdminSelect,
            });
        } catch (e) {
            rethrowPrismaError(e, 'Erreur lors de la modification du catalogue.');
        }
    }

    async loadProductImages() {
        const images = await db.prisma.image.findMany({
            where: { isPrimary: true },
            select: imagesSelect,
        });
        return images;
    }
}

export default new CatalogService();
