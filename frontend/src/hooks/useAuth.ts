import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api";
import { ApiResponse, LoginCredentials, RegisterData, User } from "../types";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async (): Promise<User> => {
      const response = await apiClient.get<ApiResponse<User>>("/auth/me");
      return response.data.data;
    },
    enabled: !!localStorage.getItem("authToken"),
  });
};

export const useLoginAuth = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      credentials: LoginCredentials,
    ): Promise<{ user: User; token: string }> => {
      const response = await apiClient.post<
        ApiResponse<{ user: User; token: string }>
      >("/auth/login", credentials);
      return response.data.data;
    },
    onSuccess: (data) => {

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      queryClient.setQueryData(["currentUser"], data.user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: RegisterData,
    ): Promise<{ user: User; token: string }> => {
      const response = await apiClient.post<
        ApiResponse<{ user: User; token: string }>
      >("/auth/register", data);
      return response.data.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(["currentUser"], data.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.post("/auth/logout");
    },
    onSettled: () => {

      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      queryClient.clear();
      window.location.href = "/login";
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: Partial<User>): Promise<User> => {
      const response = await apiClient.put<ApiResponse<User>>(
        "/auth/profile",
        userData,
      );
      return response.data.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser"], updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    },
  });
};
