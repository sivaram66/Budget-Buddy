import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Configure CORS for specific routes
const corsOptions = {
  origin: process.env.MODE === "dev"
    ? ["http://localhost:5173", "https://budget-buddyy-v90d.onrender.com", "http://client:80", "http://client:3200", "http://localhost:3200"]
    : "https://budget-buddyy-v90d.onrender.com",
  credentials: true,
};

// Apply CORS middleware only for routes that need it
app.use((req, res, next) => {
  if (req.path !== "/health") {
    cors(corsOptions)(req, res, next);
  } else {
    next();
  }
});

// Connect to MongoDB
connectDB();

// Health check route (no CORS restrictions)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Routes
import signupRoute from "./routes/signup.js";
import loginRoute from "./routes/login.js";
import logoutRoute from "./routes/logout.js";
import dashboardRoute from "./routes/dashboard.js";
import expenseRoute from "./routes/expenses.js";
import goalsRoute from "./routes/goals.js";
import userRoute from "./routes/user.js";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/logout", logoutRoute);
app.use("/signup", signupRoute);
app.use("/login", loginRoute);
app.use("/dashboard", dashboardRoute);
app.use("/expense", expenseRoute);
app.use("/goals", goalsRoute);
app.use("/user", userRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
