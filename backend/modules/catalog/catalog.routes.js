import express from 'express';
import catalogCtrl from './catalog.ctrl.js';
import subCatalogCtrl from './subCatalog.ctrl.js';
import isAuthenticated from '../../middlewares/auth.middleware.js';
import requireAdmin from '../../middlewares/admin.middleware.js';
import { uploadCatalogImage, handleMulterError } from '../../middlewares/upload.middleware.js';

const router = express.Router();

router.post(
    '/',
    isAuthenticated,
    requireAdmin,
    uploadCatalogImage,
    handleMulterError,
    catalogCtrl.add,
);
router.get('/', catalogCtrl.getAll);
router.get('/slug/:slug', catalogCtrl.getBySlug);
router.get('/all', isAuthenticated, requireAdmin, catalogCtrl.getAdminAll);
router.patch(
    '/:id/hide-or-show',
    isAuthenticated,
    requireAdmin,
    catalogCtrl.toggleVisibility,
);
router.patch(
    '/:id',
    isAuthenticated,
    requireAdmin,
    uploadCatalogImage,
    handleMulterError,
    catalogCtrl.update,
);

router.get('/product-image', catalogCtrl.getImages);

// Routes pour les sous-catégories
router.get('/:id/subcatalogs', subCatalogCtrl.getByCatalog);
router.post('/:id/subcatalogs', isAuthenticated, requireAdmin, subCatalogCtrl.add);

export default router;
