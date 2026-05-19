import authService from '../../services/auth/auth.service.js';
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
}

export default new AuthController();
