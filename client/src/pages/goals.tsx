import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { GoalCard } from "@/components/goals/goal-card"
import { GoalFormDialog } from "@/components/goals/goal-form-dialog"
import { ContributeDialog } from "@/components/goals/contribute-dialog"
import { Goal } from "@/lib/types"
import { Plus } from "lucide-react"
import axios from "axios"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


// Mock data (replace with real data in production)
const mockGoals: Goal[] = [
  {
    goalId: "1",
    name: "Emergency Fund",
    targetAmount: 10000,
    currentAmount: 5000,
    deadline: "2024-12-31T00:00:00Z",
    description: "Build a 6-month emergency fund for unexpected expenses",
  },
  {
    goalId: "2",
    name: "New Car",
    targetAmount: 25000,
    currentAmount: 15000,
    deadline: "2025-06-30T00:00:00Z",
    description: "Save for a down payment on a new car",
  },
]

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isContributeOpen, setIsContributeOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null)

  const serverURL = import.meta.env.VITE_APP_SERVER_URL;

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`${serverURL}goals/getGoals`, { withCredentials: true })
      if (response.status === 200) {
        setGoals(response.data.goals)
      }
    }
    catch (error: unknown) {
      console.error("Error", error);
    }
  }

  useEffect(() => {
    fetchGoals();
  }, [])

  const handleCreateGoal = (goalData: Partial<Goal>) => {
    const newGoal: Goal = {
      ...goalData
    } as Goal
    setGoals([...goals, newGoal])
  }

  const handleEditGoal = (goalData: Partial<Goal>) => {
    setGoals(
      goals.map((goal) =>
        goal.goalId === selectedGoal?.goalId ? { ...goal, ...goalData } : goal
      )
    )
  }

  const handleDeleteGoal = (goalId: string) => {
    setGoalToDelete(goalId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (goalToDelete) {
      deleteGoal();
      setGoals(goals.filter((goal) => goal.goalId !== goalToDelete))
      setGoalToDelete(null)
    }
    setIsDeleteDialogOpen(false)
  }

  const handleContribute = (goalId: string, amount: number) => {
    setGoals(
      goals.map((goal) =>
        goal.goalId === goalId
          ? { ...goal, currentAmount: goal.currentAmount + amount }
          : goal
      )
    )
  }

  const deleteGoal = async () => {
    try {
      const response = await axios.put(`${serverURL}goals/deleteGoal`, { goalId: goalToDelete }, { withCredentials: true });
      if (response.status === 200) {
        console.log("Goal Deleted Sucessfully");
      }
    }
    catch (error: unknown) {
      console.error("Error: ", error);
    }
  }

  return (
    <div className="flex-1 p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Financial Goals</h1>
        <Button onClick={() => {
          setSelectedGoal(null)
          setIsFormOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard
            key={goal.goalId}
            goal={goal}
            onEdit={(goal) => {
              setSelectedGoal(goal)
              setIsFormOpen(true)
            }}
            onDelete={handleDeleteGoal}
            onContribute={(goal) => {
              setSelectedGoal(goal)
              setIsContributeOpen(true)
            }}
          />
        ))}
      </div>

      <GoalFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={selectedGoal ? handleEditGoal : handleCreateGoal}
        initialGoal={selectedGoal || undefined}
      />

      {selectedGoal && (
        <ContributeDialog
          open={isContributeOpen}
          onOpenChange={setIsContributeOpen}
          goal={selectedGoal}
          onContribute={handleContribute}
        />
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this goal? This action cannot be
              undone.
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
  )
}