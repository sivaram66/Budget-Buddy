import "dotenv/config";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const createExpense2 = async (req, res, next) => {

    const prompt = `
    You are an expense categorization tool. Assign the provided expense to one category from this required list:
    Food & Dining
    Transportation
    Shopping
    Entertainment
    Bills & Utilities
    Other
    Rule 1: Choose the most fitting category.
    Rule 2: If an expense could fit in "Food & Dining", "Transportation", "Shopping", "Entertainment", or "Bills & Utilities", you must choose one of those.
    Rule 3: Only assign to "Other" as a last resort when no other category is suitable.`;

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);
    const expenseStatement = req.body.expense.statement;
    const schema = {
        description: `Expense Categorization`,
        type: SchemaType.OBJECT,
        properties: {
            amount: {
                type: SchemaType.STRING,
                description: "Amount spent on the expense",
                nullable: false,
            },
            category: {
                type: SchemaType.STRING,
                description: "Category of the expense",
                nullable: false,
            },
            description: {
                type: SchemaType.STRING,
                description: "Description of the expense",
                nullable: false,
            },
            error: {
                type: SchemaType.STRING,
                description: "If insufficient data or anything else mention error with reason",
                nullable: true,
            }
        },
        required: ["amount", "category", "description"],
    };

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-8b",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    const result = await model.generateContent(expenseStatement);
    const expense = JSON.parse(result.response.text());
    console.log(result.response.text());
    if (expense.error) {
        return res.status(400).json({
            message: "Error in creating expense, Insufficent Information",
        });
    }
    const finalExpense = {
        userId: req.body.userId,
        amount: expense.amount,
        date: new Date(),
        category: expense.category,
        description: expense.description,
    };
    console.log("Final expense:", finalExpense);
    console.log("Passing Control to Main controller...");
    req.body = finalExpense;
    next();
}