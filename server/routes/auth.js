import express from "express";
import { signup, verifyCode } from "../controllers/signupController.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/verify-code", verifyCode);

export default router;
