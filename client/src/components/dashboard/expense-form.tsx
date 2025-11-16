import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { ExpenseFormMode } from "@/lib/types"
import axios from "axios"
const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Other",
]

interface ExpenseFormProps {
  onSubmit: (data: any) => void
}

export function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const [mode, setMode] = useState<ExpenseFormMode>("normal")
  const [statement, setStatement] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [resMsg, setresMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const serverUrl = import.meta.env.VITE_APP_SERVER_URL;

  try {
    let response;
    
    if (mode === "normal") {
      // Normal mode = AI-powered natural language (uses statement)
      if (!statement.trim()) {
        setresMsg("Please enter an expense statement");
        return;
      }
      
      response = await axios.post(
        `${serverUrl}expense/createExpense`, 
        { expense: { statement } },  // ✅ Correct format for AI
        { withCredentials: true }
      );
    } else {
      // Advanced mode = Manual form (uses amount, category, description)
      if (!amount || parseFloat(amount) <= 0) {
        setresMsg("Please enter a valid amount");
        return;
      }
      if (!category) {
        setresMsg("Please select a category");
        return;
      }
      if (!description.trim()) {
        setresMsg("Please add a description");
        return;
      }
      
      response = await axios.post(
        `${serverUrl}expense/newExpense`,
        { 
          amount: parseFloat(amount), 
          category, 
          description 
        },  // ✅ Correct format for manual entry
        { withCredentials: true }
      );
    }

    if (response.status === 201) {
      const msg = response.data.message;
      console.log(msg);
      setresMsg(msg);
      
      // Reset form after successful submission
      setStatement("");
      setAmount("");
      setCategory("");
      setDescription("");
      
      // Call parent onSubmit if needed
      onSubmit(response.data.expense);
    }
  } catch (error: unknown) {
    console.error("Error: " + error);
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || 
        error.message || 
        "An unexpected error occurred";
      setresMsg(errorMsg);
    } else {
      setresMsg("An unexpected error occurred");
    }
  }
};

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Add Expense</CardTitle>
          <Toggle
            pressed={mode === "advanced"}
            onPressedChange={(pressed) =>
              setMode(pressed ? "advanced" : "normal")
            }
          >
            Advanced
          </Toggle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "normal" ? (
            <div className="space-y-2">
              <Label htmlFor="statement">Expense Statement</Label>
              <Textarea
                id="statement"
                placeholder="Enter your expense (e.g., 'Lunch at McDonald's for $12.50')"
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
              />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add details about the expense"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </>
          )}
          <Button type="submit" className="w-full">
            Add Expense
          </Button>
          <p>{resMsg}</p>
        </form>
      </CardContent>
    </Card>
  )
}