import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

vi.mock('../../../databases/connection.js', () => ({
    default: {
        prisma: {
            user: {
                findUnique: vi.fn(),
                create: vi.fn(),
                findMany: vi.fn(),
            },
        },
        connectToDb: vi.fn(),
        disconnect: vi.fn(),
    },
}));

const { default: app } = await import('../../../app.js');

describe('POST /api/v1/sellers', () => {
    it('retourne 401 sans token', async () => {
        const res = await request(app).post('/api/v1/sellers').send({
            name: 'Vendeur',
            email: 'v@example.com',
            password: 'Password1!',
        });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('retourne 403 si utilisateur non admin', async () => {
        const jwt = await import('jsonwebtoken');
        const token = jwt.sign(
            { id: 'seller-1', role: 'seller' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
        );

        const db = (await import('../../../databases/connection.js')).default;
        db.prisma.user.findUnique.mockResolvedValue({
            id: 'seller-1',
            role: 'seller',
            isDeleted: false,
            status: 'active',
        });

        const res = await request(app)
            .post('/api/v1/sellers')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Vendeur',
                email: 'v@example.com',
                password: 'Password1!',
            });

        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
    });
});
