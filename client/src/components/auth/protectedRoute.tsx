import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                      const response = await axios.get(`${import.meta.env.VITE_APP_SERVER_URL}login/checkAuth`, {
                    withCredentials: true,
                });
                if (response.status === 200) {
                    setIsAuthenticated(true);
                }
            } catch (err) {
                setIsAuthenticated(false);
                navigate("/login");
            }
        };

        if (isAuthenticated === null) {
            checkAuth();
        }
    }, [isAuthenticated, navigate]); // Adding `isAuthenticated` dependency to avoid repeated checks

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : null;
};

export default ProtectedRoute;
