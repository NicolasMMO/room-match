export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  age?: number;
  profession?: string;
  profileImage?: string;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  allowsSmokers: boolean;
  allowsPets: boolean;
  allowsParties: boolean;
  needsQuietEnvironment: boolean;
  prioritizesCleanness: boolean;
  maxBudget?: number;
  preferredLocation?: string;
  preferredRoommates?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  age?: number;
  profession?: string;
  profileImage?: File;
  preferences?: UserPreferences;
}
