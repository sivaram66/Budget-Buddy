import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  PiggyBank,
  Settings,
  Target,
  User,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const menuItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Wallet, label: "Expenses", path: "/dashboard/expenses" },
  { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  { icon: Target, label: "Goals", path: "/dashboard/goals" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const serverUrl = import.meta.env.VITE_APP_SERVER_URL;
    try {
      const response = await axios.post(`${serverUrl}logout`, {}, { withCredentials: true });
      if (response.status === 200) {
        navigate("/");
      }
    }
    catch (error: unknown) {
      console.error("Error: " + error);
      alert("Logout Unsucessful");
    }
  };

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-30 h-screen transition-all duration-300",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="h-full flex flex-col border-r bg-muted/40">
        <div className="flex items-center gap-2 p-4">
          <PiggyBank className="h-8 w-8 shrink-0 text-primary" />
          {expanded && (
            <span className="font-bold transition-all duration-300">
              BudgetBuddy
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-6 rounded-full border bg-background"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        <div className="flex flex-col gap-2 p-4 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    !expanded && "justify-center px-0"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {expanded && <span className="ml-2">{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t">
          <Link to="/dashboard/profile">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start mb-2",
                !expanded && "justify-center px-0"
              )}
            >
              <User className="h-5 w-5 shrink-0" />
              {expanded && <span className="ml-2">Profile</span>}
            </Button>
          </Link>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              !expanded && "justify-center px-0"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {expanded && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}