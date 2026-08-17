import { useCallback, useState } from "react";
import { UserPreferences } from "../types/preferences";

export const usePreferences = (initialPreferences: UserPreferences = {}) => {
  const [preferences, setPreferences] =
    useState<UserPreferences>(initialPreferences);

  const updatePreference = useCallback((questionId: string, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }, []);

  const getPreference = useCallback(
    (questionId: string): string | undefined => {
      return preferences[questionId];
    },
    [preferences],
  );

  const clearPreferences = useCallback(() => {
    setPreferences({});
  }, []);

  const isComplete = useCallback(
    (requiredQuestions: string[]): boolean => {
      return requiredQuestions.every(
        (questionId) =>
          preferences[questionId] && preferences[questionId].trim() !== "",
      );
    },
    [preferences],
  );

  return {
    preferences,
    updatePreference,
    getPreference,
    clearPreferences,
    isComplete,
  };
};
