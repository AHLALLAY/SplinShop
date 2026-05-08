import useEndPoint from "./apiHandler";

class Seller {
    async loadSeller() {
        try {
            const sellers = await useEndPoint("/seller");
            return sellers.data;
        } catch (err) {
            throw err;
        }
    }
}

export default new Seller();