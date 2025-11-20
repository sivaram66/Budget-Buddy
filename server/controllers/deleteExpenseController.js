import expense from "../models/expensesModel.js";

export const deleteExpenseController = async (req, res) => {
  try {
    // ✅ FIX: Extract 'id' (not eId) because your route is /:id
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Expense ID is required" });
    }

    console.log("Deleting Expense ID:", id);

    // ✅ FIX: Use findByIdAndDelete for standard MongoDB _id
    const deletedExpense = await expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete Controller Error:", error);
    res.status(500).json({ message: "Server error while deleting" });
  }
};