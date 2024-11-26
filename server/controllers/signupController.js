// controllers/signupController.js
import { User } from "../models/userModel.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, dateOfBirth } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const newUser = new User({ name, dateOfBirth, email, password });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error in user signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
