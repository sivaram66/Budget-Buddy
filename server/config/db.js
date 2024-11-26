// db.js
import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process if unable to connect to the database
  }
}

export { connectDB };
