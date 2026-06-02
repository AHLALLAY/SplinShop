import authService from './auth.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendApiResponse } from '../../utils/apiResponse.js';

/**
 * Contrôleur pour l'authentification.
 */
class AuthCtrl {
    /**
     * Connecte un utilisateur.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    login = asyncHandler(async (req, res) => {
        const user = await authService.login(req.body);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'Connecté',
            data: user,
        });
    });

    /**
     * Inscrit un nouveau client.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    register = asyncHandler(async (req, res) => {
        const user = await authService.register(req.body);
        sendApiResponse(res, {
            status: 201,
            success: true,
            message: 'Compte créé',
            data: user,
        });
    });
}

export default new AuthCtrl();
