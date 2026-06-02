import express from "express";
import authCtrl from "./auth.ctrl.js";

const router = express.Router();

router.post('/login', authCtrl.login);
router.post('/register', authCtrl.register);

export default router;