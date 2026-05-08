import express from "express";
import userController from "../../controllers/admin/user.controller.js";

const router = express.Router();

router.post('/', userController.addSeller)
router.get('/', userController.getSellers)

export default router;