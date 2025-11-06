import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// trust proxy so secure cookies work behind Render's proxy
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());


const FRONTENDS = [
  "http://localhost:5173",
  "https://budget-buddyy-v90d.onrender.com", 
];

// allow list function so you can add/remove origins easily
const corsOptions = {
  origin(origin, cb) {
    // allow non-browser tools (curl/postman) & health
    if (!origin) return cb(null, true);
    if (FRONTENDS.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS: Origin not allowed: ${origin}`), false);
  },
  credentials: true,
};

// apply CORS to everything except /health
app.use((req, res, next) => {
  if (req.path === "/health") return next();
  return cors(corsOptions)(req, res, next);
});

// handle preflight for all routes
app.options("*", cors(corsOptions));

// DB
connectDB();

// health route (no CORS)
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

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
