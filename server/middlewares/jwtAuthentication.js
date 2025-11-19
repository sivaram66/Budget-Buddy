import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

export function signToken(payload) {
  const token = jwt.sign(payload, jwtSecretKey, { expiresIn: "1w" });
  return token;
}

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
  if (!token) {
    return res.status(401).json({ message: "Please Login" });
  }
  
  try {
    const user = verifyToken(token);
    if (user) {
      req.user = user;
      return next(); 
    }
    return res.status(401).json({ error: "Invalid token" }); 
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function protectRoute(req, res, next) {
  console.log("Protecting the route: authenticating token");
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ error: "Token not found", message: "Please Login" });
  }
  
  try {
    const user = verifyToken(token);
    console.log("User: " + JSON.stringify(user));
    if (user) {
      req.body.userId = user.userId;
      return next(); // This is correct
    }
    return res.status(401).json({ error: "Invalid token", message: "Please Login" });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Invalid token", message: "Please Login" });
  }
}
