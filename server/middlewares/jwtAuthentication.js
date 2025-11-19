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
    console.log("Authenticated user:", user); // <-- Add here
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

  // Safety Check: Ensure cookie-parser is working
  if (!req.cookies) {
    console.error("No cookies object found! Is cookie-parser installed?");
    return res.status(401).json({ error: "Auth Config Error" });
  }

  // 1. Get the token
  const token = req.cookies.jwt;
  
  if (!token) {
    console.log("Token missing in cookies");
    return res.status(401).json({ error: "Token not found", message: "Please Login" });
  }
  
  try {
    // 2. Verify the token
    const user = verifyToken(token);
    
    if (user) {
      console.log("Token verified for user:", user.userId);
      
      // --- THE FIX IS HERE ---
      // Instead of req.body.userId = user.userId;
      // We attach the whole user object to req.user
      req.user = user; 
      
      return next(); 
    }
    
    return res.status(401).json({ error: "Invalid token", message: "Please Login" });
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({ error: "Invalid token", message: "Please Login" });
  }
}