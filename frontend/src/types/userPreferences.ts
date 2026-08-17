

export type PreferenceType = "USER" | "VACANCY";
export type PreferenceRate = 1 | 2 | 3 | 4 | 5;
export type PreferenceRateString = "YES" | "NO" | "INDIFFERENT";

export interface UserPreferenceApiResponse {
  preference_id: number;
  title: string;
  preference_type: PreferenceType;
  rate: PreferenceRateString;
}

export interface UserPreferencesListApiResponse {
  user_id: number;
  preferences: UserPreferenceApiResponse[];
  total: number;
}

export interface UserPreferenceCreateRequest {
  preference_id: number;
  rate: PreferenceRate;
}

export interface UserPreferencesCreateListRequest {
  preferences: UserPreferenceCreateRequest[];
}

export interface PreferenceBasicApiResponse {
  id: number;
  title: string;
  preference_type: PreferenceType;
}

export interface PreferencesListApiResponse {
  preferences: PreferenceBasicApiResponse[];
  total: number;
  by_type: Record<string, number>;
}
