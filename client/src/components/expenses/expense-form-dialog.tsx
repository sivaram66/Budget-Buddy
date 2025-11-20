import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Expense } from "@/lib/types";
import { useEffect, useState } from "react";

interface ExpenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (expense: Partial<Expense>) => void;
  initialExpense?: Expense;
}

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Other",
];

export function ExpenseFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialExpense,
}: ExpenseFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Expense>>(() => {
    if (initialExpense) {
      return {
        amount: initialExpense.amount,
        category: categories.includes(initialExpense.category) ? initialExpense.category : "Other",
        description: initialExpense.description,
      };
    }
    return {
      amount: 0,
      category: "",
      description: "",
    };
  });

  useEffect(() => {
    if (initialExpense) {
      setFormData({
        amount: initialExpense.amount,
        category: categories.includes(initialExpense.category) ? initialExpense.category : "Other",
        description: initialExpense.description,
        _id: initialExpense._id
      });
    }
  }, [initialExpense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialExpense ? "Edit Expense" : "Add Expense"}
          </DialogTitle>
          <DialogDescription>
            Please fill in the form below to {initialExpense ? "update" : "add"} an expense.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: parseFloat(e.target.value),
                })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
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
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <Button type="submit" className="w-full">
            {initialExpense ? "Update Expense" : "Add Expense"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}