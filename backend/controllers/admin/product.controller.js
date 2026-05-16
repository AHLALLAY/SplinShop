import productService from "../../services/admin/product.service.js";


class ProductController {
    async addProduct(req, res) {
        try {
            const product = await productService.addProduct(req.body);
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
}

export default new ProductController();