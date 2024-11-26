import mongoose from "mongoose";

import { v4 as uuidv4 } from "uuid";

// Define the user schema
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4, // Use uuidv4 to generate a unique ID
  },
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create and export the User model based on the schema
export const User = mongoose.model("User", userSchema);
