import { z } from 'zod';
import { AppError } from './AppError.js';
import db from '../databases/connection.js';

const productIdSchema = z.uuid({ message: 'produit invalide' });

/**
 * Valide et retourne un UUID produit.
 * @param {string} productId
 * @returns {string}
 * @throws {AppError} 400 si invalide
 */
export function parseProductId(productId) {
    const result = productIdSchema.safeParse(productId);
    if (!result.success) {
        throw new AppError('produit invalide', 400);
    }
    return result.data;
}