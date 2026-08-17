import { UserApiResponse } from "../types/api";
import { ProfilePreference, UserProfile } from "../types/profile";
import { UserPreferenceApiResponse } from "../types/userPreferences";

export const mapApiUserToProfile = (apiUser: UserApiResponse): UserProfile => {

  const generateAvatar = (name: string): string => {

    const seed = name.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");

    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4`;
  };

  const defaultPreferences: ProfilePreference[] = [
    {
      icon: "fas fa-paw",
      label: "Animais",
      value: "Não informado",
    },
    {
      icon: "fas fa-smoking-ban",
      label: "Fumantes",
      value: "Não informado",
    },
    {
      icon: "fas fa-users",
      label: "Visitas",
      value: "Não informado",
    },
  ];

  return {

    name: apiUser.name,
    profileImage: apiUser.profile_picture_path || generateAvatar(apiUser.name),
    aboutMe:
      apiUser.description?.trim() ||
      "Nenhuma descrição disponível.",
    preferences: defaultPreferences,
  };
};

export const mapApiPreferencesToProfile = (
  apiPreferences: UserPreferenceApiResponse[]
): ProfilePreference[] => {
  const mapRateToValue = (rate: string): string => {
    switch (rate.toUpperCase()) {
      case "YES":
        return "Sim";
      case "NO":
        return "Não";
      case "INDIFFERENT":
        return "Indiferente";
      default:
        return "Não informado";
    }
  };

  const getIconForPreference = (title: string): string => {
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes("fumante") || lowerTitle.includes("fumo")) {
      return "fas fa-smoking";
    }
    if (lowerTitle.includes("pet") || lowerTitle.includes("animal")) {
      return "fas fa-paw";
    }
    if (lowerTitle.includes("home office") || lowerTitle.includes("trabalha")) {
      return "fas fa-laptop-house";
    }
    if (lowerTitle.includes("estudante") || lowerTitle.includes("estuda")) {
      return "fas fa-graduation-cap";
    }
    if (lowerTitle.includes("acorda") || lowerTitle.includes("cedo")) {
      return "fas fa-sun";
    }
    if (lowerTitle.includes("dorme") || lowerTitle.includes("tarde")) {
      return "fas fa-moon";
    }
    if (lowerTitle.includes("festa") || lowerTitle.includes("social")) {
      return "fas fa-glass-cheers";
    }
    if (lowerTitle.includes("instrumento") || lowerTitle.includes("música")) {
      return "fas fa-guitar";
    }
    if (lowerTitle.includes("cozinha") || lowerTitle.includes("cozinhar")) {
      return "fas fa-utensils";
    }
    if (lowerTitle.includes("organizado") || lowerTitle.includes("limpeza")) {
      return "fas fa-broom";
    }
    if (lowerTitle.includes("estacionamento") || lowerTitle.includes("carro")) {
      return "fas fa-car";
    }
    if (lowerTitle.includes("visita") || lowerTitle.includes("visitante")) {
      return "fas fa-users";
    }
    if (lowerTitle.includes("silêncio") || lowerTitle.includes("barulho")) {
      return "fas fa-volume-down";
    }

    return "fas fa-cog";
  };

  return apiPreferences.map((pref) => {
    return {
      icon: getIconForPreference(pref.title),
      label: pref.title,
      value: mapRateToValue(pref.rate),
      preference_id: pref.preference_id,
      rate: pref.rate,
    };
  });
};

export const mapApiPreferencesToProfileLegacy = (
  preferences: any
): ProfilePreference[] => {
  const mappedPreferences: ProfilePreference[] = [];

  if (preferences?.pets_allowed !== undefined) {
    mappedPreferences.push({
      icon: "fas fa-paw",
      label: "Animais",
      value: preferences.pets_allowed ? "Sim" : "Não",
    });
  }

  if (preferences?.smoking_allowed !== undefined) {
    mappedPreferences.push({
      icon: "fas fa-smoking-ban",
      label: "Fumantes",
      value: preferences.smoking_allowed ? "Sim" : "Não",
    });
  }

  if (preferences?.visitors_allowed !== undefined) {
    mappedPreferences.push({
      icon: "fas fa-users",
      label: "Visitas",
      value: preferences.visitors_allowed ? "Sim" : "Não",
    });
  }

  return mappedPreferences;
};
