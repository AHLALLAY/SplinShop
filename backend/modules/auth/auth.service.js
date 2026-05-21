import { customerRegisterSchema, loginCredentialsSchema } from '../../utils/validationRules.js';
import { getSaltRounds } from '../../config/index.js';
import bcrypt from 'bcryptjs';
import { parseOrThrow } from '../../utils/parseOrThrow.js';
import { AppError } from '../../utils/AppError.js';
import db from '../../databases/connection.js';
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

    async registerCustomer(payload) {
        const { name, email, password, phone } = parseOrThrow(customerRegisterSchema, payload);

        const existingEmail = await db.prisma.user.findUnique({ where: { email } });
        if (existingEmail) {
            throw new AppError('Email déjà utilisé', 409);
        }

        if (phone) {
            const existingPhone = await db.prisma.user.findUnique({ where: { phone } });
            if (existingPhone) {
                throw new AppError('Numéro de téléphone déjà utilisé', 409);
            }
        }

        const passwordHashed = await bcrypt.hash(password, getSaltRounds());

        const user = await db.prisma.user.create({
            data: {
                name,
                email,
                password: passwordHashed,
                role: 'customer',
                phone: phone ?? null,
            },
        });

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
