import authService from './auth.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendApiResponse } from '../../utils/apiResponse.js';

class AuthController {
    login = asyncHandler(async (req, res) => {
        const user = await authService.login(req.body);
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'connecté',
            data: user,
        });
    });

    register = asyncHandler(async (req, res) => {
        const user = await authService.registerCustomer(req.body);
        sendApiResponse(res, {
            status: 201,
            success: true,
            message: 'compte créé',
            data: user,
        });
    });
}

export default new AuthController();
