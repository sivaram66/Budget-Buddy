import { User } from "../models/userModel.js";

// ----- GET USER DETAILS (Fixed) -----
export const getDetailsController = async (req, res) => {
    try {
        // ❌ OLD WAY: req.body.userId (Doesn't work in GET requests)
        // ✅ NEW WAY: Get it from req.user
        const userId = req.user.userId || req.user.id || req.user._id;

        if (!userId) {
            return res.status(400).json({ message: "User ID missing from token" });
        }

        const user = await User.findOne({ userId: userId });
        
        if (!user) {
            return res.status(404).json({ message: "User Not found" });
        }

        // Only send back necessary info (exclude password)
        const userData = { 
            name: user.name, 
            email: user.email, 
            plan: "pro" // or user.plan 
        };
        
        res.status(200).json({ user: userData });
    } catch (error) {
        console.error("Error in getDetailsController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// ----- EDIT USER DETAILS (Fixed) -----
export const editDetailsController = async (req, res) => {
    try {
        // ✅ Get ID from token (Secure)
        const userId = req.user.userId || req.user.id || req.user._id;
        
        // Get data to update from body
        const { name, email } = req.body;

        const user = await User.findOneAndUpdate(
            { userId: userId }, 
            {
                name: name,
                email: email,
                // plan: "pro" // careful hardcoding this!
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User Not found" });
        }

        res.status(200).json({ message: "User Details Updated Successfully", user });
    } catch (error) {
        console.error("Error in editDetailsController", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// ... keep your existing updateEmailPrefs and getEmailPrefs functions ...
export const updateEmailPrefs = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user?._id; 
    const { transactionEmailsEnabled } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const user = await User.findOneAndUpdate({ userId }, { transactionEmailsEnabled }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Preferences updated", enabled: user.transactionEmailsEnabled });
  } catch (err) {
    console.error("Error in updateEmailPrefs:", err);
    res.status(500).json({ message: "Error updating preferences" });
  }
};

export const getEmailPrefs = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: "User not authenticated" });
    
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.status(200).json({ transactionEmailsEnabled: user.transactionEmailsEnabled });
  } catch (err) {
    res.status(500).json({ message: "Error fetching preferences" });
  }
};