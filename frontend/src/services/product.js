import callEndpoint from './apiHandler';

class ProductService {
    /**
     * Ajoute un nouveau produit.
     * @param {object} product - Données du produit
     * @returns {Promise<object>} Le produit ajouté
     */
    async add(product) {
        const body = new FormData();
        body.append('subCatalogId', product.subCatalogId);
        body.append('name', product.name);
        body.append('price', String(product.price));
        body.append('quantity', String(product.quantity));
        if (product.slug) body.append('slug', product.slug);
        if (product.description) body.append('description', product.description);

        const files = product.images ?? [];
        for (const file of files) {
            body.append('images', file);
        }

        const response = await callEndpoint('/products', 'POST', body);
        return response.data;
    }

    /**
     * Liste les produits actifs d’un catalogue.
     * @param {string} catalogId - ID du catalogue
     * @returns {Promise<object[]>} Liste des produits
     */
    async getByCatalog(catalogId) {
        const response = await callEndpoint(
            `/products?catalogId=${encodeURIComponent(catalogId)}`,
        );
        return response?.data ?? [];
    }

    /**
     * Liste tous les produits d'un catalogue pour l'admin.
     * @param {string} catalogId - ID du catalogue
     * @returns {Promise<object[]>} Liste des produits
     */
    async getAdminByCatalog(catalogId) {
        const response = await callEndpoint(
            `/products/all?catalogId=${encodeURIComponent(catalogId)}`,
        );
        return response?.data ?? [];
    }

    /**
     * Masque ou affiche un produit.
     * @param {string} id - ID du produit
     * @returns {Promise<object>}
     */
    async toggleVisibility(id) {
        const response = await callEndpoint(`/products/${id}/hide-or-show`, 'PATCH');
        return response.data;
    }
}

export default new ProductService();
