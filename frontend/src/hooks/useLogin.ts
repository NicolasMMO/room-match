import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AuthError,
  authService,
  LoginRequest,
  LoginResponse,
} from "../api/authService";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/userService";

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  return useMutation<LoginResponse, AuthError, LoginRequest>({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      console.log("Login realizado com sucesso:", data);

      // Carregar dados completos do usuário incluindo vagas
      try {
        const fullUserData = await userService.getCurrentUser();
        console.log("Dados completos do usuário carregados:", fullUserData);
        await login(fullUserData, data.access_token);
      } catch (error) {
        console.error("Erro ao carregar dados completos do usuário:", error);
        // Fallback se falhar ao carregar dados completos
        await login(
          {
            id: data.user_id,
            name: data.name,
            email: data.email,
          },
          data.access_token,
        );
      }

      const from = (location.state as any)?.from?.pathname || "/vacancies";
      navigate(from, { replace: true });
    },
    onError: (error) => {
      console.error("Erro no login:", error);
    },
  });
};
