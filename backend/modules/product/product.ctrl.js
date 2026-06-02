import productService from './product.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { AppError } from '../../utils/AppError.js';
import { sendApiResponse } from '../../utils/apiResponse.js';

/**
 * Contrôleur pour la gestion des produits.
 */
class ProductCtrl {
    /**
     * Ajoute un nouveau produit.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    add = asyncHandler(async (req, res) => {
        const product = await productService.add(req.body, req.files);
        sendApiResponse(res, {
            status: 201,
            success: true,
            message: 'Ajouté',
            data: product || null,
        });
    });

    /**
     * Récupère les produits d'un catalogue (Vue publique).
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    getByCatalog = asyncHandler(async (req, res) => {
        const catalogId = req.query.catalogId;
        if (!catalogId) {
            throw new AppError("L'identifiant du catalogue est requis", 400);
        }
        const products = await productService.getByCatalog(catalogId, false);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'Les produits existants',
            data: products || null,
        });
    });

    /**
     * Récupère les produits d'un catalogue (Vue admin).
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    getAdminByCatalog = asyncHandler(async (req, res) => {
        const catalogId = req.query.catalogId;
        if (!catalogId) {
            throw new AppError("L'identifiant du catalogue est requis", 400);
        }
        const products = await productService.getByCatalog(catalogId, true);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'Les produits existants (vue admin)',
            data: products || null,
        });
    });

    /**
     * Affiche ou masque un produit.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    toggleVisibility = asyncHandler(async (req, res) => {
        const product = await productService.toggleVisibility(req.params.id);
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

export default new ProductCtrl();
