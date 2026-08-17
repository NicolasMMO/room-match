
export interface UserApiResponse {
  id: number;
  name: string;
  email: string;
  birthday: string | null;
  profile_picture_path: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface UserPreferencesApiResponse {
  id: number;
  user_id: number;
  pets_allowed: boolean;
  smoking_allowed: boolean;
  visitors_allowed: boolean;
  noise_tolerance: string;
  cleanliness_level: string;

}
