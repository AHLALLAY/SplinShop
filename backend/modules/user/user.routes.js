import express from 'express';
import userCtrl from './user.ctrl.js';
import isAuthenticated from '../../middlewares/auth.middleware.js';
import requireAdmin from '../../middlewares/admin.middleware.js';

const router = express.Router();

router.post('/', isAuthenticated, requireAdmin, userCtrl.add);
router.get('/', isAuthenticated, requireAdmin, userCtrl.getAll);
router.get('/admin-phone', userCtrl.getAdminPhone);

export default router;
