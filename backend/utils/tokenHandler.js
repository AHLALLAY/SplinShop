import jwt from 'jsonwebtoken';
import db from '../databases/connection.js';

class Token {
    extractToken(headers) {
        const auth = headers?.authorization;
        if (!auth || !auth.startsWith('Bearer ')) return null;
        const token = auth.slice('Bearer '.length).trim();
        return token || null;
    }

    verifyToken(token) {
        if (!token) throw new Error("Non authentifié");
        return jwt.verify(token, process.env.JWT_SECRET);
    }

    async bindUserToRequest(req, userId) {
        const user = await db.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.isDeleted || user.status === 'suspend') throw new Error('Non authentifié');
        req.user = user;
    }
}

export default new Token();
