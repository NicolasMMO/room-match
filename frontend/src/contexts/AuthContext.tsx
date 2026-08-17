import React, { createContext, useContext, useEffect, useState } from "react";
import { userService } from "../services/userService";
import { vacancyService } from "../services/vacancyService";

interface User {
  id: number;
  name: string;
  email: string;
  vacancies?: any[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => void;
  getCurrentUserId: () => number | null;
  refreshUserVacancies: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const currentUser = await userService.getCurrentUser();
          
          // Carregar vagas do usuário
          try {
            const userVacancies = await vacancyService.getVacanciesByUser(currentUser.id);
            currentUser.vacancies = userVacancies;
          } catch (error) {
            console.error("Erro ao carregar vagas do usuário:", error);
            currentUser.vacancies = [];
          }
          
          setUser(currentUser as User);
        } catch (error) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userId");
          localStorage.removeItem("userName");
          localStorage.removeItem("userEmail");
        }
      }

      setIsLoading(false);
    };

    loadUserData();
  }, []);

  const login = async (userData: User, token: string) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", userData.id.toString());
    localStorage.setItem("userName", userData.name);
    localStorage.setItem("userEmail", userData.email);
    
    // Carregar vagas do usuário
    try {
      const userVacancies = await vacancyService.getVacanciesByUser(userData.id);
      userData.vacancies = userVacancies;
    } catch (error) {
      console.error("Erro ao carregar vagas do usuário:", error);
      userData.vacancies = [];
    }
    
    // Set user to enable authentication
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
  };

  const getCurrentUserId = (): number | null => {
    return user?.id || null;
  };

  const refreshUserVacancies = async () => {
    try {
      const currentUser = await userService.getCurrentUser();
      
      // Carregar vagas do usuário
      try {
        const userVacancies = await vacancyService.getVacanciesByUser(currentUser.id);
        currentUser.vacancies = userVacancies;
      } catch (error) {
        console.error("Erro ao carregar vagas do usuário:", error);
        currentUser.vacancies = [];
      }
      
      setUser(currentUser as User);
    } catch (error) {
      console.error("Erro ao atualizar vagas do usuário:", error);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        getCurrentUserId,
        refreshUserVacancies,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
