import { User } from "../models/userModel.js";

export const getDetailsController = async (req, res) => {
    try {
        console.log(req.body);

        const userId = req.body.userId;
        const user = await User.findOne({ userId: userId });
        if (!user) {
            res.status(500).json({ message: "User Not found" });
        }
        const user1 = { name: user.name, email: user.email, plan: "pro" };
        res.status(200).json({ user: user1 })
    }
    catch (error) {
        console.error("Error in userController", error);
    }
}


export const editDetailsController = async (req, res) => {
    try {
        const { userId, name, email } = req.body;
        const user = await User.findOneAndUpdate({ userId: userId }, {
            name: name,
            email: email,
            plan: "pro"
        },
            { new: true });
        if (!user) {
            res.status(500).json({ message: "User Not found" });
        }
        res.status(201).json({ message: "User Details Updated Sucesfully" });
    } catch (error) {
        console.error("Error in userController", error);
    }

}