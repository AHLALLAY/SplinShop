import userService from './user.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendApiResponse } from '../../utils/apiResponse.js';

class UserController {
    addSeller = asyncHandler(async (req, res) => {
        const seller = await userService.addSeller(req.body);
        sendApiResponse(res, {
            status: 201,
            message: 'Ajouté',
            data: seller || null,
        });
    });

    getSellers = asyncHandler(async (req, res) => {
        const sellers = await userService.getSellers();
        sendApiResponse(res, {
            status: 200,
            message: 'les vendeurs qui existent',
            data: sellers || null,
        });
    });
}

export default new UserController();
