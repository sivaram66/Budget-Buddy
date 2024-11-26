import { useState, useEffect } from "react"
import { ExpenseForm } from "@/components/dashboard/expense-form"
import { ExpenseTable } from "@/components/dashboard/expense-table"
import { Expense } from "@/lib/types"
import axios from "axios"

// Mock data
const initialExpenses: Expense[] = [
  {
    eId: "edi01",
    id: "1",
    description: "Lunch at McDonald's",
    amount: 12.50,
    category: "Food & Dining",
    date: new Date().toISOString(),
  },
  {
    eId: "eId12",
    id: "2",
    description: "Uber ride to work",
    amount: 25.00,
    category: "Transportation",
    date: new Date().toISOString(),
  },
]

export function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const serverURL = import.meta.env.VITE_APP_SERVER_URL;

  const isToday = (date: string) => {
    const today = new Date();
    const expenseDate = new Date(date);
    return (
      today.getFullYear() === expenseDate.getFullYear() &&
      today.getMonth() === expenseDate.getMonth() &&
      today.getDate() === expenseDate.getDate()
    );
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${serverURL}expense/getExpenses`, { withCredentials: true });
      if (response.status === 200) {
        const todayExpenses = response.data.expenses.filter((expense: Expense) => isToday(expense.date));
        setExpenses(todayExpenses);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = (data: any) => {
    const newExpense: Expense = {
      eId: Math.random().toString(),
      id: Math.random().toString(),
      amount: data.amount || 0,
      category: data.category || "Uncategorized",
      description: data.description,
      date: new Date().toISOString(),
    }
    if (isToday(newExpense.date)) {
      setExpenses([newExpense, ...expenses])
    }
  }

  return (
    <div className="flex-1 p-8 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Recent Expenses</h2>
          <ExpenseTable expenses={[...expenses].reverse()} />
        </div>
        <div>
          <ExpenseForm onSubmit={async (data) => {
            handleAddExpense(data);
            await fetchExpenses();
          }} />
        </div>
      </div>
    </div>
  )
}