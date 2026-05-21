/**
 * Génère un slug URL à partir d’un libellé (minuscules, tirets, alphanumériques).
 */
export function slugify(text) {
    return String(text ?? '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}
