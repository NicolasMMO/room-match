import { apiClient } from "../api";
import {
  ApiResponse,
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  User,
} from "../shared/types";

export const authService = {
  login: async (
    credentials: LoginCredentials,
  ): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post<
      ApiResponse<{ user: User; token: string }>
    >("/auth/login", credentials);
    return response.data.data;
  },

  register: async (
    data: RegisterData,
  ): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post<
      ApiResponse<{ user: User; token: string }>
    >("/auth/register", data);
    return response.data.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>("/auth/me");
    return response.data.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "profileImage" && value instanceof File) {
        formData.append("profileImage", value);
      } else if (key === "preferences") {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const response = await apiClient.put<ApiResponse<User>>(
      "/auth/profile",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },
};
