import { apiClient } from "../api/axios";
import {
  LikeRequest,
  LikeResponse,
  UserLikesResponse,
  UserMatchesResponse,
  VacancyLikesResponse,
} from "../types/match";

export const matchService = {
  /**
   * Registra um like e verifica se houve match
   */
  createLike: async (likeData: LikeRequest): Promise<LikeResponse> => {
    try {
      const response = await apiClient.post<LikeResponse>(
        "/matches/like",
        likeData,
      );
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.detail || "Erro ao registrar interesse",
        status: error.response?.status || 500,
      };
    }
  },

  /**
   * Busca todos os matches do usuário atual
   */
  getUserMatches: async (userId: number): Promise<UserMatchesResponse> => {
    try {
      const response = await apiClient.get<UserMatchesResponse>(
        `/matches/user/${userId}`,
      );
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.detail || "Erro ao buscar matches",
        status: error.response?.status || 500,
      };
    }
  },

  /**
   * Busca os matches de uma vaga específica
   */
  getVacancyMatches: async (
    vacancyId: number,
  ): Promise<UserMatchesResponse> => {
    try {
      const response = await apiClient.get<UserMatchesResponse>(
        `/matches/vacancy/${vacancyId}`,
      );
      return response.data;
    } catch (error: any) {
      throw {
        message:
          error.response?.data?.detail || "Erro ao buscar matches da vaga",
        status: error.response?.status || 500,
      };
    }
  },

  /**
   * Busca os IDs das vagas que o usuário já deu like
   */
  getUserLikes: async (userId: number): Promise<UserLikesResponse> => {
    try {
      const response = await apiClient.get<UserLikesResponse>(
        `/matches/user/${userId}/likes`,
      );
      return response.data;
    } catch (error: any) {
      throw {
        message:
          error.response?.data?.detail || "Erro ao buscar likes do usuário",
        status: error.response?.status || 500,
      };
    }
  },

  /**
   * Busca os IDs dos usuários que a vaga já deu like
   */
  getVacancyLikes: async (vacancyId: number): Promise<VacancyLikesResponse> => {
    try {
      const response = await apiClient.get<VacancyLikesResponse>(
        `/matches/vacancy/${vacancyId}/likes`,
      );
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.detail || "Erro ao buscar likes da vaga",
        status: error.response?.status || 500,
      };
    }
  },
};

export default matchService;
