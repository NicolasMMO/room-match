export type LikerType = "user" | "vacancy";

export interface LikeRequest {
  user_id: number;
  vacancy_id: number;
  liker: LikerType;
}

export interface LikeResponse {
  liked: boolean;
  matched: boolean;
  match_id: number | null;
}

export interface Match {
  id: number;
  user_id: number;
  vacancy_id: number;
  created_at: string;
}

export interface VacancyInfo {
  id: number;
  title: string;
  address_street?: string;
  address_neighborhood?: string;
  address_number?: string;
  rent: string;
  available_spots: number;
  total_rooms: number;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
}

export interface MatchWithDetails extends Match {
  vacancy?: VacancyInfo;
  user?: UserInfo;
}

export interface UserMatchesResponse {
  matches: MatchWithDetails[];
  total: number;
}

export interface UserLikesResponse {
  vacancy_ids: number[];
}

export interface VacancyLikesResponse {
  user_ids: number[];
}
