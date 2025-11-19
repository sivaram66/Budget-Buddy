import { Button } from "@/components/ui/button";
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
import { DateRangeModal } from "@/components/expenses/date-range-modal"; // Add this import
import { Calendar } from "lucide-react"; // Add this import

// Predefined color palette for categories
const CATEGORY_COLORS = {
  "Food & Dining": "#FF6384",
  "Transportation": "#36A2EB",
  "Entertainment": "#FFCE56",
  "Utilities": "#4BC0C0",
  "Shopping": "#9966FF",
  "Healthcare": "#FF9F40",
  "Bills & Utilities": "#E0E0E0",
  "Other": "#E0E0E0",
  "Default": "#E0E0E0"
};

export function AnalyticsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  const [showDateModal, setShowDateModal] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | null,
    to: Date | null,
    label: string
  }>({
    from: null,
    to: null,
    label: "All Time"
  });

  const serverURL = import.meta.env.VITE_APP_SERVER_URL;

  // Fetch expenses once
  useEffect(() => {
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
    fetchExpenses();
  }, [serverURL]);

  // Filter expenses by selected date range
  const filteredExpenses = expenses.filter(expense => {
    if (!dateRange.from || !dateRange.to) return true; // "All Time"
    const expenseDate = new Date(expense.date);
    // Inclusive range
    return expenseDate >= dateRange.from && expenseDate <= dateRange.to;
  });

  // Group by date (bar chart)
  const expensesByDate = groupExpensesByDate(filteredExpenses, timeRange);

  // Category breakdown (pie chart)
  const categoryTotals = getCategoryTotals(filteredExpenses).map(category => ({
    ...category,
    color: CATEGORY_COLORS[category.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS["Default"]
  }));

  // Calculate total spent
  const totalSpent = categoryTotals.reduce((sum, cat) => sum + cat.total, 0);

  // Safe average calculation
  const numDays = dateRange.from && dateRange.to ?
      Math.max(1, Math.floor((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1) :
      filteredExpenses.length > 0 ?
        Math.max(
          1,
          Math.floor(
            (new Date(filteredExpenses[filteredExpenses.length - 1].date).getTime() -
              new Date(filteredExpenses[0].date).getTime()) / (1000 * 60 * 60 * 24)
          )
        ) :
        1;

  return (
    <div className="flex-1 p-8 space-y-6 dark:text-white">
      {/* Header with compact date picker */}
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Analytics</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDateModal(true)}
          className="ml-2"
        >
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date Range: {dateRange.label}
          </span>
        </Button>
      </div>

      {/* Charts Row */}
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
                  outerRadius={110} // Smaller pie
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
            <p className="text-2xl font-bold dark:text-white">{categoryTotals[0]?.category || "N/A"}</p>
            <p className="text-muted-foreground dark:text-gray-300">
              {formatCurrency(categoryTotals[0]?.total || 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="dark:text-white">Average per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold dark:text-white">
              {formatCurrency(numDays > 0 ? totalSpent / numDays : 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Date Range Modal */}
      <DateRangeModal
        open={showDateModal}
        onClose={() => setShowDateModal(false)}
        dateRange={dateRange}
        onApply={(range) => {
          setDateRange(range);
          setShowDateModal(false);
        }}
      />
    </div>
  );
}
