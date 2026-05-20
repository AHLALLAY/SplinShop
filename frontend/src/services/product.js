import callEndpoint from './apiHandler';

class Product {
    async addProduct(product) {
        const body = new FormData();
        body.append('catalogId', product.catalogId);
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

    async loadByCatalog(catalogId) {
        const response = await callEndpoint(
            `/products?catalogId=${encodeURIComponent(catalogId)}`,
        );
        return response?.data ?? [];
    }
}

export default new Product();
