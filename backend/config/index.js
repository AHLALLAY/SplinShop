import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3000),
    API_BASE_URL: z.string().default('/api/v1'),
    CORS_ORIGIN: z.string().optional(),
    DATABASE_URL: z.string().optional(),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET est requis'),
    JWT_EXPIRES_IN: z.string().default('24h'),
    BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900_000),
    RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
});

export const config = envSchema.parse(process.env);

export function getSaltRounds() {
    return config.BCRYPT_SALT_ROUNDS;
}
