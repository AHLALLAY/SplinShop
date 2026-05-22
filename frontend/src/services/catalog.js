import callEndpoint from './apiHandler';
import { slugify } from '../utils/slug';

class Catalog {
    /** @returns {Promise<{ data: unknown }>} */
    async loadCatalog() {
        return callEndpoint('/catalogs');
    }

    /** Liste complète pour l’admin (y compris catalogues masqués). */
    async loadCatalogAdmin() {
        return callEndpoint('/catalogs/all');
    }

    async loadBySlug(slug) {
        const encoded = encodeURIComponent(slug);
        const response = await callEndpoint(`/catalogs/slug/${encoded}`);
        return response.data ?? null;
    }

    async addCatalog(catalog) {
        const body = new FormData();
        body.append('name', catalog.name);
        body.append('slug', catalog.slug ?? slugify(catalog.name));
        body.append('description', catalog.description ?? '');
        if (catalog.image) body.append('image', catalog.image);

        const response = await callEndpoint('/catalogs', 'POST', body);
        return response.data;
    }

    async updateCatalog(catalogId, catalog) {
        const body = new FormData();
        body.append('name', catalog.name);
        body.append('slug', catalog.slug ?? slugify(catalog.name));
        body.append('description', catalog.description ?? '');
        if (catalog.image) body.append('image', catalog.image);

        const response = await callEndpoint(`/catalogs/${catalogId}`, 'PATCH', body);
        return response.data;
    }

    async hideCatalog(catalogId) {
        return callEndpoint(`/catalogs/${catalogId}/hide-or-show`, 'PATCH');
    }
}

export default new Catalog();
