// Import necessary modules and dependencies
import expense from "../models/expensesModel.js";
// Define the deleteExpenseController function
export const deleteExpenseController = async (req, res) => {
  try {
    // Get the eId from the request parameters
    const { eId } = req.params;
    if (!eId || eId == undefined) {
      // Return an error response if eId is missing
      return res.status(400).json({ message: "eId is required" });
    }
    console.log("Deleteing Expense with eId: ", eId);
    // Find the expense by eId and delete it
    await expense.findOneAndDelete({ eId });
    // Return a success response
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    // Handle any errors that occur during the deletion process
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the expense" });
  }
};

// Export the deleteExpenseController function
