import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-blue-600">Carregando...</div>
      </div>
    );
  }

  if (isAuthenticated) {

    return <Navigate to="/vacancies" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
