import express from 'express';
import isAuthenticated from '../../middlewares/auth.middleware.js';
import requireAdmin from '../../middlewares/admin.middleware.js';
import statisticCtrl from './statistic.ctrl.js';

const router = express.Router();

router.get(
    '/all',
    isAuthenticated,
    requireAdmin,
    statisticCtrl.getAll,
);

export default router;