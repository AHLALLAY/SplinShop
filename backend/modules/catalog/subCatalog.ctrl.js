import subCatalogService from './subCatalog.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendApiResponse } from '../../utils/apiResponse.js';

class SubCatalogCtrl {
    /**
     * Ajoute une nouvelle sous-catégorie.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    add = asyncHandler(async (req, res) => {
        const subCatalog = await subCatalogService.add(req.params.id, req.body);
        sendApiResponse(res, {
            status: 201,
            success: true,
            message: 'Sous-catégorie ajoutée',
            data: subCatalog || null,
        });
    });

    /**
     * Récupère toutes les sous-catégories d'un catalogue.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    getByCatalog = asyncHandler(async (req, res) => {
        const subCatalogs = await subCatalogService.getByCatalog(req.params.id);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'Les sous-catégories',
            data: subCatalogs || null,
        });
    });
}

export default new SubCatalogCtrl();
