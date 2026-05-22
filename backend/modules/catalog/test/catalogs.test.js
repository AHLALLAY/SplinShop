import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

const mockFindMany = vi.fn();
const mockFindFirst = vi.fn();
const mockFindUnique = vi.fn();

vi.mock('../../../databases/connection.js', () => ({
    default: {
        prisma: {
            catalog: {
                findMany: (...args) => mockFindMany(...args),
                findFirst: (...args) => mockFindFirst(...args),
                findUnique: (...args) => mockFindUnique(...args),
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
                where: { isDeleted: false, isHidden: false },
            }),
        );
    });
});

describe('GET /api/v1/catalogs/slug/:slug', () => {
    beforeEach(() => {
        mockFindFirst.mockReset();
        mockFindUnique.mockReset();
    });

    it('retourne 404 si slug inconnu', async () => {
        mockFindFirst.mockResolvedValue(null);

        const res = await request(app).get('/api/v1/catalogs/slug/inconnu');

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('retourne le catalogue pour un slug valide', async () => {
        mockFindFirst.mockResolvedValue({ id: 'c1', isHidden: false, isDeleted: false });
        mockFindUnique.mockResolvedValue({
            id: 'c1',
            name: 'Mode',
            slug: 'mode',
            imgUrl: null,
        });

        const res = await request(app).get('/api/v1/catalogs/slug/mode');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.slug).toBe('mode');
    });
});
