import expense from "../models/expensesModel.js";
import { sendExpenseEmail } from "../utils/mailer.js";
import { User } from "../models/userModel.js";

// ----- GET expenses for a user -----
export const getExpensesController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const expenses = await expense.find({ userId: userId });
    res.status(200).json({ expenses });
  } catch (error) {
    console.error("Error in get expenses controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ----- CREATE expense AND send mail (if enabled) -----
export const createExpenseController = async (req, res) => {
  const userId = req.user.userId;
  const { amount, category, description } = req.body;
  const date = new Date();
  const newExpense = new expense({
    userId,
    amount,
    date,
    category,
    description,
  });
  try {
    await newExpense.save();
    // ----- Check User Transaction Notification preference -----
    const user = await User.findOne({ userId });
    if (user?.transactionEmailsEnabled) {
      await sendExpenseEmail(
        user.email,
        {
          name: user.name,
          description,
          amount,
          category,
          date: date.toLocaleDateString("en-IN"),
        }
      );
      console.log("Expense email sent to user (notifications ON)");
    } else {
      console.log("Expense email NOT sent (notifications OFF)");
    }
    res.status(201).json({ expense: newExpense, message: "Expense added successfully" });
  } catch (error) {
    console.error("Error in create expenses controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ----- EDIT expense -----
export const editExpenseController = async (req, res) => {
  try {
    const { amount, category, description } = req.body;
    const { eId } = req.params;
    const updatedExpense = await expense.findByIdAndUpdate(
      eId, 
      { amount, category, description },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({ expense: updatedExpense, message: "Expense updated successfully" });
  } catch (error) {
    console.error("Error in edit expenses controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
