import { useState, useEffect, useCallback, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Expense } from "@/lib/types"
import axios from "axios"
import { Search, Calendar, X, Pencil, Trash2, ArrowUp } from "lucide-react"
import { DateRangeModal } from "@/components/expenses/date-range-modal"
import { ExpenseFormDialog } from "@/components/expenses/expense-form-dialog"   // Import the dialog

const categories = [
  "All Categories",
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Other",
]

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [showBackToTop, setShowBackToTop] = useState(false)
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [dateRange, setDateRange] = useState<{
    from: Date | null
    to: Date | null
    label: string
  }>({
    from: null,
    to: null,
    label: "All Time"
  })
  const [showDateModal, setShowDateModal] = useState(false)

  const serverURL = import.meta.env.VITE_APP_SERVER_URL
  const observer = useRef<IntersectionObserver | null>(null)

  // Dialog states for editing
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>(undefined)

  const lastExpenseRef = useCallback((node: HTMLTableRowElement) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  // Fetch expenses with pagination
  const fetchExpenses = async (pageNum: number) => {
    if (loading) return

    try {
      setLoading(true)
      const response = await axios.get(
        `${serverURL}expense/getExpenses`,
        { withCredentials: true }
      )

      if (response.status === 200) {
        const allExpenses = response.data.expenses || []
        // Sort by date (most recent first)
        const sortedExpenses = allExpenses.sort((a: Expense, b: Expense) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
        // Simulate pagination on frontend
        const startIndex = (pageNum - 1) * 20
        const endIndex = startIndex + 20
        const paginatedExpenses = sortedExpenses.slice(0, endIndex)
        setExpenses(paginatedExpenses)
        setHasMore(endIndex < sortedExpenses.length)
      }
    } catch (error) {
      console.error("Error fetching expenses:", error)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchExpenses(1)
  }, [])

  // Load more on page change
  useEffect(() => {
    if (page > 1) {
      fetchExpenses(page)
    }
  }, [page])

  // Apply filters
  useEffect(() => {
    let filtered = [...expenses]
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    // Category filter
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(expense => expense.category === selectedCategory)
    }
    // Date range filter
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date)
        return expenseDate >= dateRange.from! && expenseDate <= dateRange.to!
      })
    }
    setFilteredExpenses(filtered)
  }, [expenses, searchQuery, selectedCategory, dateRange])

  // Scroll listener for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All Categories")
    setDateRange({ from: null, to: null, label: "All Time" })
  }

  // Calculate statistics
  const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const average = filteredExpenses.length > 0 ? total / filteredExpenses.length : 0
  const highest = filteredExpenses.length > 0
    ? Math.max(...filteredExpenses.map(e => e.amount))
    : 0

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "All Categories" ||
    dateRange.label !== "All Time"

  // ----------- New handlers for edit/delete -----------

  // Delete handler
  const handleDelete = async (expenseId: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return
    try {
      const response = await axios.delete(
        `${serverURL}expense/deleteExpense/${expenseId}`,
        { withCredentials: true }
      )
      if (response.status === 200) {
        setPage(1)
        fetchExpenses(1)
      }
    } catch (error) {
      console.error("Error deleting expense:", error)
      alert("Failed to delete expense")
    }
  }

  // Open edit dialog
  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense)
    setShowEditDialog(true)
  }

  // Update handler for dialog submit
  const handleUpdate = async (updatedExpense: Partial<Expense>) => {
    try {
      const response = await axios.put(
        `${serverURL}expense/updateExpense/${selectedExpense?.eId}`,
        updatedExpense,
        { withCredentials: true }
      )
      if (response.status === 200) {
        setPage(1)
        fetchExpenses(1)
        setShowEditDialog(false)
        setSelectedExpense(undefined)
      }
    } catch (error) {
      console.error("Error updating expense:", error)
      alert("Failed to update expense")
    }
  }

  return (
    <div className="flex-1 p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <div className="text-2xl font-bold">
          Total: ₹{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Expenses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Category - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* Category Dropdown */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
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
          {/* Date Range Selection */}
          <div>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowDateModal(true)}
            >
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range: {dateRange.label}
              </span>
              <span className="text-muted-foreground text-sm">Click to change</span>
            </Button>
          </div>
          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className="w-full"
            >
              <X className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full text-sm">
              <span>Search: "{searchQuery}"</span>
              <button onClick={() => setSearchQuery("")} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {selectedCategory !== "All Categories" && (
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full text-sm">
              <span>{selectedCategory}</span>
              <button onClick={() => setSelectedCategory("All Categories")} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {dateRange.label !== "All Time" && (
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full text-sm">
              <span>{dateRange.label}</span>
              <button onClick={() => setDateRange({ from: null, to: null, label: "All Time" })} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Summary Panel */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Showing: </span>
              <span className="font-semibold">{filteredExpenses.length} expenses</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total: </span>
              <span className="font-semibold">₹{total.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Average: </span>
              <span className="font-semibold">₹{average.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Highest: </span>
              <span className="font-semibold">₹{highest.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No expenses found
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((expense, index) => (
                <TableRow
                  key={expense.eId}
                  ref={index === filteredExpenses.length - 1 ? lastExpenseRef : null}
                >
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell className="text-right font-medium">
                    ₹{expense.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(expense)} // Edit handler
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(expense.eId)} // Delete handler
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-4">
          <p className="text-muted-foreground">Loading more expenses...</p>
        </div>
      )}

      {/* No more data */}
      {!hasMore && filteredExpenses.length > 0 && !loading && (
        <div className="text-center py-4">
          <p className="text-muted-foreground">All expenses loaded</p>
        </div>
      )}

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:bg-primary/90 transition-all z-50"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Date Range Modal */}
      <DateRangeModal
        open={showDateModal}
        onClose={() => setShowDateModal(false)}
        dateRange={dateRange}
        onApply={(range) => {
          setDateRange(range)
          setShowDateModal(false)
        }}
      />

      {/* Edit Expense Dialog */}
      <ExpenseFormDialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open)
          if (!open) setSelectedExpense(undefined)
        }}
        onSubmit={handleUpdate}
        initialExpense={selectedExpense}
      />
    </div>
  )
}
