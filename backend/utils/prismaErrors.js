import { AppError } from './AppError.js';

/**
 * Transforme les erreurs Prisma connues en AppError.
 * @param {unknown} err
 * @param {string} [conflictMessage]
 */
export function rethrowPrismaError(err, conflictMessage = 'Conflit de données') {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2002') {
        throw new AppError(conflictMessage, 409);
    }
    throw err;
}
