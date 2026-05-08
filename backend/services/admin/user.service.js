import { z } from "zod";
import { sellerSchema } from "../../utils/validation.js";
import db from "../../databases/connection.js";
import bcrypt from "bcryptjs";


class UserService {
    async addSeller(seller) {
        const result = sellerSchema.safeParse(seller);
        if (!result.success) {
            const fieldErrors = z.flattenError(result.error).fieldErrors;
            throw Object.assign(new Error('validation échouée'), {
                statusCode: 400,
                fieldErrors,
            });
        }
        const { name, email, password, role, phone } = result.data;
        const isEmailExist = await db.prisma.user.findUnique({
            where: { email },
        })
        if (isEmailExist) {
            throw Object.assign(new Error("Email déjà utilisé"), {
                statusCode: 409,
            })
        }
        const passwordHashed = await bcrypt.hash(password, 10);
        const createdSeller = await db.prisma.user.create({
            data: {
                name,
                email,
                password: passwordHashed,
                role: "seller",
                phone
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                createdAt: true,
                status: true,
                isDeleted: true,
            }
        });
        return createdSeller;
    }

    async getSellers() {
        return await db.prisma.user.findMany({
            where:{role: 'seller'}
        });
    }
}

export default new UserService();