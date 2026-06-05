import { z } from 'zod';
import { AppError } from './AppError.js';
import db from '../databases/connection.js';
import { slugify } from './slug.js';

const catalogIdSchema = z.uuid({ message: 'catalogue invalide' });

/**
 * Valide et retourne un UUID catalogue.
 * @param {string} catalogId
 * @returns {string}
 * @throws {AppError} 400 si invalide
 */
export function parseCatalogId(catalogId) {
    const result = catalogIdSchema.safeParse(catalogId);
    if (!result.success) {
        throw new AppError('catalogue invalide', 400);
    }
    return result.data;
}

/**
 * Vérifie qu’un catalogue existe et n’est pas supprimé.
 * @param {string} catalogId
 * @returns {Promise<object>}
 * @throws {AppError} 404 si introuvable
 */
export async function assertCatalogExists(catalogId) {
    const id = parseCatalogId(catalogId);
    const catalog = await db.prisma.catalog.findUnique({ where: { id } });
    if (!catalog || catalog.isDeleted) {
        throw new AppError('Catalogue introuvable', 404);
    }
    return catalog;
}

/**
 * Résout un catalogue par slug (non supprimé).
 * Cherche d'abord par slug exact, puis par correspondance du nom slugifié.
 * @param {string} slug
 * @returns {Promise<object|null>}
 */
export async function findCatalogBySlug(slug) {
    if (!slug || typeof slug !== 'string') return null;
    const trimmed = slug.trim();

    const bySlug = await db.prisma.catalog.findFirst({
        where: { slug: trimmed, isDeleted: false },
    });
    if (bySlug) return bySlug;

    const allCatalogs = await db.prisma.catalog.findMany({
        where: { isDeleted: false },
    });
    return allCatalogs.find((c) => slugify(c.name) === trimmed) ?? null;
}

/**
 * Récupère tous les sous-catalogues d'un catalogue avec leurs produits
 */
export async function getSubCatalogsWithProducts(catalogId, forAdmin = false) {
    const subCatalogs = await db.prisma.subCatalog.findMany({
        where: { catalogId },
        include: {
            products: {
                where: {
                    isDeleted: false,
                    status: 'active',
                    ...(!forAdmin && { isHidden: false })
                },
                include: {
                    images: {
                        where: { isPrimary: true },
                        take: 1
                    }
                }
            }
        }
    });
    return subCatalogs;
}