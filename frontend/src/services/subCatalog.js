import callEndpoint from './apiHandler';

const subCatalogService = {
    /**
     * @param {string} catalogId 
     * @returns {Promise<any[]>}
     */
    async getByCatalog(catalogId) {
        const response = await callEndpoint(`/catalogs/${catalogId}/subcatalogs`);
        return response.data;
    },

    /**
     * @param {string} catalogId 
     * @param {object} data 
     * @returns {Promise<any>}
     */
    async add(catalogId, data) {
        const response = await callEndpoint(`/catalogs/${catalogId}/subcatalogs`, 'POST', data);
        return response.data;
    },
};

export default subCatalogService;
