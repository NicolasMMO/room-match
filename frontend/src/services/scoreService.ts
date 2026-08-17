import { apiClient } from "../api/axios";
import {
  ScoreBatchRequest,
  ScoreBatchResponse,
  ScoreResult,
} from "../types/vacancy";

export const scoreService = {
  /**
   * Calculate compatibility score between a user and a vacancy
   */
  calculateUserVacancyScore: async (
    userId: number,
    vacancyId: number,
    includeDetails = false
  ): Promise<ScoreResult> => {
    const response = await apiClient.get<ScoreResult>(
      `/score/user/${userId}/vacancy/${vacancyId}?include_details=${includeDetails}`
    );
    return response.data;
  },

  /**
   * Calculate scores for multiple vacancies at once
   */
  calculateScoresBatch: async (
    userId: number,
    vacancyIds: number[]
  ): Promise<ScoreBatchResponse> => {
    const request: ScoreBatchRequest = {
      user_id: userId,
      vacancy_ids: vacancyIds,
    };
    const response = await apiClient.post<ScoreBatchResponse>(
      "/score/batch",
      request
    );
    return response.data;
  },
};
