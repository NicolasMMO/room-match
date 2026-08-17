import { useCallback, useEffect, useState } from "react";
import { userService } from "../services/userService";
import { UserProfile } from "../types/profile";
import {
  mapApiPreferencesToProfile,
  mapApiUserToProfile,
} from "../utils/mappers";

export const useProfile = (userId: string | number) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (id: string | number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.getUserByIdRaw(id);
      const apiUser = response.data;
      const mappedProfile = mapApiUserToProfile(apiUser);
      const userPreferences = await userService.getUserPreferences(Number(id));

      if (userPreferences && userPreferences.preferences.length > 0) {
        const mappedPreferences = mapApiPreferencesToProfile(
          userPreferences.preferences,
        );
        mappedProfile.preferences = mappedPreferences;
      }

      setProfile(mappedProfile);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Usuário não encontrado");
      } else if (err.response?.status >= 500) {
        setError("Erro interno do servidor. Tente novamente mais tarde.");
      } else {
        setError("Erro ao carregar perfil. Verifique sua conexão.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      loadProfile(userId);
    }
  }, [userId, loadProfile]);

  return {
    profile,
    isLoading,
    error,
  };
};
