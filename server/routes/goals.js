import express from "express";

const router = express.Router();

import { protectRoute } from "../middlewares/jwtAuthentication.js";

import { getGoalsController, addGoalController, editGoalController, deleteGoalController } from "../controllers/goalsController.js"

router.get("/getGoals", protectRoute, getGoalsController);

router.post("/addGoal", protectRoute, addGoalController);

router.put("/editGoal", protectRoute, editGoalController);

router.put("/deleteGoal", protectRoute, deleteGoalController);

export default router;