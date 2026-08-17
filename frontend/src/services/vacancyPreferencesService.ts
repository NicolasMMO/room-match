import { apiClient } from "../api";

export type AnswerType = "BOOLEAN" | "TERNARY";

export interface VacancyPreference {
  preference_id: number;
  rate: "YES" | "NO" | "INDIFFERENT";
}

export interface VacancyPreferencesPayload {
  preferences: VacancyPreference[];
}

export interface AvailablePreference {
  id: number;
  title: string;
  preference_type: string;
  answer_type: AnswerType;
}

export interface AvailablePreferencesResponse {
  preferences: AvailablePreference[];
  total: number;
  by_type: Record<string, number>;
}

export const RESPONSE_MAPPING: Record<string, "YES" | "NO" | "INDIFFERENT"> = {
  Sim: "YES",
  Não: "NO",
  Indiferente: "INDIFFERENT",
};

export const vacancyPreferencesService = {
  getAvailablePreferences: async (): Promise<AvailablePreferencesResponse> => {
    const response = await apiClient.get(
      "/users/preferences/available?preference_type=VACANCY"
    );
    return response.data;
  },

  saveVacancyPreferences: async (
    vacancyId: number,
    preferences: VacancyPreferencesPayload
  ) => {
    const response = await apiClient.post(
      `/vacancies/${vacancyId}/preferences/bulk`,
      preferences
    );
    return response.data;
  },

  getVacancyPreferences: async (vacancyId: number) => {
    const response = await apiClient.get(`/vacancies/${vacancyId}/preferences`);
    return response.data;
  },
};
