import { z } from 'zod';
import { loginCredentialsSchema } from '../../utils/validation.js';
import db from '../../databases/connection.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

class AuthService {
    async login(credentials) {
        const result = loginCredentialsSchema.safeParse(credentials);
        if (!result.success) {
            const fieldErrors = z.flattenError(result.error).fieldErrors;
            throw Object.assign(new Error('validation échouée'), {
                statusCode: 400,
                fieldErrors,
            });
        }
        const { email, password } = result.data;
        const user = await db.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) throw new Error("Identifiants invalides");
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) throw new Error("Identifiants invalides");

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        }
    }
}

export default new AuthService();