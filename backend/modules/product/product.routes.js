import express from 'express';
import isAuthenticated from '../../middlewares/auth.middleware.js';
import requireAdmin from '../../middlewares/admin.middleware.js';
import productCtrl from './product.ctrl.js';
import { uploadProductImage, handleMulterError } from '../../middlewares/upload.middleware.js';

const router = express.Router();

router.post(
    '/',
    isAuthenticated,
    requireAdmin,
    uploadProductImage,
    handleMulterError,
    productCtrl.add,
);
router.get('/', productCtrl.getByCatalog);
router.get('/all', isAuthenticated, requireAdmin, productCtrl.getAdminByCatalog);
    
router.patch(
    '/:id/hide-or-show',
    isAuthenticated,
    requireAdmin,
    productCtrl.toggleVisibility,
);
export default router;
