import catalogService from './catalog.service.js';
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

    hideCatalog = asyncHandler(async (req, res) => {
        const catalog = await catalogService.hideCatalog(req.params.id);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'le catégorie a été masquer',
            data: catalog || null,
        });
    });
}

export default new CatalogController();
