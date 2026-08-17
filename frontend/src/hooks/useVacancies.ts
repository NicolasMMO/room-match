import { useCallback, useEffect, useState } from "react";
import matchService from "../services/matchService";
import { scoreService } from "../services/scoreService";
import { userService } from "../services/userService";
import { vacancyService } from "../services/vacancyService";
import { LikeResponse } from "../types/match";
import { ScoreWithVacancy, VacanciesState } from "../types/vacancy";
import { mapApiVacanciesToFrontend } from "../utils/vacancyMappers";

interface UseVacanciesResult extends VacanciesState {
  handleDismiss: (vacancyId: string) => void;
  handleInterest: (vacancyId: string) => Promise<LikeResponse | null>;
  refreshVacancies: () => Promise<void>;
  vacancies: any[];
}

export const useVacancies = () => {
  const [state, setState] = useState<VacanciesState>({
    vacancies: [],
    isLoading: true,
    error: null,
    dismissedVacancies: [],
    interestedVacancies: [],
  });
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const loadVacancies = useCallback(async (userId?: number) => {
    setState((prevState) => ({ ...prevState, isLoading: true, error: null }));

    try {
      const response = await vacancyService.getAllVacancies({ limit: 20 });

      let scoresMap: Map<number, ScoreWithVacancy> | undefined;
      let userLikedVacancyIds: string[] = [];

      if (userId && response.vacancies.length > 0) {
        try {
          // Busca os scores
          const vacancyIds = response.vacancies.map((v) => v.id);
          const scoresResponse = await scoreService.calculateScoresBatch(
            userId,
            vacancyIds,
          );

          scoresMap = new Map(
            scoresResponse.scores.map((s) => [s.vacancy_id, s]),
          );

          // Busca os likes do usuário
          const likesResponse = await matchService.getUserLikes(userId);
          userLikedVacancyIds = likesResponse.vacancy_ids.map((id) =>
            id.toString(),
          );
        } catch (scoreError) {
          console.warn(
            "Failed to load scores or likes, using fallback:",
            scoreError,
          );
        }
      }

      const mappedVacancies = mapApiVacanciesToFrontend(
        response.vacancies,
        scoresMap,
      );

      setState((prevState) => ({
        ...prevState,
        vacancies: mappedVacancies,
        interestedVacancies: userLikedVacancyIds,
        isLoading: false,
      }));
    } catch (error: any) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        error:
          error.response?.data?.detail ||
          error.message ||
          "Erro ao carregar vagas",
      }));
    }
  }, []);

  const loadCurrentUserAndVacancies = useCallback(async () => {
    try {
      const currentUser = await userService.getCurrentUser();
      setCurrentUserId(currentUser.id);
      await loadVacancies(currentUser.id);
    } catch (error: any) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: error.message || "Erro ao carregar dados",
      }));
    }
  }, [loadVacancies]);

  useEffect(() => {
    loadCurrentUserAndVacancies();
  }, [loadCurrentUserAndVacancies]);

  const handleDismiss = useCallback((vacancyId: string) => {
    setState((prevState) => ({
      ...prevState,
      dismissedVacancies: [...prevState.dismissedVacancies, vacancyId],
    }));
  }, []);

  const handleInterest = useCallback(
    async (vacancyId: string): Promise<LikeResponse | null> => {
      if (!currentUserId) {
        console.error("Usuário não autenticado");
        return null;
      }

      try {
        // Registra o like na API
        const response = await matchService.createLike({
          user_id: currentUserId,
          vacancy_id: parseInt(vacancyId, 10),
          liker: "user",
        });

        // Adiciona à lista local de interesse
        setState((prevState) => ({
          ...prevState,
          interestedVacancies: [...prevState.interestedVacancies, vacancyId],
        }));

        return response;
      } catch (error: any) {
        const errorMessage = error.message || "Erro ao registrar interesse";
        console.error("Erro ao registrar interesse:", errorMessage);

        // Não atualiza o estado de erro para mensagens comuns
        // O componente pai vai lidar com o feedback visual
        if (!errorMessage.includes("already liked")) {
          setState((prevState) => ({
            ...prevState,
            error: errorMessage,
          }));
        }

        return null;
      }
    },
    [currentUserId],
  );

  const refreshVacancies = useCallback(async () => {
    await loadVacancies(currentUserId ?? undefined);
  }, [loadVacancies, currentUserId]);

  const filteredVacancies = state.vacancies.filter(
    (vacancy) =>
      !state.dismissedVacancies.includes(vacancy.id) &&
      !state.interestedVacancies.includes(vacancy.id) &&
      vacancy.userId !== currentUserId,
  );

  return {
    ...state,
    vacancies: filteredVacancies,
    handleDismiss,
    handleInterest,
    refreshVacancies,
  };
};
