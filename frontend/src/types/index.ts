export * from "./match";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  profession?: string;
  age?: number;
  phone?: string;
  preferences?: UserPreferences;
  matchScore?: number;
  createdAt: Date;
  updatedAt: Date;
  vacancies?: any[];
}

export interface UserPreferences {
  ageRange?: { min: number; max: number };
  budget?: { min: number; max: number };
  location?: string[];
  lifestyle?: string[];
  amenities?: string[];
  roomType?: "private" | "shared" | "any";
  petFriendly?: boolean;
  smokingAllowed?: boolean;

  smoking?: string;
  cleanliness?: string;
  quietEnvironment?: string;
  pets?: string;
  parties?: string;
}

export interface Vacancy {
  id: string;
  title: string;
  description: string;
  price: number;
  maxPrice?: number;
  location: string;
  address: string;
  images: string[];
  amenities: string[];
  roomType: "private" | "shared";
  type: "real" | "fictional";
  availableFrom: Date;
  ownerId: string;
  owner: User;
  isActive: boolean;
  occupiedSlots: number;
  totalSlots: number;
  matchScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VacancyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  roomType?: "private" | "shared" | "any";
  amenities?: string[];
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  sender: User;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: ChatMessage;
  updatedAt: Date;
}

export interface Match {
  id: string;
  userId: string;
  targetId: string;
  targetType: "user" | "vacancy";
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

export interface FormErrors {
  [key: string]: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: FormErrors;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AppConfig {
  apiBaseUrl: string;
  apiVersion: string;
  environment: string;
}
