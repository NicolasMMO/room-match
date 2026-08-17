export type VacancyType = "real" | "fictional";

export type MatchScoreLevel = "high" | "medium" | "low";

export interface VacancyTag {
  id: string;
  label: string;
  icon?: string;
}

export interface MatchScore {
  percentage: number;
  level: MatchScoreLevel;
  icon: string;
}

export interface Vacancy {
  id: string;
  userId?: number;
  title: string;
  location: string;
  price: string;
  type: VacancyType;
  matchScore: MatchScore;
  photo: {
    url?: string;
    gradient?: string;
    alt: string;
  };
  actions: {
    dismissText: string;
    interestText: string;
  };
  detailsUrl: string;
}

export interface VacanciesState {
  vacancies: Vacancy[];
  isLoading: boolean;
  error: string | null;
  dismissedVacancies: string[];
  interestedVacancies: string[];
}

export interface VacancyActions {
  handleDismiss: (vacancyId: string) => void;
  handleInterest: (vacancyId: string) => void;
  refreshVacancies: () => void;
}

export type VacancyApiType = "PROPERTY" | "SEARCH_GROUP";

export interface VacancyApiResponse {
  id: number;
  user_id: number;
  vacancy_type: VacancyApiType;
  address_street?: string;
  address_neighborhood?: string;
  address_number?: string;
  title: string;
  description?: string;
  rent: string;
  available_spots: number;
  total_rooms: number;
  created_at: string;
  updated_at?: string;
}

export interface VacancyCreateRequest {
  user_id: number;
  vacancy_type: VacancyApiType;
  address_street?: string;
  address_neighborhood?: string;
  address_number?: string;
  title: string;
  description?: string;
  rent: number;
  available_spots: number;
  total_rooms: number;
  photo_path?: string;
}

export interface VacancyUpdateRequest {
  user_id?: number;
  vacancy_type?: VacancyApiType;
  address_street?: string;
  address_neighborhood?: string;
  address_number?: string;
  title?: string;
  description?: string;
  rent?: number;
  available_spots?: number;
  total_rooms?: number;
  photo_path?: string;
}

export interface VacancyListApiResponse {
  vacancies: VacancyApiResponse[];
  total: number;
  skip: number;
  limit: number;
}

export interface VacancySearchParams {
  skip?: number;
  limit?: number;
  vacancy_type?: VacancyApiType;
  user_id?: number;
}

export interface ScoreResult {
  percentage: number;
  level: "high" | "medium" | "low";
  details?: Record<string, unknown>;
}

export interface ScoreWithVacancy {
  vacancy_id: number;
  percentage: number;
  level: "high" | "medium" | "low";
}

export interface ScoreBatchRequest {
  user_id: number;
  vacancy_ids: number[];
}

export interface ScoreBatchResponse {
  user_id: number;
  scores: ScoreWithVacancy[];
  calculated_at: string;
}
