import productService from './product.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { AppError } from '../../utils/AppError.js';
import { sendApiResponse } from '../../utils/apiResponse.js';

class ProductController {
    addProduct = asyncHandler(async (req, res) => {
        const product = await productService.addProduct(req.body, req.files);
        sendApiResponse(res, {
            status: 201,
            message: 'Ajouté',
            data: product || null,
        });
    });

    getProductsByCatalog = asyncHandler(async (req, res) => {
        const catalogId = req.query.catalogId;
        if (!catalogId) {
            throw new AppError("L'identifiant du catalogue est requis", 400);
        }
        const products = await productService.getProductsByCatalog(catalogId);
        sendApiResponse(res, {
            status: 200,
            message: 'les produits qui existent',
            data: products || null,
        });
    });
}

export default new ProductController();
