import catalogService from './catalog.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendApiResponse } from '../../utils/apiResponse.js';

/**
 * Contrôleur pour la gestion des catalogues.
 */
class CatalogCtrl {
    /**
     * Ajoute un nouveau catalogue.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    add = asyncHandler(async (req, res) => {
        const catalog = await catalogService.add(req.body, req.file);
        sendApiResponse(res, {
            status: 201,
            success: true,
            message: 'Ajouté',
            data: catalog || null,
        });
    });

    /**
     * Récupère tous les catalogues publics.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    getAll = asyncHandler(async (req, res) => {
        const catalogs = await catalogService.getAll(false);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'Les catégories existantes',
            data: catalogs || null,
        });
    });

    /**
     * Récupère tous les catalogues (Vue Admin).
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    getAdminAll = asyncHandler(async (req, res) => {
        const catalogs = await catalogService.getAll(true);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'Les catégories (vue admin)',
            data: catalogs || null,
        });
    });

    /**
     * Récupère un catalogue par son slug.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    getBySlug = asyncHandler(async (req, res) => {
        const catalog = await catalogService.getBySlug(req.params.slug, false);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'Catégorie trouvée',
            data: catalog || null,
        });
    });

    /**
     * Met à jour un catalogue existant.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    update = asyncHandler(async (req, res) => {
        const catalog = await catalogService.update(req.params.id, req.body, req.file);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'Modifié',
            data: catalog || null,
        });
    });

    /**
     * Affiche ou masque un catalogue.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    toggleVisibility = asyncHandler(async (req, res) => {
        const catalog = await catalogService.toggleVisibility(req.params.id);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: catalog?.isHidden
                ? 'La catégorie a été masquée'
                : 'La catégorie est à nouveau visible',
            data: catalog || null,
        });
    });

    /**
     * Charge les images des produits liés.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    getImages = asyncHandler(async (req, res) => {
        const images = await catalogService.getImages();
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'Les images existantes',
            data: images || null,
        });
    });
}

export default new CatalogCtrl();
