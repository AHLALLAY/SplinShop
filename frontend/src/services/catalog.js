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

    async addCatalog(catalog) {
        const body = new FormData();
        body.append('name', catalog.name);
        body.append('slug', catalog.slug ?? slugify(catalog.name));
        body.append('description', catalog.description ?? '');
        if (catalog.image) body.append('image', catalog.image);

        const response = await callEndpoint('/catalogs', 'POST', body);
        return response.data;
    }

    async hideCatalog(catalogId) {
        return callEndpoint(`/catalogs/${catalogId}/hide`, 'PATCH');
    }
}

export default new Catalog();
