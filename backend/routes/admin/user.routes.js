import express from "express";
import userController from "../../controllers/admin/user.controller.js";
import isAuthenticated from "../../middlewares/auth.middleware.js";
import requireAdmin from "../../middlewares/admin.middleware.js";

const router = express.Router();

router.post('/', isAuthenticated, requireAdmin, userController.addSeller);
router.get('/', isAuthenticated, requireAdmin, userController.getSellers);

export default router;