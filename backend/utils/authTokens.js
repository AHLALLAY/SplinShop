import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

/**
 * Émet un JWT pour un utilisateur.
 * @param {{ id: string, role: string }} user
 * @returns {string}
 */
export function signUserToken(user) {
    return jwt.sign({ id: user.id, role: user.role }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
    });
}

/**
 * Formate la réponse auth (login / register).
 * @param {{ id: string, name: string, email: string, role: string }} user
 * @param {string} token
 * @returns {{ id: string, name: string, email: string, role: string, token: string }}
 */
export function toAuthResponse(user, token) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
    };
}
