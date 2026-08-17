import { apiClient } from "../api";

export interface PreferenceMapping {
  [key: string]: number;
}

export interface UserPreference {
  preference_id: number;
  rate: "YES" | "NO" | "INDIFFERENT";
}

export interface UserPreferencesPayload {
  preferences: UserPreference[];
}

export type AnswerType = "BOOLEAN" | "TERNARY";

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

export const PREFERENCE_MAPPING: PreferenceMapping = {
  smoking: 2,
  cleanliness: 3,
  quietness: 4,
  pets: 1,
  parties: 5,
};

export const RESPONSE_MAPPING = {
  Sim: "YES" as const,
  Não: "NO" as const,
  Indiferente: "INDIFFERENT" as const,
};

export const userPreferencesService = {

  getAvailablePreferences: async (): Promise<AvailablePreferencesResponse> => {
    const response = await apiClient.get(
      "/users/preferences/available?preference_type=USER"
    );
    return response.data;
  },

  saveUserPreferences: async (
    userId: number,
    preferences: UserPreferencesPayload
  ) => {
    const response = await apiClient.post(
      `/users/${userId}/preferences/bulk`,
      preferences
    );
    return response.data;
  },

  getUserPreferences: async (userId: number) => {
    const response = await apiClient.get(`/users/${userId}/preferences`);
    return response.data;
  },

  convertPreferencesToAPI: (
    frontendPreferences: Record<string, string>
  ): UserPreference[] => {
    return Object.entries(frontendPreferences).map(([questionId, answer]) => ({
      preference_id: PREFERENCE_MAPPING[questionId],
      rate: RESPONSE_MAPPING[answer as keyof typeof RESPONSE_MAPPING],
    }));
  },
};
