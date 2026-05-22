import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

const mockFindMany = vi.fn();
const mockFindUnique = vi.fn();

vi.mock('../../../databases/connection.js', () => ({
    default: {
        prisma: {
            product: {
                findMany: (...args) => mockFindMany(...args),
            },
            catalog: {
                findUnique: (...args) => mockFindUnique(...args),
            },
        },
        connectToDb: vi.fn(),
        disconnect: vi.fn(),
    },
}));

const { default: app } = await import('../../../app.js');

describe('GET /api/v1/products', () => {
    beforeEach(() => {
        mockFindMany.mockReset();
        mockFindUnique.mockReset();
    });

    it('retourne 400 si catalogId invalide', async () => {
        const res = await request(app).get('/api/v1/products?catalogId=not-a-uuid');

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('retourne les produits d’un catalogue valide', async () => {
        const catalogId = '550e8400-e29b-41d4-a716-446655440000';
        mockFindUnique.mockResolvedValue({
            id: catalogId,
            isDeleted: false,
        });
        mockFindMany.mockResolvedValue([
            {
                id: 'p1',
                catalogId,
                name: 'Produit A',
                price: 10,
                quantity: 1,
                images: [],
            },
        ]);

        const res = await request(app).get(`/api/v1/products?catalogId=${catalogId}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveLength(1);
    });
});
