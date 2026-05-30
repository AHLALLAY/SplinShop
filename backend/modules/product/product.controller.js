import productService from './product.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { AppError } from '../../utils/AppError.js';
import { sendApiResponse } from '../../utils/apiResponse.js';

class ProductController {
    addProduct = asyncHandler(async (req, res) => {
        const product = await productService.addProduct(req.body, req.files);
        sendApiResponse(res, {
            status: 201,
            success: true,
            message: 'Ajouté',
            data: product || null,
        });
    });

    getProductsByCatalog = asyncHandler(async (req, res) => {
        const catalogId = req.query.catalogId;
        if (!catalogId) {
            throw new AppError("L'identifiant du catalogue est requis", 400);
        }
        const products = await productService.getProductsByCatalog(catalogId, false);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'les produits qui existent',
            data: products || null,
        });
    });

    getProductsByCatalogAdmin = asyncHandler(async (req, res) => {
        const catalogId = req.query.catalogId;
        if (!catalogId) {
            throw new AppError("L'identifiant du catalogue est requis", 400);
        }
        const products = await productService.getProductsByCatalog(catalogId, true);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'les produits qui existent (vue admin)',
            data: products || null,
        });
    });

    hideOrShowProduct = asyncHandler(async (req, res) => {
        const product = await productService.hideOrShowProduct(req.params.id);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: product?.isHidden
                ? 'Le produit a été masqué'
                : 'Le produit est à nouveau visible',
            data: product || null,
        });
    });
}

export default new ProductController();
