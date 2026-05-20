import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

const mockFindMany = vi.fn();

vi.mock('../../../databases/connection.js', () => ({
    default: {
        prisma: {
            catalog: {
                findMany: (...args) => mockFindMany(...args),
            },
        },
        connectToDb: vi.fn(),
        disconnect: vi.fn(),
    },
}));

const { default: app } = await import('../../../app.js');

describe('GET /api/v1/catalogs', () => {
    beforeEach(() => {
        mockFindMany.mockReset();
    });

    it('est public et retourne les catalogues actifs', async () => {
        mockFindMany.mockResolvedValue([
            { id: 'c1', name: 'Électronique', slug: 'electronique', imgUrl: null },
        ]);

        const res = await request(app).get('/api/v1/catalogs');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveLength(1);
        expect(mockFindMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { isDeleted: false, status: 'active' },
            }),
        );
    });
});
