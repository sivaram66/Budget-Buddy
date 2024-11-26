// routes/login.js

import express from "express";

const router = express.Router();

import { authenticate } from "../middlewares/jwtAuthentication.js";

import { login, setJWTCookie } from "../controllers/loginController.js";

import { loginValidation } from "../middlewares/zodvaliation.js";

router.post("/", loginValidation, login, setJWTCookie);

router.get("/checkAuth", authenticate, setJWTCookie);

export default router;
