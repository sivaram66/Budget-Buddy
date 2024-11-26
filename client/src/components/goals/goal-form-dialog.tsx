import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Goal } from "@/lib/types"

// Ensure Goal type includes goalId
import { useEffect, useState } from "react"
import axios from "axios"

interface GoalFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (goal: Partial<Goal>) => void
  initialGoal?: Goal
}

export function GoalFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialGoal,
}: GoalFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Goal>>(
    initialGoal || {
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      deadline: "",
      description: "",
    }
  )
  const [resMsg, setresMsg] = useState("");
  useEffect(() => {
    if (initialGoal) {
      setFormData({
        name: initialGoal.name,
        targetAmount: initialGoal.targetAmount,
        currentAmount: initialGoal.currentAmount,
        description: initialGoal.description,
        deadline: initialGoal.deadline,
      })
    }
  }, [initialGoal])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)

    try {
      const serverURL = import.meta.env.VITE_APP_SERVER_URL;
      const response = initialGoal ? await axios.put(`${serverURL}goals/editGoal`, { name: formData.name, description: formData.description, targetAmount: formData.targetAmount, currentAmount: formData.currentAmount, deadline: formData.deadline, goalId: initialGoal.goalId }, { withCredentials: true })
        : await axios.post(`${serverURL}goals/addGoal`, { name: formData.name, description: formData.description, targetAmount: formData.targetAmount, currentAmount: formData.currentAmount, deadline: formData.deadline }, { withCredentials: true });
      if (response.status === 200 && initialGoal) {
        console.log("Goal Updated Sucessfully");
        setresMsg("Goal Updated Sucessfully")
      }
      if (response.status === 201 && !initialGoal) {
        setresMsg("Goal Created sucessfully")
      }
    } catch (error: unknown) {
      console.error("Error:", error);
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialGoal ? "Edit Goal" : "Create New Goal"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount</Label>
            <Input
              id="targetAmount"
              type="number"
              min="0"
              step="0.01"
              value={formData.targetAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetAmount: parseFloat(e.target.value),
                })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentAmount">Current Amount</Label>
            <Input
              id="currentAmount"
              type="number"
              min="0"
              step="0.01"
              value={formData.currentAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  currentAmount: parseFloat(e.target.value),
                })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline?.split("T")[0]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deadline: new Date(e.target.value).toISOString(),
                })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <Button type="submit" className="w-full">
            {initialGoal ? "Update Goal" : "Create Goal"}
          </Button>
          <p>{resMsg}</p>
        </form>
      </DialogContent>
    </Dialog>
  )
}