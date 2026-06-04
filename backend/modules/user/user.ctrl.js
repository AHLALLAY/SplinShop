import userService from './user.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendApiResponse } from '../../utils/apiResponse.js';

/**
 * Contrôleur pour la gestion des utilisateurs (vendeurs).
 */
class UserCtrl {
    /**
     * Ajoute un vendeur.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    add = asyncHandler(async (req, res) => {
        const seller = await userService.add(req.body);
        sendApiResponse(res, {
            status: 201,
            success: true,
            message: 'Ajouté',
            data: seller || null,
        });
    });

    /**
     * Récupère la liste des vendeurs.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    getAll = asyncHandler(async (req, res) => {
        const sellers = await userService.getAll();
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'Les vendeurs existants',
            data: sellers || null,
        });
    });

    /**
     * Récupère le numéro de l'admin.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    getAdminPhone = asyncHandler(async (req, res) => {
        const phone = await userService.getAdminPhone();
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'Numéro admin',
            data: { phone },
        });
    });
}

export default new UserCtrl();
