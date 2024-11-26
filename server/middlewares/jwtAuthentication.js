import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

const jwtSecretKey = process.env.JWT_SECRET_KEY;

//Function that creates the jwt
export function signToken(payload) {
  const token = jwt.sign(payload, jwtSecretKey, { expiresIn: "1w" });
  return token;
}

//Function to verify jwt
export function verifyToken(token) {
  try {
    const response = jwt.verify(token, jwtSecretKey);
    return response;
  } catch (error) {
    return null;
  }
}

export function authenticate(req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const user = verifyToken(token);
      if (user) {
        req.user = user;
        next();
      }
    } catch (err) {
      // Handle the error (e.g., send a response, log the error, etc.)
      console.error(err);
      return res.status(401).json({ error: "Invalid token" });
    }
  }
  else {
    res.status(401).json({ message: "Please Login" });
  }

}

export function protectRoute(req, res, next) {
  console.log("Protecting the route: authenticating token");
  const token = req.cookies.jwt;
  if (token) {
    try {
      const user = verifyToken(token);
      console.log("User: " + JSON.stringify(user));
      if (user) {
        req.body.userId = user.userId;
        // console.log("User ID:", user.userId);
        return next();
      }
    } catch (err) {
      // Handle the error (e.g., send a response, log the error, etc.)
      console.error(err);
      return res
        .status(401)
        .json({ error: "Invalid token", message: "Please Login" });
    }
  }
  return res
    .status(401)
    .json({ error: "Token not found", message: "Please Login" });
}
