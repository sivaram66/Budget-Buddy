import mongoose from "mongoose";

// Define the expense schema
const expenseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  eId: {
    type: String,
    required: true,
    unique: true,
  },
});

// Define a model middleware to generate and set the eId before saving
// Define a model middleware to generate and set the eId before validating
// Define a model middleware to generate and set the eId before validating
expenseSchema.pre("validate", async function (next) {
  try {
    // Get the user ID and date of the expense
    const userId = this.userId;
    const date = this.date.toISOString().split("T")[0]; // Extract YYYY-MM-DD from date

    // Get the current time in milliseconds
    const timestamp = Date.now();

    // Set the eId with the formatted date, userId, and timestamp
    this.eId = `${date}-${userId}-${timestamp}`;

    next();
  } catch (error) {
    next(error);
  }
});

// Export the Expense model based on the schema
export default mongoose.model("Expense", expenseSchema);
