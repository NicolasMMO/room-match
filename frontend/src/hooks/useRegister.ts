import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/authService";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/userService";

interface RegisterForm {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UseRegisterReturn {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  register: (formData: RegisterForm) => Promise<void>;
}

export const useRegister = (): UseRegisterReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const register = async (formData: RegisterForm) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      if (formData.password !== formData.confirmPassword) {
        throw new Error("As senhas não coincidem!");
      }

      if (formData.password.length < 6) {
        throw new Error("A senha deve ter pelo menos 6 caracteres!");
      }

      const userData = {
        name: formData.fullname,
        email: formData.email,
        password: formData.password,
        birthday: null,
        profile_picture_path: "",
      };

      await userService.createUser(userData);

      // Login with real credentials to get a valid JWT token
      const loginResponse = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      const user = {
        id: loginResponse.user_id,
        name: loginResponse.name,
        email: loginResponse.email,
      };

      await login(user, loginResponse.access_token);

      setIsSuccess(true);
      // Navigate immediately to avoid PublicRoute redirecting to /vacancies after auth.
      navigate("/preferences", { replace: true, state: { fromRegister: true } });
    } catch (err: any) {

      if (err.response?.status === 409) {
        setError("Este e-mail já está cadastrado!");
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.detail || "Dados inválidos!");
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isSuccess,
    error,
    register,
  };
};
