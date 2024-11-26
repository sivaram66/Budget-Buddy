import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TimeRange } from "@/lib/types";
import { formatCurrency, getCategoryTotals, groupExpensesByDate } from "@/lib/utils";
import axios from "axios";
import { Expense } from "@/lib/types";

// Predefined color palette for categories
const CATEGORY_COLORS = {
  "Food & Dining": "#FF6384",
  "Transportation": "#36A2EB",
  "Entertainment": "#FFCE56",
  "Utilities": "#4BC0C0",
  "Shopping": "#9966FF",
  "Healthcare": "#FF9F40",
  "Default": "#E0E0E0"
};

// Mock data (replace with real data in production)
const mockExpenses = [
  {
    eId: "eid0",
    id: "1",
    description: "Lunch",
    amount: 12.5,
    category: "Food & Dining",
    date: "2024-03-20T12:00:00Z",
  },
  {
    eID: "eid1",
    id: "2",
    description: "Uber",
    amount: 25.0,
    category: "Transportation",
    date: "2024-03-19T12:00:00Z",
  },
  {
    eID: "eid2",
    id: "3",
    description: "Netflix",
    amount: 15.99,
    category: "Entertainment",
    date: "2024-03-18T12:00:00Z",
  },
  {
    eID: "eid3",
    id: "4",
    description: "Groceries",
    amount: 89.99,
    category: "Food & Dining",
    date: "2024-03-17T12:00:00Z",
  },
];

export function AnalyticsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

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

  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

  const expensesByDate = groupExpensesByDate(expenses, timeRange);

  // Modify getCategoryTotals to include color
  const categoryTotals = getCategoryTotals(expenses).map(category => ({
    ...category,
    color: CATEGORY_COLORS[category.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS["Default"]
  }));

  const totalSpent = categoryTotals.reduce((sum, cat) => sum + cat.total, 0);

  const serverURL = import.meta.env.VITE_APP_SERVER_URL;

  return (
    <div className="flex-1 p-8 space-y-6 dark:text-white">
      <h1 className="text-3xl font-bold dark:text-white">Analytics</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Expenses Over Time */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="dark:text-white">Expenses Over Time</CardTitle>
              <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={(value) => value && setTimeRange(value as TimeRange)}
              >
                <ToggleGroupItem value="daily" aria-label="Daily view" className="dark:text-white dark:hover:bg-gray-700">
                  Daily
                </ToggleGroupItem>
                <ToggleGroupItem value="weekly" aria-label="Weekly view" className="dark:text-white dark:hover:bg-gray-700">
                  Weekly
                </ToggleGroupItem>
                <ToggleGroupItem value="monthly" aria-label="Monthly view" className="dark:text-white dark:hover:bg-gray-700">
                  Monthly
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expensesByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" className="dark:text-white" />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value).split('.')[0]}
                  className="dark:text-white"
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="dark:text-white">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryTotals}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ percent, category }) => `${category} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend
                  formatter={(value) => <span className="dark:text-white">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="dark:text-white">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold dark:text-white">{formatCurrency(totalSpent)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="dark:text-white">Largest Category</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold dark:text-white">{categoryTotals[0]?.category}</p>
            <p className="text-muted-foreground dark:text-gray-300">
              {formatCurrency(categoryTotals[0]?.total)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="dark:text-white">Average per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold dark:text-white">
              {formatCurrency(totalSpent / mockExpenses.length)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}