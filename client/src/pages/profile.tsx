import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { Camera, Crown } from "lucide-react"
import { toast } from "sonner"

const serverURL = import.meta.env.VITE_APP_SERVER_URL

export function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "",
    plan: "pro",
    joinDate: ""
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const userId = "user-id" // Replace with actual user ID

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get(`${serverURL}user/getDetails`, { withCredentials: true });
      setProfile(data.user)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [userId])

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const { data } = await axios.put(`${serverURL}user/editDetails`, { userId: userId, name: profile.name, email: profile.email }, { withCredentials: true })

      if (data.success) {
        setIsEditing(false)
        toast.success("Profile updated successfully")
        // Refresh profile data after update
        fetchProfile()
      } else {
        toast.error(data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update profile")
      } else {
        toast.error("Failed to update profile")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getPlanBadge = () => {
    switch (profile.plan) {
      case "pro":
        return (
          <Badge className="bg-primary hover:bg-primary">
            <Crown className="h-3 w-3 mr-1" />
            Pro Plan
          </Badge>
        )
      case "free":
        return <Badge variant="secondary">Free Plan</Badge>
      default:
        return null
    }
  }

  if (isLoading && !profile.name) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          disabled={isLoading}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        {/* Profile Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>BudgetBuddy</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full"
                disabled={isLoading}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
            <div className="space-y-2 text-center">
              {getPlanBadge()}
              <p className="text-sm text-muted-foreground">
                Member since {profile.joinDate || "Jan 2024"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  disabled={!isEditing || isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  disabled={!isEditing || isLoading}
                />
              </div>
              {isEditing && (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              Manage your subscription and billing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {profile.plan === "pro" ? "Pro Plan" : "Free Plan"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {profile.plan === "pro"
                    ? "₹999/month"
                    : "Basic features"}
                </p>
              </div>
              <Link to="/dashboard/settings?tab=billing">
                <Button variant="outline" disabled={isLoading}>
                  Manage Plan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}