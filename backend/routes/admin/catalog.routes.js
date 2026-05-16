import express from 'express';
import catalogController from "../../controllers/admin/catalog.controller.js";
import isAuthenticated from '../../middlewares/auth.middleware.js';
import requireAdmin from '../../middlewares/admin.middleware.js';
import { uploadCatalogImage, handleMulterError } from '../../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/', isAuthenticated, requireAdmin, uploadCatalogImage, handleMulterError, catalogController.addCatalog);
router.get('/', catalogController.getCatalogs);


export default router;