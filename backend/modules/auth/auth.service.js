import { registerSchema, loginSchema } from '../../utils/validationRules.js';
import bcrypt from 'bcryptjs';
import { parseOrThrow } from '../../utils/parseOrThrow.js';
import { AppError } from '../../utils/AppError.js';
import db from '../../databases/connection.js';
import { signUserToken, toAuthResponse } from '../../utils/authTokens.js';
import { hashPassword } from '../../utils/password.js';
import { assertEmailAvailable, assertPhoneAvailable } from '../../utils/userHelpers.js';

/**
 * Service gérant l'authentification et l'inscription.
 */
class AuthService {
    /**
     * Authentifie un utilisateur et retourne un JWT.
     * @param {object} credentials - Les identifiants (email, password).
     * @returns {Promise<{ id: string, name: string, email: string, role: string, token: string }>} Les données de l'utilisateur avec son token.
     * @throws {AppError} Si les identifiants sont invalides ou le compte suspendu/supprimé.
     */
    async login(credentials) {
        const { email, password } = parseOrThrow(loginSchema, credentials);

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

        const token = signUserToken(user);
        return toAuthResponse(user, token);
    }

    /**
     * Inscrit un client et retourne un JWT.
     * @param {object} payload - Les informations du client (name, email, password, phone).
     * @returns {Promise<{ id: string, name: string, email: string, role: string, token: string }>} Les données de l'utilisateur avec son token.
     * @throws {AppError} Si l'email ou le téléphone est déjà utilisé.
     */
    async register(payload) {
        const { name, email, password, phone } = parseOrThrow(registerSchema, payload);

        await assertEmailAvailable(email);
        await assertPhoneAvailable(phone);

        const passwordHashed = await hashPassword(password);

        const user = await db.prisma.user.create({
            data: {
                name,
                email,
                password: passwordHashed,
                role: 'customer',
                phone: phone ?? null,
            },
        });

        const token = signUserToken(user);
        return toAuthResponse(user, token);
    }
}

export default new AuthService();
