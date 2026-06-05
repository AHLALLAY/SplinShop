/**
 * Génère un slug URL à partir d'un libellé.
 * Translittère les accents (é→e, ç→c, etc.), puis minuscules, tirets, alphanumériques.
 */
export function slugify(text) {
    return String(text ?? '')
        .normalize('NFD')                   // décompose les accents (é → e + ́)
        .replace(/[\u0300-\u036f]/g, '')    // supprime les diacritiques
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-{2,}/g, '-')             // fusionne les tirets multiples
        .replace(/^-+|-+$/g, '');           // supprime les tirets en début/fin
}
