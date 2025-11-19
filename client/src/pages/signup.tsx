import { AuthForm } from "@/components/auth/auth-form"
import { useOutletContext } from "react-router-dom";

export function SignupPage() {
  // Get the setIsAuthenticated function from the outlet context
  const setIsAuthenticated = useOutletContext<React.Dispatch<React.SetStateAction<boolean | null>>>();
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <AuthForm mode="signup" setIsAuthenticated={setIsAuthenticated} />
    </div>
  )
}


