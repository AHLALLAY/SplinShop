import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

const mockFindUnique = vi.fn();

vi.mock('../databases/connection.js', () => ({
    default: {
        prisma: {
            user: {
                findUnique: (...args) => mockFindUnique(...args),
            },
        },
        connectToDb: vi.fn(),
        disconnect: vi.fn(),
    },
}));

const { default: app } = await import('../../../app.js');

describe('POST /api/v1/auth/login', () => {
    beforeEach(() => {
        mockFindUnique.mockReset();
    });

    it('retourne 400 si validation échoue', async () => {
        const res = await request(app).post('/api/v1/auth/login').send({ email: 'bad', password: 'x' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.fieldErrors).toBeDefined();
    });

    it('retourne 401 si identifiants invalides', async () => {
        mockFindUnique.mockResolvedValue(null);

        const res = await request(app).post('/api/v1/auth/login').send({
            email: 'user@example.com',
            password: 'Password1!',
        });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('retourne 200 et un token si connexion réussie', async () => {
        const bcrypt = await import('bcryptjs');
        const hash = await bcrypt.hash('Password1!', 4);
        mockFindUnique.mockResolvedValue({
            id: 'user-1',
            name: 'Test',
            email: 'user@example.com',
            password: hash,
            role: 'admin',
            isDeleted: false,
            status: 'active',
        });

        const res = await request(app).post('/api/v1/auth/login').send({
            email: 'user@example.com',
            password: 'Password1!',
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.token).toBeDefined();
        expect(res.body.data.role).toBe('admin');
    });
});
