import Goal from "../models/goalModel.js";

export const getGoalsController = async (req, res) => {
    try {
        const userId = req.body.userId;
        const goals = await Goal.find({ userId: userId }); // Added await here
        if (goals) {
            res.status(200).json({ goals: goals });
        }
    } catch (error) {
        console.error("Error in get Goals controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const addGoalController = async (req, res) => {
    try {
        console.log("RequestBody", req.body);
        const { name, description, targetAmount, currentAmount, deadline, userId } = req.body;

        const newGoal = new Goal({
            name,
            description,
            targetAmount,
            currentAmount,
            deadline,
            userId
        })
        await newGoal.save();
        console.log("Goal Added succesfully");
        res.status(200).json({ message: "Goal Added Successfully" });
    }
    catch (error) {
        console.error("Error in get Goals controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const editGoalController = async (req, res) => {
    try {
        console.log("Req Body: ", req.body);

        const { goalId, name, description, targetAmount, currentAmount } = req.body;
        const updatedGoal = await Goal.findOneAndUpdate(
            { goalId: goalId },
            {
                name: name,
                description: description,
                targetAmount: targetAmount,
                currentAmount: currentAmount
            },
            { new: true }
        );
        if (!updatedGoal) {
            res.status(404).json({ message: "Goal not found in database" });
        }
        res.status(200).json({ message: "Goal Updated Sucessfully" });
    }
    catch (error) {
        console.error("Error in get Goals controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteGoalController = async (req, res) => {
    try {
        const goalId = req.body.goalId;
        if (!goalId) {
            res.status(400).json({ message: "Goal Id is required" });
        }
        await Goal.findOneAndDelete({ goalId: goalId });
        res.status(200).json({ message: "Goal Sucessfully deleted" });
    }
    catch (error) {
        console.error("Error in get Goals controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}