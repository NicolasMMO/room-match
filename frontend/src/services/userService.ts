import { apiClient } from "../api";
import { User } from "../types";
import { Person } from "../types/person";
import {
  PreferenceType,
  UserPreferencesListApiResponse,
} from "../types/userPreferences";
import { generateSlug } from "../utils/slugUtils";

interface UserBackendResponse {
  id: number;
  name: string;
  email: string;
  birthday: string | null;
  profile_picture_path: string | null;
  description?: string | null;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  birthday?: string | null;
  profile_picture_path?: string;
}

interface UpdateUserData {
  name?: string;
  description?: string;
}

interface UserCreateResponse {
  id: number;
  name: string;
  email: string;
  birthday: string | null;
  profile_picture_path?: string;
}

const calculateAge = (birthday: string): number => {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const mapBackendUserToPerson = (user: UserBackendResponse): Person => {
  const matchPercentage = Math.floor(Math.random() * 30) + 70;
  const matchLevel: "high" | "medium" | "low" =
    matchPercentage >= 85 ? "high" : matchPercentage >= 70 ? "medium" : "low";

  return {
    id: user.id,
    name: user.name,
    occupation: user.birthday
      ? `${calculateAge(user.birthday)} anos`
      : "Usuário",
    bio: user.description || "Nenhuma descrição disponível",
    profileImage:
      user.profile_picture_path ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
    matchScore: {
      percentage: matchPercentage,
      level: matchLevel,
      icon:
        matchLevel === "high"
          ? "fas fa-star"
          : matchLevel === "medium"
            ? "fas fa-star-half-alt"
            : "far fa-star",
    },
    detailsUrl: `/user/${generateSlug(user.name)}`,
    email: user.email,
    birthday: user.birthday,
    description: user.description,
  };
};

export const userService = {
  getAllUsers: async (): Promise<Person[]> => {
    const response = await apiClient.get<UserBackendResponse[]>("/users/");
    return response.data.map(mapBackendUserToPerson);
  },

  createUser: async (userData: CreateUserData): Promise<UserCreateResponse> => {
    const response = await apiClient.post("/users/", userData);
    return response.data;
  },

  updateUser: async (
    userId: number,
    userData: UpdateUserData,
  ): Promise<any> => {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get("/users/me");
    return response.data;
  },

  getUserById: async (id: string | number): Promise<Person> => {
    const response = await apiClient.get<UserBackendResponse>(`/users/${id}`);
    return mapBackendUserToPerson(response.data);
  },

  getUserByIdRaw: async (id: string | number) => {
    return await apiClient.get<UserBackendResponse>(`/users/${id}`);
  },

  getUserPreferences: async (
    userId: number,
    preferenceType?: PreferenceType,
  ): Promise<UserPreferencesListApiResponse> => {
    const params = preferenceType ? `?preference_type=${preferenceType}` : "";
    const response = await apiClient.get(
      `/users/${userId}/preferences${params}`,
    );
    return response.data;
  },

  getAvailablePreferences:
    async (): Promise<UserPreferencesListApiResponse> => {
      const response = await apiClient.get("/users/preferences/available");
      return response.data;
    },
};
