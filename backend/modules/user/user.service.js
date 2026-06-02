import { sellerSchema } from '../../utils/validationRules.js';
import { parseOrThrow } from '../../utils/parseOrThrow.js';
import db from '../../databases/connection.js';
import { hashPassword } from '../../utils/password.js';
import { assertEmailAvailable } from '../../utils/userHelpers.js';

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
    /**
     * Crée un nouveau vendeur.
     * @param {object} seller - Données du vendeur
     * @returns {Promise<object>} Le vendeur créé
     */
    async add(seller) {
        const { name, email, password, phone } = parseOrThrow(sellerSchema, seller);

        await assertEmailAvailable(email);

        const passwordHashed = await hashPassword(password);
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

    /**
     * Liste tous les vendeurs actifs.
     * @returns {Promise<object[]>} Liste des vendeurs
     */
    async getAll() {
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
