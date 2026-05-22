import tokenHandler from '../utils/tokenHandler.js';
import { sendApiResponse } from '../utils/apiResponse.js';

export default async function isAuthenticated(req, res, next) {
    try {
        const token = tokenHandler.extractToken(req.headers);
        const jwtDecoded = tokenHandler.verifyToken(token);
        await tokenHandler.bindUserToRequest(req, jwtDecoded.id);
        return next();
    } catch {
        return sendApiResponse(res, {
            status: 401,
            success: false,
            message: 'Authentification requise',
        });
    }
}
