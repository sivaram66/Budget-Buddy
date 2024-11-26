import express from "express";

const router = express.Router();

import { signup } from "../controllers/signupController.js";

import { signupValidation } from "../middlewares/zodvaliation.js";

router.post("/", signupValidation, signup);

export default router;
