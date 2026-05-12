import tokenHandler from '../utils/tokenHandler.js';

export default async function isAuthenticated(req, res, next) {
    try {
        const token = tokenHandler.extractToken(req.headers);
        const jwtDecoded = tokenHandler.verifyToken(token);
        await tokenHandler.bindUserToRequest(req, jwtDecoded.id);
        return next();
    } catch {
        return res.status(401).json({ error: 'Authentification requise' });
    }
}
