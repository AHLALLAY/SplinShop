import express from 'express';
import isAuthenticated from '../../middlewares/auth.middleware.js';
import requireAdmin from '../../middlewares/admin.middleware.js';
import productController from '../../controllers/admin/product.controller.js';

const router = express.Router();

router.post('/', isAuthenticated, requireAdmin, productController.addProduct);

export default router;