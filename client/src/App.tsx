import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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

  return (
    <ThemeProvider defaultTheme="system" storageKey="budget-buddy-theme">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<Outlet context={setIsAuthenticated} />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
          <Route
            path="/dashboard"
            element={
              isAuthenticated === null ? (
                <div>Loading...</div>
              ) :
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
              isAuthenticated === null ? (
                <div>Loading...</div>
              ) :
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
              isAuthenticated === null ? (
                <div>Loading...</div>
              ) :
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
              isAuthenticated === null ? (
                <div>Loading...</div>
              ) :
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
              isAuthenticated === null ? (
                <div>Loading...</div>
              ) :
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
              isAuthenticated === null ? (
                <div>Loading...</div>
              ) :
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
