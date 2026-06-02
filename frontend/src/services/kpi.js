import callEndpoint from "./apiHandler";

class KpiService {
    /**
     * Récupère toutes les statistiques.
     * @returns {Promise<object>} Les statistiques
     */
    async getAll() {
        const response = await callEndpoint('/statistics/all');
        return response.data;
    }
}

export default new KpiService();