import { describe, it, expect } from 'vitest';
import request from 'supertest';

const { default: app } = await import('../../app.js');

describe('Middleware isAuthenticated', () => {
    it('retourne 401 sur une route protégée sans token', async () => {
        const res = await request(app).get('/api/v1/sellers');

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/authentification/i);
    });
});
