import { customerRegisterSchema, loginCredentialsSchema } from '../../utils/validationRules.js';
import bcrypt from 'bcryptjs';
import { parseOrThrow } from '../../utils/parseOrThrow.js';
import { AppError } from '../../utils/AppError.js';
import db from '../../databases/connection.js';
import { signUserToken, toAuthResponse } from '../../utils/authTokens.js';
import { hashPassword } from '../../utils/password.js';
import { assertEmailAvailable, assertPhoneAvailable } from '../../utils/userHelpers.js';

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

        const token = signUserToken(user);
        return toAuthResponse(user, token);
    }

    async registerCustomer(payload) {
        const { name, email, password, phone } = parseOrThrow(customerRegisterSchema, payload);

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
