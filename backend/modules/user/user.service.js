import { sellerSchema } from '../../utils/validation.js';
import { parseOrThrow } from '../../utils/parseOrThrow.js';
import { AppError } from '../../utils/AppError.js';
import { getSaltRounds } from '../../config/index.js';
import db from '../../databases/connection.js';
import bcrypt from 'bcryptjs';

const sellerPublicSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    phone: true,
    createdAt: true,
    status: true,
};

class UserService {
    async addSeller(seller) {
        const { name, email, password, phone } = parseOrThrow(sellerSchema, seller);

        const isEmailExist = await db.prisma.user.findUnique({
            where: { email },
        });
        if (isEmailExist) {
            throw new AppError('Email déjà utilisé', 409);
        }

        const passwordHashed = await bcrypt.hash(password, getSaltRounds());
        return db.prisma.user.create({
            data: {
                name,
                email,
                password: passwordHashed,
                role: 'seller',
                phone,
            },
            select: sellerPublicSelect,
        });
    }

    async getSellers() {
        return db.prisma.user.findMany({
            where: {
                role: 'seller',
                isDeleted: false,
            },
            select: sellerPublicSelect,
            orderBy: { createdAt: 'desc' },
        });
    }
}

export default new UserService();
