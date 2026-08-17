export interface ProfilePreference {
  icon: string;
  label: string;
  value: string;
  // Extra metadata for edit flows (safe to ignore in display components)
  preference_id?: number;
  rate?: "YES" | "NO" | "INDIFFERENT";
}

export interface UserProfile {
  name: string;
  profileImage: string;
  aboutMe: string;
  preferences: ProfilePreference[];
}

export interface ProfileActions {
  onEditProfile: () => void;
  onChangePassword: () => void;
}
