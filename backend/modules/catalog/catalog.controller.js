import catalogService from './catalog.service.js';
import productService from '../product/product.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendApiResponse } from '../../utils/apiResponse.js';

class CatalogController {
    addCatalog = asyncHandler(async (req, res) => {
        const catalog = await catalogService.addCatalog(req.body, req.file);
        sendApiResponse(res, {
            status: 201,
            success: true,
            message: 'Ajouté',
            data: catalog || null,
        });
    });

    getCatalogs = asyncHandler(async (req, res) => {
        const catalogs = await catalogService.getCatalogs(false);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'les catégories qui existent',
            data: catalogs || null,
        });
    });

    getCatalogsAdmin = asyncHandler(async (req, res) => {
        const catalogs = await catalogService.getCatalogs(true);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'les catégories (vue admin)',
            data: catalogs || null,
        });
    });

    getCatalogBySlug = asyncHandler(async (req, res) => {
        const catalog = await catalogService.getCatalogBySlug(req.params.slug, false);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'Catégorie trouvée',
            data: catalog || null,
        });
    });

    updateCatalog = asyncHandler(async (req, res) => {
        const catalog = await catalogService.updateCatalog(req.params.id, req.body, req.file);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'Modifié',
            data: catalog || null,
        });
    });

    hideOrShowCatalog = asyncHandler(async (req, res) => {
        const catalog = await catalogService.hideOrShowCatalog(req.params.id);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: catalog?.isHidden
                ? 'La catégorie a été masquée'
                : 'La catégorie est à nouveau visible',
            data: catalog || null,
        });
    });

    loadProductImages = asyncHandler(async (req, res) => {
        const images = await catalogService.loadProductImages();
        console.log('[catalog.controller] :', images);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'les images qui existent',
            data: images || null,
        });
    });
}

export default new CatalogController();
