import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react"; // Changed: Imported icons

interface AuthFormProps {
  mode: "login" | "signup";
  setIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export function AuthForm({ mode, setIsAuthenticated }: AuthFormProps) {
  // State for form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [valMsg, setValMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Changed: State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Modal/OTP state
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeMsg, setCodeMsg] = useState("");
  // Timer/Resend state
  const [otpTimer, setOtpTimer] = useState(30);  // seconds
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (showVerifyModal && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(t => t - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showVerifyModal, otpTimer]);

  // --------- Event handlers ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValMsg("");

    if (!email || !password || (mode === "signup" && !name)) {
      setValMsg("Please fill in all required fields.");
      return;
    }
    try {
      setLoading(true);
      const serverUrl = import.meta.env.VITE_APP_SERVER_URL;
      if (!serverUrl) throw new Error("Server URL is not defined.");
      if (mode === "signup") {
        const response = await axios.post(
          `${serverUrl}auth/signup`,
          { name, email, password },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setVerificationEmail(email);
          setShowVerifyModal(true);
          setOtpTimer(30);  // reset timer each time modal is opened
          return;
        }
      } else {
        const response = await axios.post(
          `${serverUrl}login`,
          { email, password },
          { withCredentials: true }
        );
        if (response.status === 200) {
          if (setIsAuthenticated) setIsAuthenticated(true);
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errors = error.response?.data?.errors;
        const message = error.response?.data?.message;
        if (errors && typeof errors === "object") {
          const allMessages = Object.values(errors)
            .flat()
            .map((msg) => `• ${msg}`)
            .join("\n");
          setValMsg(allMessages);
        } else if (message) {
          setValMsg(message);
        } else {
          setValMsg("An unexpected error occurred");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCodeVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeMsg("");
    try {
      const serverUrl = import.meta.env.VITE_APP_SERVER_URL;
      const response = await axios.post(
        `${serverUrl}auth/verify-code`,
        { email: verificationEmail, code }
      );
      if (response.status === 201) {
        setShowVerifyModal(false);
        setValMsg("Signup complete! You can now login.");
        navigate("/login");
      }
    } catch (err: any) {
      setCodeMsg(err.response?.data?.message || "Code verification failed");
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setCodeMsg("");
    try {
      const serverUrl = import.meta.env.VITE_APP_SERVER_URL;
      await axios.post(
        `${serverUrl}auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      setOtpTimer(30);
    } catch (err) {
      setCodeMsg("Failed to resend code. Try again later.");
    }
    setResending(false);
  };

  // --------- Render ---------
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Signup/Login main form: Hidden when showing OTP/verify modal */}
      {!showVerifyModal && (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>{mode === "login" ? "Login" : "Create Account"}</CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Enter your credentials to access your account"
                : "Create a new account to get started"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                {mode === "signup" && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                )}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                {/* Changed: Password Field with Show/Hide Logic */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"} // Toggles type
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="pr-10" // Add padding-right so text doesn't overlap icon
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {valMsg && (
                <pre className="text-red-700 whitespace-pre-line">{valMsg}</pre>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing..." : mode === "login" ? "Login" : "Sign Up"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate(mode === "login" ? "/signup" : "/login")}
                disabled={loading}
              >
                {mode === "login"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* OTP Gmail Verification Modal */}
      {showVerifyModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.95)",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Card style={{ position: "relative", width: "400px", minHeight: "330px" }}>

            {/* Close (X) Button */}
            <button
              onClick={() => setShowVerifyModal(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#999"
              }}
              aria-label="Close"
            >
              ✕
            </button>
            <CardHeader>
              <CardTitle>Enter Gmail Verification Code</CardTitle>
              <CardDescription>
                We've sent a code to your Gmail.<br />
                Enter below to complete signup.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleCodeVerify}>
              <CardContent>
                <Input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6-digit code"
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendCode}
                    disabled={otpTimer > 0 || resending}
                  >
                    {resending ? "Sending..." : "Resend OTP"}
                  </Button>
                  <span style={{ color: "gray", fontSize: "0.9em" }}>
                    {otpTimer > 0 ? `Resend in ${otpTimer}s` : "You can resend"}
                  </span>
                </div>
                {codeMsg && <span className="text-red-700">{codeMsg}</span>}
                <Button type="submit">Verify & Create Account</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}