import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { LoginPage } from '@/pages/login';
import { SignupPage } from '@/pages/signup';
import { DashboardPage } from '@/pages/dashboard';
import { AnalyticsPage } from '@/pages/analytics';
import { ExpensesPage } from '@/pages/expenses';
import { GoalsPage } from '@/pages/goals';
import { SettingsPage } from '@/pages/settings';
import { ProfilePage } from '@/pages/profile';
import { Sidebar } from '@/components/dashboard/sidebar';
import LandingPage from './pages/landingPage';
import { Toaster } from '@/components/ui/sonner';
// import ProtectedRoute from '@/components/auth/protectedRoute';
import axios from 'axios';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-16 lg:ml-64 overflow-y-auto">{children}</main>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Authentication check at the root level
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const serverUrl = import.meta.env.VITE_APP_SERVER_URL;
        const response = await axios.get(`${serverUrl}login/checkAuth`, { withCredentials: true });
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuthStatus();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading state until authentication check is complete
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="budget-buddy-theme">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/dashboard/analytics"
            element={
              isAuthenticated ? (
                <DashboardLayout>
                  <AnalyticsPage />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/dashboard/expenses"
            element={
              isAuthenticated ? (
                <DashboardLayout>
                  <ExpensesPage />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/dashboard/goals"
            element={
              isAuthenticated ? (
                <DashboardLayout>
                  <GoalsPage />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              isAuthenticated ? (
                <DashboardLayout>
                  <SettingsPage />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              isAuthenticated ? (
                <DashboardLayout>
                  <ProfilePage />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
