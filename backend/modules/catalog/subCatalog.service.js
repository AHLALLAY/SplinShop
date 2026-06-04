import { subCatalogSchema } from '../../utils/validationRules.js';
import { parseOrThrow } from '../../utils/parseOrThrow.js';
import { AppError } from '../../utils/AppError.js';
import db from '../../databases/connection.js';
import { parseCatalogId, assertCatalogExists } from '../../utils/catalogHelpers.js';

class SubCatalogService {
    /**
     * Crée une sous-catégorie pour un catalogue donné.
     * @param {string} catalogId - ID du catalogue parent
     * @param {object} subCatalog - Données de la sous-catégorie
     * @returns {Promise<object>} La sous-catégorie créée
     */
    async add(catalogId, subCatalog) {
        const parsedCatalogId = parseCatalogId(catalogId);
        await assertCatalogExists(parsedCatalogId);

        const { name } = parseOrThrow(subCatalogSchema, { catalogId: parsedCatalogId, ...subCatalog });

        return db.prisma.subCatalog.create({
            data: {
                name,
                catalogId: parsedCatalogId,
            },
            select: {
                id: true,
                name: true,
                catalogId: true,
            },
        });
    }

    /**
     * Récupère les sous-catégories d'un catalogue donné.
     * @param {string} catalogId - ID du catalogue parent
     * @returns {Promise<object[]>} Liste des sous-catégories
     */
    async getByCatalog(catalogId) {
        const parsedCatalogId = parseCatalogId(catalogId);
        await assertCatalogExists(parsedCatalogId);

        return db.prisma.subCatalog.findMany({
            where: { catalogId: parsedCatalogId },
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                catalogId: true,
            },
        });
    }
}

export default new SubCatalogService();
