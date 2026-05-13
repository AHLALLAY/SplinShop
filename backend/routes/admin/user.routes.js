import express from "express";
import userController from "../../controllers/admin/user.controller.js";
import isAuthenticated from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/', isAuthenticated, userController.addSeller)
router.get('/', isAuthenticated, userController.getSellers)

export default router;