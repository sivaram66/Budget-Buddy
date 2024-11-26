import { AuthForm } from "@/components/auth/auth-form"

export function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <AuthForm mode="login" />
    </div>
  )
}