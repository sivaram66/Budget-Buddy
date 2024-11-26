import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CategoryTotal, Expense, TimeRange } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const categoryColors = {
  'Food & Dining': 'hsl(var(--chart-1))',
  'Transportation': 'hsl(var(--chart-2))',
  'Shopping': 'hsl(var(--chart-3))',
  'Entertainment': 'hsl(var(--chart-4))',
  'Bills & Utilities': 'hsl(var(--chart-5))',
  'Other': 'hsl(var(--muted-foreground))',
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function groupExpensesByDate(expenses: Expense[], range: TimeRange) {
  const grouped = new Map<string, number>();

  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    let key: string;

    switch (range) {
      case 'daily':
        key = date.toISOString().split('T')[0];
        break;
      case 'weekly':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
    }

    grouped.set(key, (grouped.get(key) || 0) + expense.amount);
  });

  return Array.from(grouped.entries()).map(([date, amount]) => ({
    date,
    amount,
  }));
}

export function getCategoryTotals(expenses: Expense[]): CategoryTotal[] {
  const totals = new Map<string, number>();

  expenses.forEach((expense) => {
    totals.set(
      expense.category,
      (totals.get(expense.category) || 0) + expense.amount
    );
  });

  return Array.from(totals.entries())
    .map(([category, total]) => ({
      category,
      total,
      color: categoryColors[category as keyof typeof categoryColors] || categoryColors.Other,
    }))
    .sort((a, b) => b.total - a.total);
}