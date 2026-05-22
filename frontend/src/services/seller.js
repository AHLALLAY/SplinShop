import callEndpoint from './apiHandler';

class Seller {
    /** @returns {Promise<object[]>} */
    async loadSeller() {
        const sellers = await callEndpoint('/sellers');
        return sellers.data;
    }

    /**
     * Crée un vendeur (admin).
     * @param {{ name: string, email: string, password: string, phone?: string }} payload
     * @returns {Promise<object>}
     */
    async addSeller(payload) {
        const response = await callEndpoint('/sellers', 'POST', payload);
        return response.data;
    }
}

export default new Seller();
