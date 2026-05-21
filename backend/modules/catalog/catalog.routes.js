import express from 'express';
import catalogController from './catalog.controller.js';
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
    catalogController.addCatalog,
);
router.get('/', catalogController.getCatalogs);
router.get('/all', isAuthenticated, requireAdmin, catalogController.getCatalogsAdmin);
router.patch(
    '/:id/hide-or-show',
    isAuthenticated,
    requireAdmin,
    catalogController.hideOrShowCatalog,
);
router.patch(
    '/:id',
    isAuthenticated,
    requireAdmin,
    uploadCatalogImage,
    handleMulterError,
    catalogController.updateCatalog,
);

export default router;
