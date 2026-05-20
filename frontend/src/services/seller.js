import callEndpoint from './apiHandler';

class Seller {
    async loadSeller() {
        const sellers = await callEndpoint('/sellers');
        return sellers.data;
    }
}

export default new Seller();
