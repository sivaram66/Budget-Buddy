import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [valMsg, setValMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuthStatus = async () => {
      // Avoid multiple concurrent requests
      if (loading) return;

      setLoading(true);
      try {
        const serverUrl = import.meta.env.VITE_APP_SERVER_URL;
        if (!serverUrl) {
          throw new Error("Server URL is not defined.");
        }

        const response = await axios.get(`${serverUrl}login/checkAuth`, {
          withCredentials: true
        });

        // Only navigate if the component is still mounted
        if (isMounted && response.status === 200) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.log("User not logged in.");
      } finally {
        // Only set loading to false if the component is still mounted
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Perform the check only once when the component mounts
    checkAuthStatus();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValMsg("");

    if (!email || !password || (mode === 'signup' && !name)) {
      setValMsg("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const serverUrl = import.meta.env.VITE_APP_SERVER_URL;
      if (!serverUrl) {
        throw new Error("Server URL is not defined.");
      }

      const response = mode === "login"
        ? await axios.post(`${serverUrl}login`, { email, password }, { withCredentials: true })
        : await axios.post(`${serverUrl}signup`, { name, email, password }, { withCredentials: true });

      if (response.status === 200) {
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred";
        setValMsg(errorMsg);
      } else {
        setValMsg("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{mode === 'login' ? 'Login' : 'Create Account'}</CardTitle>
        <CardDescription>
          {mode === 'login' ? 'Enter your credentials to access your account' : 'Create a new account to get started'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            {mode === 'signup' && (
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

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {valMsg && <p className="text-red-700">{valMsg}</p>}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => navigate(mode === 'login' ? '/signup' : '/login')}
            disabled={loading}
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}