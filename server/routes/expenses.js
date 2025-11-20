import express from "express";

const router = express.Router();

import {
  getExpensesController,
  createExpenseController,
  editExpenseController,
} from "../controllers/expensesontroller.js";

import { createExpense } from "../middlewares/createExpense.js";
import { protectRoute } from "../middlewares/jwtAuthentication.js";
import { deleteExpenseController } from "../controllers/deleteExpenseController.js";
import { createExpense2 } from "../middlewares/createExpense2.js";
import { createExpense3 } from "../middlewares/createExpense3.js";

router.get("/getExpenses", protectRoute, getExpensesController);

router.post(
  "/createExpense",
  protectRoute,
  createExpense3,
  createExpenseController
);
router.post("/newExpense", protectRoute, createExpenseController);

router.delete("/deleteExpense/:id", protectRoute, deleteExpenseController);
router.put("/updateExpense/:eId", protectRoute, editExpenseController);

export default router;
