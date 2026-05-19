import { z } from 'zod';
import { AppError } from './AppError.js';

/**
 * @template {z.ZodType} T
 * @param {T} schema
 * @param {unknown} data
 * @returns {z.infer<T>}
 */
export function parseOrThrow(schema, data) {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new AppError(
            'validation échouée',
            400,
            z.flattenError(result.error).fieldErrors,
        );
    }
    return result.data;
}
