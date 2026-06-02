import db from '../databases/connection.js';
import { hashPassword } from './password.js';

async function createDefaultAdmin() {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    }
    const existingAdmin = await db.prisma.user.findFirst({
        where: {
            email: process.env.ADMIN_EMAIL,
            role: 'admin',
        },
    });

    if (!existingAdmin) {
        const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);

        await db.prisma.user.create({
            data: {
                name: process.env.ADMIN_NAME || 'Administrateur',
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                role: 'admin',
                phone: process.env.ADMIN_PHONE,
            },
        });
        console.info('Default admin created');
        return true;
    }
    console.info('Default admin already exists');
    return false;
}

export default createDefaultAdmin;
