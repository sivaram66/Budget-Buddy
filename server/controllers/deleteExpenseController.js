import expense from "../models/expensesModel.js";

export const deleteExpenseController = async (req, res) => {
  try {
    // 1. Extract 'id' (matching the route /:id)
    const { id } = req.params; 

    // 2. Validate it exists
    if (!id) {
      return res.status(400).json({ message: "Expense ID is required" });
    }

    console.log("Deleting Expense with ID: ", id);

    // 3. Use findByIdAndDelete (Standard Mongoose method for _id)
    // The previous code 'findOneAndDelete({ eId })' failed because 
    // the database field is named '_id', not 'eId'.
    const deletedExpense = await expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "An error occurred while deleting the expense" });
  }
};