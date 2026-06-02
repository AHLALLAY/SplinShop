import bcrypt from 'bcryptjs';
import { getSaltRounds } from '../config/index.js';

/**
 * Hash un mot de passe en clair avec bcrypt.
 * @param {string} plainPassword
 * @returns {Promise<string>}
 */
export async function hashPassword(plainPassword) {
    return bcrypt.hash(plainPassword, getSaltRounds());
}
