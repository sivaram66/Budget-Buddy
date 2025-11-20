import express from "express";
import { signup, verifyCode } from "../controllers/signupController.js";

import { signupValidation } from "../middlewares/zodvalidation.js"; 

const router = express.Router();

router.post("/signup", signupValidation, signup);

router.post("/verify-code", verifyCode);

export default router;