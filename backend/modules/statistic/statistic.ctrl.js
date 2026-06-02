import { asyncHandler } from '../../utils/asyncHandler.js';
import statisticService from './statistic.service.js';
import { sendApiResponse } from '../../utils/apiResponse.js';

/**
 * Contrôleur pour les statistiques.
 */
class StatisticCtrl {
    /**
     * Récupère toutes les statistiques.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    getAll = asyncHandler(async(req, res) => {
        const stats = await statisticService.getAll();
        sendApiResponse(res, {
            status: 200,
            success: true,
            message: 'Toutes les statistiques',
            data: stats,
        });
    })
}

export default new StatisticCtrl();
