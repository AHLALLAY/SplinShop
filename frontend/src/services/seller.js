import callEndpoint from './apiHandler';

class Seller {
    async loadSeller() {
        const sellers = await callEndpoint('/sellers');
        return sellers.data;
    }

    async addSeller(payload) {
        const response = await callEndpoint('/sellers', 'POST', payload);
        return response.data;
    }
}

export default new Seller();
