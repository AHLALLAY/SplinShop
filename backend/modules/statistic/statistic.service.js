import db from "../../databases/connection.js";

/**
 * Service pour la récupération des statistiques globales.
 */
class StatisticService {
    /**
     * Récupère toutes les statistiques (produits et catalogues).
     * @returns {Promise<object>} Objet contenant les compteurs.
     */
    async getAll() {
        const [
            allCatalogs,
            displayedCatalogs,
            hiddenCatalogs,
            deletedCatalogs,
            allProducts,
            allProductsByCatalog,
            displayedProducts,
            hiddenProducts,
            deletedProducts,
        ] = await Promise.all([
            db.prisma.catalog.count(),
            db.prisma.catalog.count({ where: { isHidden: false } }),
            db.prisma.catalog.count({ where: { isHidden: true } }),
            db.prisma.catalog.count({ where: { isDeleted: true } }),
            db.prisma.product.count(),
            db.prisma.catalog.findMany({
                select: {
                    id: true,
                    name: true,
                    _count: {
                        select: { products: true }
                    }
                }
            }),
            db.prisma.product.count({ where: { isHidden: false } }),
            db.prisma.product.count({ where: { isHidden: true } }),
            db.prisma.product.count({ where: { isDeleted: true } }),
        ]);

        return {
            "All Catalogs": allCatalogs,
            "Displayed Catalogs": displayedCatalogs,
            "Hidden Catalogs": hiddenCatalogs,
            "Deleted Catalogs": deletedCatalogs,
            "All Products": allProducts,
            "All Products By Catalog": allProductsByCatalog,
            "Displayed Products": displayedProducts,
            "Hidden Products": hiddenProducts,
            "Deleted Products": deletedProducts,
        };
    }
}

export default new StatisticService();