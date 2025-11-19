import { User } from "../models/userModel.js";
import { sendVerificationCode } from "../utils/mailer.js";

const pendingVerifications = {}; // For demo. Use DB/Redis for production.

export const signup = async (req, res) => {
  try {
    const { name, email, password, dateOfBirth } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    pendingVerifications[email] = { code, name, dateOfBirth, password, time: Date.now() };
    await sendVerificationCode(email, code);
    res.status(200).json({ message: "Verification code sent to email" });
  } catch (error) {
    console.error("Error in user signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyCode = async (req, res) => {
  const { email, code } = req.body;
  const pending = pendingVerifications[email];
  if (!pending) {
    return res.status(400).json({ message: "No pending verification for this email" });
  }
  if (parseInt(code) !== pending.code) {
    return res.status(400).json({ message: "Incorrect verification code" });
  }
  if (Date.now() - pending.time > 10 * 60 * 1000) {
    delete pendingVerifications[email];
    return res.status(400).json({ message: "Verification code expired" });
  }
  // Optional: Hash password before save!
  const newUser = new User({ name: pending.name, dateOfBirth: pending.dateOfBirth, email, password: pending.password });
  await newUser.save();
  delete pendingVerifications[email];
  res.status(201).json({ message: "User created successfully!", user: newUser });
};
