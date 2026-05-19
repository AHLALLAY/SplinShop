import productService from "../../services/admin/product.service.js";


class ProductController {
    async addProduct(req, res) {
        try {
            const product = await productService.addProduct(req.body, req.files);
            return res.status(201).json({
                success: true,
                message: "Ajouté",
                data: product,
            });
        } catch (err) {
            const statusCode = err.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                message: err.message || "l'ajout du produit a échoué",
                ...(err.fieldErrors && { fieldErrors: err.fieldErrors }),
            });
        }
    }
    async getProductsByCatalog(req, res) {
        try {
            const catalogId = req.query.catalogId;
            if (!catalogId) {
                return res.status(400).json({
                    success: false,
                    message: "catalogId requis (query ?catalogId=...)",
                });
            }
            const products = await productService.getProductsByCatalog(catalogId);
            return res.status(200).json({
                success: true,
                message: "les produits qui existent",
                data: products,
            });
        } catch (err) {
            const statusCode = err.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                message: err.message || "les produits ne sont pas disponibles",
                ...(err.fieldErrors && { fieldErrors: err.fieldErrors }),
            });
        }
    }
}

export default new ProductController();