import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Goal } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"

interface ContributeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal: Goal
  onContribute: (goalId: string, amount: number) => void
}

export function ContributeDialog({
  open,
  onOpenChange,
  goal,
  onContribute,
}: ContributeDialogProps) {
  const [amount, setAmount] = useState("")
  const remainingAmount = goal.targetAmount - goal.currentAmount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const contributionAmount = parseFloat(amount)
    if (contributionAmount > 0) {
      onContribute(goal.goalId, contributionAmount)
      onOpenChange(false)
      setAmount("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contribute to {goal.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Target Amount:</span>
              <span>{formatCurrency(goal.targetAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Current Amount:</span>
              <span>{formatCurrency(goal.currentAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Remaining:</span>
              <span>{formatCurrency(remainingAmount)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Contribution Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              max={remainingAmount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Contribute {amount && formatCurrency(parseFloat(amount))}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}