import callEndpoint from './apiHandler';
import { slugify } from '../utils/slug';

class Catalog {
    /** @returns {Promise<{ data: unknown }>} */
    async loadCatalog() {
        return callEndpoint('/catalogs');
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
}

export default new Catalog();
