import express from 'express';
import catalogController from "../../controllers/admin/catalog.controller.js";
import isAuthenticated from '../../middlewares/auth.middleware.js';
import requireAdmin from '../../middlewares/admin.middleware.js';

const router = express.Router();

router.post('/', isAuthenticated, requireAdmin, catalogController.addCatalog);


export default router;