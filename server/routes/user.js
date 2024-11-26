import express from "express";
import { protectRoute } from "../middlewares/jwtAuthentication.js";

const router = express.Router();

import { editDetailsController, getDetailsController } from "../controllers/userController.js";

router.get("/getDetails", protectRoute, getDetailsController);

router.put("/editDetails", protectRoute, editDetailsController);

export default router;

