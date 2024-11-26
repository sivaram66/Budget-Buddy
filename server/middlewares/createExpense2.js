import "dotenv/config";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const createExpense2 = async (req, res, next) => {

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);
    const expenseStatement = req.body.expense.statement;
    const schema = {
        description: `Expense Categoriation, Use these as the main Categories:   "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Other", Any subcategories must be fit into the main categories or put it in other.`,
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