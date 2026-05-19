import express from 'express';
import isAuthenticated from '../../middlewares/auth.middleware.js';
import requireAdmin from '../../middlewares/admin.middleware.js';
import productController from '../../modules/product/product.controller.js';
import { uploadProductImage, handleMulterError } from '../../middlewares/upload.middleware.js';

const router = express.Router();

router.post(
    '/',
    isAuthenticated,
    requireAdmin,
    uploadProductImage,
    handleMulterError,
    productController.addProduct,
);
router.get('/', productController.getProductsByCatalog);

export default router;
