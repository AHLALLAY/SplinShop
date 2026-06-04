import callEndpoint from './apiHandler';

class SellerService {
    /** 
     * Récupère la liste des vendeurs actifs.
     * @returns {Promise<object[]>} Liste des vendeurs
     */
    async getAll() {
        const response = await callEndpoint('/sellers');
        return response.data;
    }

    /**
     * Crée un nouveau vendeur.
     * @param {{ name: string, email: string, password: string, phone?: string }} payload
     * @returns {Promise<object>} Le vendeur créé
     */
    async add(payload) {
        const response = await callEndpoint('/sellers', 'POST', payload);
        return response.data;
    }

    /**
     * Récupère le numéro de l'admin.
     * @returns {Promise<string>} Numéro de téléphone
     */
    async getAdminPhone() {
        const response = await callEndpoint('/sellers/admin-phone');
        return response.data?.phone || null;
    }
}

export default new SellerService();
