import { loginCredentialsSchema } from '../../utils/validationRules.js';
import { parseOrThrow } from '../../utils/parseOrThrow.js';
import { AppError } from '../../utils/AppError.js';
import db from '../../databases/connection.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../config/index.js';

class AuthService {
    async login(credentials) {
        const { email, password } = parseOrThrow(loginCredentialsSchema, credentials);

        const user = await db.prisma.user.findUnique({
            where: { email },
        });

        if (!user || user.isDeleted || user.status === 'suspend') {
            throw new AppError('Identifiants invalides', 401);
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new AppError('Identifiants invalides', 401);
        }

        if (!config.JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured');
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN },
        );

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        };
    }
}

export default new AuthService();
