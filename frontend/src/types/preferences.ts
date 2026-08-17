export interface PreferenceOption {
  label: string;
  value: string;
}

export interface PreferenceQuestion {
  id: string;
  question: string;
  options: PreferenceOption[];
}

export interface PreferenceSection {
  id: string;
  icon: string;
  title: string;
  description: string;
  questions: PreferenceQuestion[];
}

export interface UserPreferences {
  [questionId: string]: string;
}

export interface PreferencesData {
  sections: PreferenceSection[];
}
