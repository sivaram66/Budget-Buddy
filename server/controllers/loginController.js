import { User } from "../models/userModel.js";
import { signToken } from "../middlewares/jwtAuthentication.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Find user by email in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare passwords securely
    if (password != user.password) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // Attach user data to the request object
    req.user = {
      userId: user.userId,
      name: user.name,
      email: user.email,
    };
    next();
  } catch (error) {
    // Handle any errors that occur during login process
    console.error("Encountered Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const setJWTCookie = (req, res, next) => {
  const { userId, name, email } = req.user;
  const jwtPayload = { userId, name, email };
  const token = signToken(jwtPayload);

  const isDev = process.env.MODE === "dev";
  res.clearCookie("jwt");
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: !isDev,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: isDev ? "lax" : "none",
  });

  res.status(200).json({ message: "Login Successful" });
};
