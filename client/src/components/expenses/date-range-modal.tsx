import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

interface DateRangeModalProps {
  open: boolean
  onClose: () => void
  dateRange: {
    from: Date | null
    to: Date | null
    label: string
  }
  onApply: (range: { from: Date | null; to: Date | null; label: string }) => void
}

export function DateRangeModal({ open, onClose, dateRange, onApply }: DateRangeModalProps) {
  const [from, setFrom] = useState<Date | null>(dateRange.from)
  const [to, setTo] = useState<Date | null>(dateRange.to)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [viewDate, setViewDate] = useState(new Date())

  useEffect(() => {
    if (open) {
      setFrom(dateRange.from)
      setTo(dateRange.to)
      setSelectedMonth(dateRange.from?.getMonth() ?? new Date().getMonth())
      setSelectedYear(dateRange.from?.getFullYear() ?? new Date().getFullYear())
      setViewDate(dateRange.from || new Date())
    }
  }, [open, dateRange])

  const handleQuickFilter = (filterType: string) => {
    const now = new Date()
    let newFrom: Date
    let newTo: Date = now

    switch (filterType) {
      case "today":
        newFrom = new Date(now.setHours(0, 0, 0, 0))
        newTo = new Date(now.setHours(23, 59, 59, 999))
        setFrom(newFrom)
        setTo(newTo)
        break
      
      case "last7":
        newFrom = new Date(now)
        newFrom.setDate(now.getDate() - 7)
        setFrom(newFrom)
        setTo(new Date())
        break
      
      case "last30":
        newFrom = new Date(now)
        newFrom.setDate(now.getDate() - 30)
        setFrom(newFrom)
        setTo(new Date())
        break
      
      case "thisMonth":
        newFrom = new Date(now.getFullYear(), now.getMonth(), 1)
        setFrom(newFrom)
        setTo(new Date())
        break
      
      case "lastMonth":
        newFrom = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        newTo = new Date(now.getFullYear(), now.getMonth(), 0)
        setFrom(newFrom)
        setTo(newTo)
        break
      
      case "thisYear":
        newFrom = new Date(now.getFullYear(), 0, 1)
        setFrom(newFrom)
        setTo(new Date())
        break
      
      case "allTime":
        setFrom(null)
        setTo(null)
        break
    }
  }

  const handleApply = () => {
    let label = "Custom Range"
    
    if (!from && !to) {
      label = "All Time"
    } else if (from && to) {
      const daysDiff = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 0) {
        label = "Today"
      } else if (daysDiff === 6 || daysDiff === 7) {
        label = "Last 7 Days"
      } else if (daysDiff >= 28 && daysDiff <= 31) {
        label = "Last 30 Days"
      } else if (from.getDate() === 1 && to.getMonth() === new Date().getMonth()) {
        label = "This Month"
      } else {
        label = `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`
      }
    }

    onApply({ from, to, label })
  }

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: { day: number | null; isPrevMonth: boolean }[] = []
    
    // Add empty cells for days before month starts
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevMonthDay = new Date(year, month, -i).getDate()
      days.push({ day: prevMonthDay, isPrevMonth: true })
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isPrevMonth: false })
    }

    // Fill remaining cells to complete the grid
    const remainingCells = 42 - days.length
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, isPrevMonth: true })
    }

    return days
  }

  const handleDateClick = (day: number | null, isPrevMonth: boolean) => {
    if (day === null || isPrevMonth) return
    
    const clickedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    
    if (!from || (from && to)) {
      // Start new selection
      setFrom(clickedDate)
      setTo(null)
    } else if (from && !to) {
      // Complete range
      if (clickedDate >= from) {
        setTo(clickedDate)
      } else {
        setTo(from)
        setFrom(clickedDate)
      }
    }
  }

  const isDateInRange = (day: number | null, isPrevMonth: boolean) => {
    if (!day || isPrevMonth || !from) return false
    
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    
    if (!to) return date.toDateString() === from.toDateString()
    
    return date >= from && date <= to
  }

  const isDateSelected = (day: number | null, isPrevMonth: boolean) => {
    if (!day || isPrevMonth) return false
    
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    
    return (
      (from && date.toDateString() === from.toDateString()) ||
      (to && date.toDateString() === to.toDateString())
    )
  }

  const handleMonthChange = (value: string) => {
    const newMonth = parseInt(value)
    setSelectedMonth(newMonth)
    setViewDate(new Date(selectedYear, newMonth, 1))
  }

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value)
    setSelectedYear(newYear)
    setViewDate(new Date(newYear, selectedMonth, 1))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Date Range</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleQuickFilter("today")}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickFilter("last7")}>
              Last 7 Days
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickFilter("last30")}>
              Last 30 Days
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickFilter("thisMonth")}>
              This Month
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickFilter("lastMonth")}>
              Last Month
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickFilter("thisYear")}>
              This Year
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickFilter("allTime")}>
              All Time
            </Button>
          </div>

          {/* From and To Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Input
                type="text"
                value={from ? from.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                readOnly
                placeholder="Select start date"
                className="cursor-default"
              />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input
                type="text"
                value={to ? to.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                readOnly
                placeholder="Select end date"
                className="cursor-default"
              />
            </div>
          </div>

          {/* Month and Year Selectors */}
          <div className="flex gap-4 justify-center">
            <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={month} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calendar Grid */}
          <div className="border rounded-lg p-4">
            <div className="grid grid-cols-7 gap-2 text-center">
              {/* Day headers */}
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} className="text-xs font-semibold text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {generateCalendarDays().map((item, index) => {
                const { day, isPrevMonth } = item
                const isInRange = isDateInRange(day, isPrevMonth)
                const isSelected = isDateSelected(day, isPrevMonth)
                
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDateClick(day, isPrevMonth)}
                    disabled={isPrevMonth}
                    className={`
                      p-2 text-sm rounded-md transition-colors
                      ${isPrevMonth ? 'text-muted-foreground/30 cursor-not-allowed' : 'hover:bg-accent'}
                      ${isSelected ? 'bg-primary text-primary-foreground font-bold' : ''}
                      ${isInRange && !isSelected ? 'bg-primary/20' : ''}
                    `}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleApply} className="bg-green-600 hover:bg-green-700">
              Confirm ✓
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
