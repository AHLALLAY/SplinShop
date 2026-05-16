import catalogService from "../../services/admin/catalog.service.js";

class CatalogController {
    async addCatalog(req, res) {
        try {
            const catalog = await catalogService.addCatalog(req.body, req.file);
            return res.status(201).json({
                success: true,
                message: "Ajouté",
                data: catalog,
            });
        } catch (err) {
            const statusCode = err.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                message: err.message || "l'ajout du catalogue a échoué",
                ...(err.fieldErrors && { fieldErrors: err.fieldErrors }),
            });
        }
    }

    async getCatalogs(req, res) {
        try {
            const catalogs = await catalogService.getCatalogs();
            return res.status(200).json({
                success: true,
                message: "les catègories qui existent",
                data: catalogs,
            });
        } catch (err) {
            const statusCode = err.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                message: err.message || "les catégories ne sont pas disponibles",
                ...(err.fieldErrors && { fieldErrors: err.fieldErrors }),
            });
        }
    }
}

export default new CatalogController();