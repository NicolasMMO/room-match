import { useState, useEffect, useCallback } from "react";
import {
  vacancyPreferencesService,
  AvailablePreference,
  RESPONSE_MAPPING,
} from "../services/vacancyPreferencesService";

interface UseVacancyPreferencesReturn {
  isLoading: boolean;
  isFetchingPreferences: boolean;
  error: string | null;
  availablePreferences: AvailablePreference[];
  saveVacancyPreferences: (
    vacancyId: number,
    preferences: Record<number, string>
  ) => Promise<boolean>;
  fetchAvailablePreferences: () => Promise<void>;
}

export const useVacancyPreferences = (): UseVacancyPreferencesReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingPreferences, setIsFetchingPreferences] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availablePreferences, setAvailablePreferences] = useState<
    AvailablePreference[]
  >([]);

  const fetchAvailablePreferences = useCallback(async () => {
    try {
      setIsFetchingPreferences(true);
      setError(null);
      const response = await vacancyPreferencesService.getAvailablePreferences();
      setAvailablePreferences(response.preferences);
    } catch (err: any) {
      console.error("Erro ao carregar preferências de vaga:", err);
      setError("Erro ao carregar preferências disponíveis.");
    } finally {
      setIsFetchingPreferences(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailablePreferences();
  }, [fetchAvailablePreferences]);

  const saveVacancyPreferences = async (
    vacancyId: number,
    preferences: Record<number, string>
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const answeredCount = Object.keys(preferences).length;
      if (answeredCount < availablePreferences.length) {
        throw new Error(
          "Por favor, responda todas as perguntas antes de salvar."
        );
      }

      const apiPreferences = Object.entries(preferences).map(
        ([preferenceId, answer]) => ({
          preference_id: Number(preferenceId),
          rate: RESPONSE_MAPPING[answer],
        })
      );

      await vacancyPreferencesService.saveVacancyPreferences(vacancyId, {
        preferences: apiPreferences,
      });

      return true;
    } catch (err: any) {
      let errorMessage = "Erro ao salvar preferências. Tente novamente.";

      if (err.response?.status === 400) {
        errorMessage = err.response?.data?.detail || "Dados inválidos!";
      } else if (err.response?.status === 404) {
        errorMessage = "Vaga não encontrada!";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isFetchingPreferences,
    error,
    availablePreferences,
    saveVacancyPreferences,
    fetchAvailablePreferences,
  };
};
