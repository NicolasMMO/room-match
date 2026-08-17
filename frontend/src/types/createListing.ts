export type ListingType = "room" | "group";

export type PreferenceValue =
  | "YES"
  | "no"
  | "maybe"
  | "outside"
  | "indifferent"
  | null;

export interface PreferenceOption {
  id: string;
  label: string;
  value: PreferenceValue;
}

export interface FormPreference {
  id: string;
  label: string;
  options: PreferenceOption[];
  selectedValue: PreferenceValue;
}

export interface RoomListingFormData {
  title: string;
  description: string;
  address: string;
  rent: number;
  vacancies: number;
  rooms: number;
  preferences: {
    pets: PreferenceValue;
    smoking: PreferenceValue;
    cleanliness: PreferenceValue;
    quietness: PreferenceValue;
    parties: PreferenceValue;
  };
  photos: File[];
}

export interface GroupSearchFormData {
  title: string;
  description: string;
  maxRent: number;
  remainingVacancies: number;
  desiredRooms: number;
  preferences: {
    pets: PreferenceValue;
    smoking: PreferenceValue;
    cleanliness: PreferenceValue;
    quietness: PreferenceValue;
    parties: PreferenceValue;
  };
}

export interface FormValidationErrors {
  title?: string;
  description?: string;
  address?: string;
  rent?: string;
  maxRent?: string;
  vacancies?: string;
  remainingVacancies?: string;
  rooms?: string;
  desiredRooms?: string;
  photos?: string;
  preferences?: string;
}

export interface CreateListingState {
  formData: RoomListingFormData | GroupSearchFormData;
  errors: FormValidationErrors;
  isSubmitting: boolean;
  isSuccess: boolean;
}

export interface CreateListingActions {
  updateField: (field: string, value: any) => void;
  updatePreference: (preference: string, value: PreferenceValue) => void;
  addPhoto: (file: File) => void;
  removePhoto: (index: number) => void;
  validateForm: () => boolean;
  submitForm: () => Promise<void>;
  resetForm: () => void;
}
