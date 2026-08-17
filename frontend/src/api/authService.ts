import { apiClient } from "./axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  name: string;
  email: string;
}

export interface AuthError {
  message: string;
  status: number;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {

      const loginData = {
        email: credentials.email,
        password: credentials.password,
      };

      const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        loginData
      );

      if (response.data.access_token) {
        localStorage.setItem("authToken", response.data.access_token);
        localStorage.setItem("userId", response.data.user_id.toString());
        localStorage.setItem("userName", response.data.name);
        localStorage.setItem("userEmail", response.data.email);
      }

      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.detail || "Erro ao fazer login",
        status: error.response?.status || 500,
      } as AuthError;
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || "Erro ao buscar usuário",
        status: error.response?.status || 500,
      } as AuthError;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("authToken");
  },
};
