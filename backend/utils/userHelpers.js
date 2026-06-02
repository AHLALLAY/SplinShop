import { AppError } from './AppError.js';
import db from '../databases/connection.js';

/**
 * Vérifie qu’aucun utilisateur n’utilise déjà cet email.
 * @param {string} email
 * @throws {AppError} 409 si email déjà pris
 */
export async function assertEmailAvailable(email) {
    const existing = await db.prisma.user.findUnique({ where: { email } });
    if (existing) {
        throw new AppError('Email déjà utilisé', 409);
    }
}

/**
 * Vérifie qu’aucun utilisateur n’utilise déjà ce téléphone.
 * @param {string} phone
 * @throws {AppError} 409 si numéro déjà pris
 */
export async function assertPhoneAvailable(phone) {
    if (!phone) return;
    const existing = await db.prisma.user.findUnique({ where: { phone } });
    if (existing) {
        throw new AppError('Numéro de téléphone déjà utilisé', 409);
    }
}
