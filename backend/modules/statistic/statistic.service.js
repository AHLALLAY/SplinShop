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
            allSubCatalogs,
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
            db.prisma.subCatalog.count(),
            db.prisma.product.count(),
            db.prisma.catalog.findMany({
                select: {
                    id: true,
                    name: true,
                    subCatalogs: {
                        select: {
                            _count: {
                                select: { products: true }
                            }
                        }
                    }
                }
            }).then(catalogs => catalogs.map(c => ({
                id: c.id,
                name: c.name,
                _count: {
                    products: c.subCatalogs.reduce((sum, sc) => sum + sc._count.products, 0)
                }
            }))),
            db.prisma.product.count({ where: { isHidden: false } }),
            db.prisma.product.count({ where: { isHidden: true } }),
            db.prisma.product.count({ where: { isDeleted: true } }),
        ]);

        return {
            "All Catalogs": allCatalogs,
            "Displayed Catalogs": displayedCatalogs,
            "Hidden Catalogs": hiddenCatalogs,
            "Deleted Catalogs": deletedCatalogs,
            "All SubCatalogs": allSubCatalogs,
            "All Products": allProducts,
            "All Products By Catalog": allProductsByCatalog,
            "Displayed Products": displayedProducts,
            "Hidden Products": hiddenProducts,
            "Deleted Products": deletedProducts,
        };
    }
}

export default new StatisticService();