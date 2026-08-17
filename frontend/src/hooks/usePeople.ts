import { useCallback, useEffect, useState } from "react";
import matchService from "../services/matchService";
import { userService } from "../services/userService";
import { vacancyService } from "../services/vacancyService";
import { LikeResponse } from "../types/match";
import { PeoplePageState } from "../types/person";

export const usePeople = () => {
  const [state, setState] = useState<PeoplePageState>({
    people: [],
    vacancy: {
      title: "Carregando...",
      id: "1",
    },
    isLoading: true,
    error: null,
    dismissedPeople: [],
    interestedPeople: [],
  });
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentVacancyId, setCurrentVacancyId] = useState<number | null>(null);

  const loadPeople = useCallback(async (userId?: number) => {
    setState((prevState) => ({ ...prevState, isLoading: true, error: null }));

    try {
      const people = await userService.getAllUsers();

      // Buscar a vaga do usuário
      let vacancy = {
        title: "Carregando...",
        id: "1",
      };
      let vacancyLikedUserIds: number[] = [];

      if (userId) {
        try {
          const userVacancies = await vacancyService.getVacanciesByUser(userId);
          if (userVacancies && userVacancies.length > 0) {
            const firstVacancy = userVacancies[0];
            vacancy = {
              title: firstVacancy.title,
              id: firstVacancy.id.toString(),
            };
            setCurrentVacancyId(firstVacancy.id);

            // Buscar os likes da vaga
            try {
              const likesResponse = await matchService.getVacancyLikes(
                firstVacancy.id,
              );
              vacancyLikedUserIds = likesResponse.user_ids;
            } catch (e) {
              console.warn("Erro ao buscar likes da vaga:", e);
            }
          }
        } catch (e) {
          console.warn("Erro ao buscar vagas do usuário:", e);
        }
      }

      setState((prevState) => ({
        ...prevState,
        people,
        vacancy,
        interestedPeople: vacancyLikedUserIds,
        isLoading: false,
      }));
    } catch (error: any) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: error.message || "Erro ao carregar pessoas",
      }));
    }
  }, []);

  const loadCurrentUserAndPeople = useCallback(async () => {
    try {
      const currentUser = await userService.getCurrentUser();
      setCurrentUserId(currentUser.id);
      await loadPeople(currentUser.id);
    } catch (error: any) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: error.message || "Erro ao carregar dados",
      }));
    }
  }, [loadPeople]);

  useEffect(() => {
    loadCurrentUserAndPeople();
  }, [loadCurrentUserAndPeople]);

  const handleDismiss = useCallback(async (personId: number) => {
    setState((prevState) => ({
      ...prevState,
      dismissedPeople: [...prevState.dismissedPeople, personId],
    }));

    try {
      console.log(`Pessoa ${personId} foi descartada`);
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        dismissedPeople: prevState.dismissedPeople.filter(
          (id) => id !== personId,
        ),
      }));
    }
  }, []);

  const handleInterest = useCallback(
    async (personId: number): Promise<LikeResponse | null> => {
      if (!currentVacancyId) {
        console.error("Vaga não encontrada");
        return null;
      }

      try {
        // Registra o like na API (vaga dando like em usuário)
        const response = await matchService.createLike({
          user_id: personId,
          vacancy_id: currentVacancyId,
          liker: "vacancy",
        });

        // Adiciona à lista local de interesse
        setState((prevState) => ({
          ...prevState,
          interestedPeople: [...prevState.interestedPeople, personId],
        }));

        return response;
      } catch (error: any) {
        const errorMessage = error.message || "Erro ao registrar interesse";
        console.error("Erro ao registrar interesse:", errorMessage);

        if (!errorMessage.includes("already liked")) {
          setState((prevState) => ({
            ...prevState,
            error: errorMessage,
          }));
        }

        return null;
      }
    },
    [currentVacancyId],
  );

  const refreshPeople = useCallback(async () => {
    await loadPeople();
  }, [loadPeople]);

  const filteredPeople = state.people.filter(
    (person) =>
      !state.dismissedPeople.includes(person.id) &&
      !state.interestedPeople.includes(person.id) &&
      person.id !== currentUserId,
  );

  return {
    ...state,
    people: filteredPeople,
    handleDismiss,
    handleInterest,
    refreshPeople,
  };
};
