import callEndpoint from './apiHandler';
import { slugify } from '../utils/slug';

class CatalogService {
    /**
     * Récupère tous les catalogues publics.
     * @returns {Promise<object[]>}
     */
    async getAll() {
        const response = await callEndpoint('/catalogs');
        return response.data;
    }

    /**
     * Récupère tous les catalogues pour l'admin (inclut les masqués).
     * @returns {Promise<object[]>}
     */
    async getAdminAll() {
        const response = await callEndpoint('/catalogs/all');
        return response.data;
    }

    /**
     * Récupère un catalogue par son slug.
     * @param {string} slug
     * @returns {Promise<object|null>}
     */
    async getBySlug(slug) {
        const encoded = encodeURIComponent(slug);
        const response = await callEndpoint(`/catalogs/slug/${encoded}`);
        return response.data ?? null;
    }

    /**
     * Ajoute un nouveau catalogue.
     * @param {object} catalog
     * @returns {Promise<object>}
     */
    async add(catalog) {
        const body = new FormData();
        body.append('name', catalog.name);
        body.append('slug', catalog.slug ?? slugify(catalog.name));
        body.append('description', catalog.description ?? '');
        if (catalog.image) body.append('image', catalog.image);

        const response = await callEndpoint('/catalogs', 'POST', body);
        return response.data;
    }

    /**
     * Met à jour un catalogue existant.
     * @param {string} id - ID du catalogue
     * @param {object} catalog
     * @returns {Promise<object>}
     */
    async update(id, catalog) {
        const body = new FormData();
        body.append('name', catalog.name);
        body.append('slug', catalog.slug ?? slugify(catalog.name));
        body.append('description', catalog.description ?? '');
        if (catalog.image) body.append('image', catalog.image);

        const response = await callEndpoint(`/catalogs/${id}`, 'PATCH', body);
        return response.data;
    }

    /**
     * Alterne la visibilité d'un catalogue.
     * @param {string} id - ID du catalogue
     * @returns {Promise<object>}
     */
    async toggleVisibility(id) {
        const response = await callEndpoint(`/catalogs/${id}/hide-or-show`, 'PATCH');
        return response.data;
    }

    /**
     * Charge les images des produits liées.
     * @returns {Promise<object[]>}
     */
    async getImages() {
        const response = await callEndpoint('/catalogs/product-image');
        return response.data;
    }
}

export default new CatalogService();
