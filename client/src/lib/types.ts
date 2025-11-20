export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  id: string,
}

export interface Goal {
  goalId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  description?: string;
}

export type ExpenseFormMode = 'normal' | 'advanced';

export type TimeRange = 'daily' | 'weekly' | 'monthly';

export interface CategoryTotal {
  category: string;
  total: number;
  color: string;
}