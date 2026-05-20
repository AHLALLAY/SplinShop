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
        const catalogs = await catalogService.getCatalogs();
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'les catégories qui existent',
            data: catalogs || null,
        });
    });
}

export default new CatalogController();
