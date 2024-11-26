import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Goal } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { Edit2, Trash2 } from "lucide-react"
interface GoalCardProps {
  goal: Goal
  onEdit: (goal: Goal) => void
  onDelete: (goalId: string) => void
  onContribute: (goal: Goal) => void
}
export function GoalCard({ goal, onEdit, onDelete, onContribute }: GoalCardProps) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100
  const remainingAmount = goal.targetAmount - goal.currentAmount
  const daysLeft = Math.ceil(
    (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  )

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{goal.name}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(goal)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(goal.goalId)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{formatCurrency(goal.currentAmount)}</span>
            <span>{formatCurrency(goal.targetAmount)}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Remaining</p>
            <p className="font-medium">{formatCurrency(remainingAmount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Days Left</p>
            <p className="font-medium">{daysLeft} days</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{goal.description}</p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onContribute(goal)}
        >
          Contribute
        </Button>
      </CardFooter>
    </Card>
  )
}