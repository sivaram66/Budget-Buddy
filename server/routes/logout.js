import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  // Clear the JWT from cookies
  res.clearCookie("jwt");
  res.clearCookie("jwt", {
    httpOnly: true, // Recommended for security
    secure: true, // Recommended for HTTPS connections
    sameSite: "none", // Use "strict" with caution
  });

  // Redirect to the login page
  res.status(200).json({ message: "Logout Successful" });
});

export default router;
