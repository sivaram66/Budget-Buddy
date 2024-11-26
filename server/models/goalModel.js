import mongoose from "mongoose";

import { v4 as uuidv4 } from "uuid";

const goalSchema = {
    goalId: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4, // Use uuidv4 to generate a unique ID
    },
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    deadline: {
        type: Date,
        required: false,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    targetAmount: {
        type: Number,
        required: true,
    },
    currentAmount: {
        type: Number,
        required: true,
    }
}

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;