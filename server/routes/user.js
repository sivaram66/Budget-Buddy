import express from "express";
import { protectRoute } from "../middlewares/jwtAuthentication.js";
import { getEmailPrefs, updateEmailPrefs } from "../controllers/userController.js";
const router = express.Router();


import { editDetailsController, getDetailsController } from "../controllers/userController.js";

router.get("/email-prefs", protectRoute, getEmailPrefs);

router.patch("/email-prefs", protectRoute, updateEmailPrefs);

router.get("/getDetails", protectRoute, getDetailsController);

router.put("/editDetails", protectRoute, editDetailsController);

export default router;

