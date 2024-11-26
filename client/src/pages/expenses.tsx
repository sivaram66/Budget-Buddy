import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExpenseFormDialog } from "@/components/expenses/expense-form-dialog";
import { formatCurrency } from "@/lib/utils";
import { Edit2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Expense } from "@/lib/types";
import axios from "axios";
import exp from "constants";

const categories = [
  "All Categories",
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Other",
];

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const serverURL = import.meta.env.VITE_APP_SERVER_URL;

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${serverURL}expense/getExpenses`, { withCredentials: true });
      if (response.status === 200) {
        setExpenses(response.data.expenses);
      }

    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter((expense) => {
    if (expense) {
      // console.log(expense);
      const matchesSearch = expense.description
        ? expense.description.toLowerCase().includes(search.toLowerCase())
        : false;
      const matchesCategory =
        selectedCategory === "All Categories" ||
        expense.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    }
  });

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const handleEditExpense = async (expenseData: Partial<Expense>) => {
    if (!selectedExpense) return;
    try {
      const response = await axios.put(`${serverURL}expense/editExpense/`, expenseData, { withCredentials: true });
      setExpenses(
        expenses.map((expense) =>
          expense.eId === selectedExpense.eId ? { ...expense, ...response.data.expense } : expense
        )
      );
      setSelectedExpense(null);
    } catch (error) {
      console.error("Error editing expense:", error);
    }
  };

  const handleDeleteExpense = (eId: string) => {
    setExpenseToDelete(eId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (expenseToDelete) {
      try {
        console.log(expenseToDelete);
        await axios.put(`${serverURL}expense/deleteExpense`, { eId: expenseToDelete }, { withCredentials: true });
        setExpenses(expenses.filter((expense) => expense.eId !== expenseToDelete));
        setExpenseToDelete(null);
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex-1 p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <p className="text-lg">
          Total: <span className="font-bold">{formatCurrency(totalAmount)}</span>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search expenses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.slice().reverse().map((expense) => (
                <TableRow key={expense.eId}>
                  <TableCell>
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedExpense(expense);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense.eId)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ExpenseFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditExpense}
        initialExpense={selectedExpense || undefined}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              expense.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
