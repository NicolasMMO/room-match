import { RoomListingFormData } from "../types/createListing";
import {
  MatchScore,
  ScoreWithVacancy,
  Vacancy,
  VacancyApiResponse,
  VacancyApiType,
  VacancyCreateRequest,
} from "../types/vacancy";
import { generateSlug } from "./slugUtils";

const createMatchScore = (
  percentage: number,
  level: "high" | "medium" | "low",
): MatchScore => {
  let icon: string;

  if (percentage >= 85) {
    icon = "fas fa-star";
  } else if (percentage >= 70) {
    icon = "fas fa-star-half-alt";
  } else {
    icon = "far fa-star";
  }

  return { percentage, level, icon };
};

const calculateFallbackMatchScore = (): MatchScore => {
  const percentage = Math.floor(Math.random() * 41) + 60;

  let level: "high" | "medium" | "low";

  if (percentage >= 85) {
    level = "high";
  } else if (percentage >= 70) {
    level = "medium";
  } else {
    level = "low";
  }

  return createMatchScore(percentage, level);
};

const parseLocation = (apiVacancy: VacancyApiResponse) => {
  const parts = [];
  if (apiVacancy.address_street) {
    parts.push(apiVacancy.address_street);
  }
  if (apiVacancy.address_number) {
    parts.push(apiVacancy.address_number);
  }
  if (apiVacancy.address_neighborhood) {
    parts.push(apiVacancy.address_neighborhood);
  }
  const fullAddress = parts.join(", ");

  const addressParts = fullAddress.split(",").map((part) => part.trim());

  if (addressParts.length >= 2) {
    const neighborhood = addressParts[addressParts.length - 2] || "Centro";
    const city = addressParts[addressParts.length - 1] || "São Paulo";
    return `${neighborhood}, ${city}`;
  }

  return fullAddress || "Localização não informada";
};

const generateDefaultPhoto = (title: string) => {
  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  ];

  const gradientIndex = title.length % gradients.length;

  return {
    gradient: gradients[gradientIndex],
    alt: title,
  };
};

export const mapApiVacancyToFrontend = (
  apiVacancy: VacancyApiResponse,
  score?: ScoreWithVacancy,
): Vacancy => {
  const matchScore = score
    ? createMatchScore(score.percentage, score.level)
    : calculateFallbackMatchScore();
  const location = parseLocation(apiVacancy);
  const photo = generateDefaultPhoto(apiVacancy.title);

  return {
    id: apiVacancy.id.toString(), // Usa o ID real da vaga do banco
    userId: apiVacancy.user_id,
    title: apiVacancy.title,
    location: location,
    price: `R$ ${parseFloat(apiVacancy.rent.toString())
      .toFixed(2)
      .replace(".", ",")}`,
    type: "real",
    matchScore: matchScore,
    photo: photo,
    actions: {
      dismissText: "Não tenho interesse",
      interestText: "Tenho interesse",
    },
    detailsUrl: `/vacancy/${generateSlug(apiVacancy.title)}`,
  };
};

export const mapFormDataToApiRequest = (
  formData: RoomListingFormData,
  userId: number,
): VacancyCreateRequest => {
  const address = formData.address.trim();
  let address_street = "";
  let address_number = "";
  let address_neighborhood = "";

  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part);

  if (parts.length >= 3) {
    address_street = parts[0];
    address_number = parts[1];
    address_neighborhood = parts[2];
  } else if (parts.length === 2) {
    address_street = parts[0];

    if (/^\d+$/.test(parts[1])) {
      address_number = parts[1];
    } else {
      address_neighborhood = parts[1];
    }
  } else if (parts.length === 1) {
    const match = address.match(/^(.+?)\s+(\d+)\s*(.*)$/);
    if (match) {
      address_street = match[1].trim();
      address_number = match[2];
      address_neighborhood = match[3].trim() || "";
    } else {
      address_street = address;
    }
  }

  return {
    user_id: userId,
    vacancy_type: "PROPERTY" as VacancyApiType,
    address_street: address_street || undefined,
    address_neighborhood: address_neighborhood || undefined,
    address_number: address_number || undefined,
    title: formData.title,
    description: formData.description,
    rent: formData.rent || 0,
    available_spots: formData.vacancies || 1,
    total_rooms: formData.rooms || 1,

    photo_path:
      formData.photos.length > 0 ? "photo_placeholder.jpg" : undefined,
  };
};

export const mapGroupSearchToApiRequest = (
  formData: any,
  userId: number,
): VacancyCreateRequest => {
  return {
    user_id: userId,
    vacancy_type: "SEARCH_GROUP" as VacancyApiType,
    address_street: undefined,
    address_neighborhood: undefined,
    address_number: undefined,
    title: formData.title,
    description: formData.description,
    rent: formData.maxRent || 0,
    available_spots: formData.remainingVacancies || 1,
    total_rooms: formData.desiredRooms || 1,
    photo_path: undefined,
  };
};

export const mapApiVacanciesToFrontend = (
  apiVacancies: VacancyApiResponse[],
  scoresMap?: Map<number, ScoreWithVacancy>,
): Vacancy[] => {
  return apiVacancies.map((vacancy) => {
    const score = scoresMap?.get(vacancy.id);
    return mapApiVacancyToFrontend(vacancy, score);
  });
};
