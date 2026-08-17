import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  userPreferencesService,
  AvailablePreference,
} from "../services/userPreferencesService";

interface UseUserPreferencesReturn {
  isLoading: boolean;
  isFetchingPreferences: boolean;
  isSuccess: boolean;
  error: string | null;
  availablePreferences: AvailablePreference[];
  savePreferences: (
    preferences: Record<number, string>,
  ) => Promise<{ success: boolean; error: string | null }>;
  fetchAvailablePreferences: () => Promise<void>;
}

export const useUserPreferences = (): UseUserPreferencesReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingPreferences, setIsFetchingPreferences] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availablePreferences, setAvailablePreferences] = useState<
    AvailablePreference[]
  >([]);
  const { getCurrentUserId } = useAuth();

  const fetchAvailablePreferences = useCallback(async () => {
    try {
      setIsFetchingPreferences(true);
      setError(null);
      const response = await userPreferencesService.getAvailablePreferences();
      setAvailablePreferences(response.preferences);
    } catch (err: any) {
      console.error("Erro ao carregar preferências:", err);
      setError("Erro ao carregar preferências disponíveis.");
    } finally {
      setIsFetchingPreferences(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailablePreferences();
  }, [fetchAvailablePreferences]);

  const savePreferences = async (
    preferences: Record<number, string>
  ): Promise<{ success: boolean; error: string | null }> => {
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("Usuário não autenticado");
      }

      const RESPONSE_MAPPING: Record<string, "YES" | "NO" | "INDIFFERENT"> = {
        Sim: "YES",
        Não: "NO",
        Indiferente: "INDIFFERENT",
      };

      const apiPreferences = Object.entries(preferences).map(
        ([preferenceId, answer]) => ({
          preference_id: Number(preferenceId),
          rate: RESPONSE_MAPPING[answer],
        })
      );

      // Ignore unanswered/invalid entries so we don't send NaN/undefined to the API.
      const filteredPreferences = apiPreferences.filter(
        (p) =>
          Number.isFinite(p.preference_id) &&
          (p.rate === "YES" || p.rate === "NO" || p.rate === "INDIFFERENT"),
      );

      await userPreferencesService.saveUserPreferences(userId, {
        preferences: filteredPreferences,
      });

      setIsSuccess(true);
      setTimeout(() => {
        const successMessage = document.getElementById("success-message");
        if (successMessage) {
          successMessage.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);

      return { success: true, error: null };
    } catch (err: any) {
      let errorMessage = "Erro ao salvar preferências. Tente novamente.";

      if (err.response?.status === 400) {
        errorMessage = err.response?.data?.detail || "Dados inválidos!";
      } else if (err.response?.status === 404) {
        errorMessage = "Usuário não encontrado!";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setIsSuccess(false);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isFetchingPreferences,
    isSuccess,
    error,
    availablePreferences,
    savePreferences,
    fetchAvailablePreferences,
  };
};
