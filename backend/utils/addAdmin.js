import db from '../databases/connection.js';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

async function createDefaultAdmin() {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        throw new Error('ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis dans .env');
    }
    const existingAdmin = await db.prisma.user.findFirst({
        where: {
            email: process.env.ADMIN_EMAIL,
            role: 'admin',
        }
    });

    if (!existingAdmin) {
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, saltRounds);

        await db.prisma.user.create({
            data: {
                name: "Miri Mohammed",
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                role: "admin",
                phone: process.env.ADMIN_PHONE,
            }
        });
        console.info('Admin created successfully');
        return true;
    }
    console.info('Admin already exists');
    return false;
}

export default createDefaultAdmin;