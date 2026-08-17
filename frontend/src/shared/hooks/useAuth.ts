import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../../services/auth.service";
import { LoginCredentials, RegisterData, UpdateProfileData } from "../types";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authService.getCurrentUser,
    enabled: !!localStorage.getItem("authToken"),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token);
      queryClient.setQueryData(["currentUser"], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token);
      queryClient.setQueryData(["currentUser"], data.user);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      localStorage.removeItem("authToken");
      queryClient.clear();
      window.location.href = "/login";
    },
  });

  const login = async (credentials: LoginCredentials) => {
    return loginMutation.mutateAsync(credentials);
  };

  const register = async (data: RegisterData) => {
    return registerMutation.mutateAsync(data);
  };

  const updateProfile = async (data: UpdateProfileData) => {
    return updateProfileMutation.mutateAsync(data);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    updateProfile,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isUpdateLoading: updateProfileMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    updateError: updateProfileMutation.error,
  };
};
