import { useState, useEffect } from "react"
import { ExpenseForm } from "@/components/dashboard/expense-form"
import { ExpenseTable } from "@/components/dashboard/expense-table"
import { Expense } from "@/lib/types"
import axios from "axios"



export function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const serverURL = import.meta.env.VITE_APP_SERVER_URL;

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${serverURL}expense/getExpenses`, { withCredentials: true });
      if (response.status === 200) {
        const allExpenses = response.data.expenses || [];
        
        // Sort by date (most recent first) and take only the latest 5
        const sortedExpenses = allExpenses.sort((a: Expense, b: Expense) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        
        setExpenses(sortedExpenses.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (data: any) => {
  console.log("Form data received:", data);

  if (data.mode === "advanced") {
    // Advanced mode - we have all the data
    const newExpense: Expense = {
      eId: `temp-${Date.now()}`,
      id: `temp-${Date.now()}`,
      description: data.description,
      amount: data.amount,
      category: data.category,
      date: new Date().toISOString(),
    };

    // IMMEDIATELY update the UI
    setExpenses(prevExpenses => {
      const updated = [newExpense, ...prevExpenses];
      return updated.slice(0, 5);
    });

    // Save to backend
    try {
      await axios.post(
        `${serverURL}expense/newExpense`,
        {
          amount: data.amount,
          category: data.category,
          description: data.description
        },
        { withCredentials: true }
      );
      
      // Refresh to get real IDs
      await fetchExpenses();
    } catch (error) {
      console.error("Error:", error);
      // Remove optimistic update on failure
      setExpenses(prev => prev.filter(exp => exp.eId !== newExpense.eId));
    }
    
  } else {
    // Normal mode (AI-powered) - just send to backend and refresh
    try {
      await axios.post(
        `${serverURL}expense/createExpense`,
        { expense: { statement: data.statement } },
        { withCredentials: true }
      );
      
      // Refresh to show the AI-parsed expense
      await fetchExpenses();
    } catch (error) {
      console.error("Error:", error);
    }
  }
};


  return (
    <div className="flex-1 p-8 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Recent Expenses</h2>
          <ExpenseTable expenses={expenses} />
        </div>
        <div>
          <ExpenseForm onSubmit={handleAddExpense} />
        </div>
      </div>
    </div>
  )
}
