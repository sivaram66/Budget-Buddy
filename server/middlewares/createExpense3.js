import "dotenv/config";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Define the schema outside the function for clarity and potential reuse
const expenseSchema = {
    description: `Expense Categorization`,
    type: SchemaType.OBJECT,
    properties: {
        amount: {
            type: SchemaType.STRING,
            description: "Amount spent on the expense (as a string, e.g., '45.50'). Extract only the numeric value.",
            nullable: false,
        },
        category: {
            type: SchemaType.STRING,
            description: "Category of the expense from the allowed list.",
            // Adding enum helps the model stick to the exact category names
            enum: ["Food & Dining", "Transportation", "Shopping", "Entertainment", "Bills & Utilities", "Other"],
            nullable: false,
        },
        description: {
            type: SchemaType.STRING,
            description: "A brief description of the expense based on the input statement. If the statement is already descriptive, use it.",
            nullable: false,
        },
        error: {
            type: SchemaType.STRING,
            description: "If the input statement is insufficient to determine amount, category, or description, or if processing fails for any reason, provide a brief explanation here (e.g., 'Missing amount', 'Statement too vague'). Otherwise, this should be null.",
            nullable: true,
        }
    },
    required: ["amount", "category", "description"], // Error is not required in the output unless applicable
};


// --- Revised Prompt ---
// This base prompt now includes placeholders for the statement and clearly outlines the JSON task.
const basePrompt = `
You are an expense processing tool. Analyze the following expense statement and extract the relevant details.
Your task is to return a JSON object that strictly adheres to the provided schema.

**Expense Statement to Analyze:**
"{expenseStatement}"

**Instructions & Categorization Rules:**

1.  **Extract Amount:** Identify the monetary amount. Return it as a string in the "amount" field (e.g., "50.25", "100"). If no amount is clearly stated or reasonably inferrable, populate the "error" field.
2.  **Categorize:** Assign the expense to the *single most appropriate* category from this required list:
    *   "Food & Dining"
    *   "Transportation"
    *   "Shopping"
    *   "Entertainment"
    *   "Bills & Utilities"
    *   "Other"
    Place the exact category name (case-sensitive) in the "category" field.
3.  **Categorization Prioritization:**
    *   You *must* choose one of the first five categories ("Food & Dining", "Transportation", "Shopping", "Entertainment", "Bills & Utilities") if the expense reasonably fits.
    *   Use the "Other" category *only* as a last resort when the expense cannot be logically placed in any of the first five categories.
4.  **Extract Description:** Provide a brief, concise description of the expense in the "description" field. You can use or adapt the original statement if it's suitable.
5.  **Error Handling:** If the expense statement is too vague, missing crucial information (like amount or a clear activity), or cannot be processed according to these rules, populate the "error" field with a *brief* explanation (e.g., "Missing amount", "Statement too vague", "Cannot determine category"). Otherwise, ensure the "error" field is null.
6.  **Output Format:** Return *only* the valid JSON object matching the schema. Do not include any introductory text, explanations, or markdown formatting outside the JSON structure itself.

**JSON Schema Reminder (for your internal processing):**
{
  "amount": string (required),
  "category": string (enum: ["Food & Dining", "Transportation", "Shopping", "Entertainment", "Bills & Utilities", "Other"], required),
  "description": string (required),
  "error": string | null
}
`;

export const createExpense3 = async (req, res, next) => {
    try {
        // Validate input: Ensure expense statement exists
        const expenseStatement = req.body?.expense?.statement;
        if (!expenseStatement || typeof expenseStatement !== 'string' || expenseStatement.trim() === '') {
            return res.status(400).json({
                message: "Missing or invalid expense statement in request body (req.body.expense.statement)",
            });
        }

        // Ensure userId exists (assuming it's needed later)

        const userId = req.user?.userId || req.user?.id || req.user?._id;
        if (!userId) {
            console.error("Error: User ID missing from token in createExpense3");
            return res.status(401).json({ message: "User not authenticated properly" });
        }

        // --- Combine Base Prompt and Expense Statement ---
        const fullPrompt = basePrompt.replace("{expenseStatement}", expenseStatement);

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash", // Use the specific model - check documentation for latest recommended models
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: expenseSchema, // Pass the schema object here
            },
            // Optional: Add safety settings if needed
            // safetySettings: [...]
        });

        console.log("Sending combined prompt to AI..."); // Don't log the full prompt in production if it contains sensitive info

        const result = await model.generateContent(fullPrompt);

        console.log("Raw AI Response Text:", result.response.text()); // Log raw response for debugging

        let expenseData;
        try {
            // The response should already be JSON formatted text due to responseMimeType
            expenseData = JSON.parse(result.response.text());
        } catch (parseError) {
            console.error("Failed to parse AI JSON response:", parseError);
            console.error("Raw response was:", result.response.text());
            // Send an error response as the AI output was not valid JSON
            return res.status(500).json({ message: "Internal Server Error: Could not parse AI response." });
        }

        console.log("Parsed AI Response Data:", expenseData);

        // --- Handle AI Response ---
        // Check if the AI itself reported an error
        if (expenseData.error) {
            console.log("AI reported an error:", expenseData.error);
            // Use the error message from the AI
            return res.status(400).json({
                message: `Error processing expense: ${expenseData.error}`,
                details: expenseData // Optionally send back the full AI response details
            });
        }

        // Optional extra validation: Check if required fields are truly present (though schema should enforce this)
        if (!expenseData.amount || !expenseData.category || !expenseData.description) {
            console.error("AI response missing required fields despite schema:", expenseData);
            return res.status(500).json({ message: "Internal Server Error: AI response structure invalid." });
        }

        // --- Prepare Final Expense Object ---
        const finalExpense = {
            userId: userId, // Ensure userId is correctly passed in the request
            amount: expenseData.amount,     // Use data extracted by AI
            date: new Date(),               // Use current date/time
            category: expenseData.category, // Use data extracted by AI
            description: expenseData.description, // Use data extracted by AI
        };

        console.log("Constructed Final expense:", finalExpense);
        console.log("Passing Control to Main controller...");

        // --- Pass control ---
        // Replace the original req.body with the processed expense data
        // so the next middleware/controller receives the structured object
        req.body = finalExpense;
        next();

    } catch (error) {
        console.error("Error in createExpense2 middleware:", error);
        // Pass the error to the next error-handling middleware in Express
        // or send a generic server error response
        // next(error); // Use this if you have a dedicated Express error handler
        return res.status(500).json({ message: "Internal Server Error occurred while processing expense." }); // Or send this directly
    }
};
