import { useCallback, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  FormValidationErrors,
  GroupSearchFormData,
  ListingType,
  PreferenceValue,
  RoomListingFormData,
} from "../types/createListing";

const initialRoomListingData: RoomListingFormData = {
  title: "",
  description: "",
  address: "",
  rent: 0,
  vacancies: 1,
  rooms: 1,
  preferences: {
    pets: null,
    smoking: null,
    cleanliness: null,
    quietness: null,
    parties: null,
  },
  photos: [],
};

const initialGroupSearchData: GroupSearchFormData = {
  title: "",
  description: "",
  maxRent: 0,
  remainingVacancies: 1,
  desiredRooms: 1,
  preferences: {
    pets: null,
    smoking: null,
    cleanliness: null,
    quietness: null,
    parties: null,
  },
};

export const useCreateListing = (listingType: ListingType) => {
  const { getCurrentUserId } = useAuth();
  const [formData, setFormData] = useState<
    RoomListingFormData | GroupSearchFormData
  >(listingType === "room" ? initialRoomListingData : initialGroupSearchData);
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastCreatedVacancyId, setLastCreatedVacancyId] = useState<number | null>(null);

  const updateField = useCallback(
    (field: string, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (errors[field as keyof FormValidationErrors]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    },
    [errors],
  );

  const updatePreference = useCallback(
    (preference: string, value: PreferenceValue) => {
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [preference]: value,
        },
      }));
    },
    [],
  );

  const addPhoto = useCallback(
    (file: File) => {
      if (listingType === "room") {
        setFormData((prev) => ({
          ...prev,
          photos: [...(prev as RoomListingFormData).photos, file],
        }));
      }
    },
    [listingType],
  );

  const removePhoto = useCallback(
    (index: number) => {
      if (listingType === "room") {
        setFormData((prev) => ({
          ...prev,
          photos: (prev as RoomListingFormData).photos.filter(
            (_, i) => i !== index,
          ),
        }));
      }
    },
    [listingType],
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: FormValidationErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    } else if (formData.title.length < 10) {
      newErrors.title = "Título deve ter pelo menos 10 caracteres";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    } else if (formData.description.length < 20) {
      newErrors.description = "Descrição deve ter pelo menos 20 caracteres";
    }

    // Preferences validation is now handled externally by the page component

    if (listingType === "room") {
      const roomData = formData as RoomListingFormData;
      if (!roomData.address.trim()) {
        newErrors.address = "Endereço é obrigatório";
      } else if (roomData.address.length < 10) {
        newErrors.address = "Endereço deve ter pelo menos 10 caracteres";
      }
    }

    if (listingType === "room") {
      const roomData = formData as RoomListingFormData;
      if (!roomData.rent || roomData.rent <= 0) {
        newErrors.rent = "Valor do aluguel é obrigatório";
      }
      if (!roomData.vacancies || roomData.vacancies <= 0) {
        newErrors.vacancies = "Número de vagas é obrigatório";
      }
      if (!roomData.rooms || roomData.rooms <= 0) {
        newErrors.rooms = "Número de quartos é obrigatório";
      }
    } else {
      const groupData = formData as GroupSearchFormData;
      if (!groupData.maxRent || groupData.maxRent <= 0) {
        newErrors.maxRent = "Orçamento máximo é obrigatório";
      }
      if (!groupData.remainingVacancies || groupData.remainingVacancies <= 0) {
        newErrors.remainingVacancies = "Vagas restantes é obrigatório";
      }
      if (!groupData.desiredRooms || groupData.desiredRooms <= 0) {
        newErrors.desiredRooms = "Número de quartos é obrigatório";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        const firstErrorField = Object.keys(newErrors)[0];
        const fieldMapping: Record<string, string> = {
          title: 'input[name="title"]',
          description: 'textarea[name="description"]',
          address: 'input[name="address"]',
          rent: 'input[name="rent"]',
          vacancies: 'input[name="vacancies"]',
          rooms: 'input[name="rooms"]',
          maxRent: 'input[name="maxRent"]',
          remainingVacancies: 'input[name="remainingVacancies"]',
          desiredRooms: 'input[name="desiredRooms"]',
          preferences: ".preference-list",
        };

        const selector = fieldMapping[firstErrorField];
        if (selector) {
          const element = document.querySelector(selector);
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
      }, 100);
    }

    return Object.keys(newErrors).length === 0;
  }, [formData, listingType]);

  const resetForm = useCallback(() => {
    setFormData(
      listingType === "room" ? initialRoomListingData : initialGroupSearchData,
    );
    setErrors({});
    setIsSubmitting(false);
    setIsSuccess(false);
  }, [listingType]);

  const submitForm = useCallback(async (): Promise<number | null> => {
    console.log("submitForm chamado - validando formulário...");

    if (!validateForm()) {
      console.log("Validação falhou - formulário não enviado");
      return null;
    }

    console.log("Validação passou - iniciando envio...");
    setIsSubmitting(true);
    setLastCreatedVacancyId(null);

    try {
      if (listingType === "room") {
        const { vacancyService } = await import("../services/vacancyService");
        const { mapFormDataToApiRequest } =
          await import("../utils/vacancyMappers");

        const currentUserId = getCurrentUserId();
        if (!currentUserId) {
          console.error("Usuário não está logado");
          alert("Usuário não está logado. Faça login para continuar.");
          return null;
        }

        const apiRequest = mapFormDataToApiRequest(
          formData as RoomListingFormData,
          currentUserId,
        );

        const createdVacancy = await vacancyService.createVacancy(apiRequest);

        console.log("Vaga criada com sucesso:", createdVacancy);
        setLastCreatedVacancyId(createdVacancy.id);
        setIsSuccess(true);

        setTimeout(() => {
          const successMessage = document.getElementById("success-message");
          if (successMessage) {
            successMessage.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 100);

        setTimeout(() => {
          resetForm();
          setIsSuccess(false);
        }, 3000);

        return createdVacancy.id;
      } else {
        const { vacancyService } = await import("../services/vacancyService");
        const { mapGroupSearchToApiRequest } =
          await import("../utils/vacancyMappers");

        const currentUserId = getCurrentUserId();
        if (!currentUserId) {
          console.error("Usuário não está logado");
          alert("Usuário não está logado. Faça login para continuar.");
          return null;
        }

        const apiRequest = mapGroupSearchToApiRequest(formData, currentUserId);

        const createdVacancy = await vacancyService.createVacancy(apiRequest);

        console.log("Grupo de busca criado com sucesso:", createdVacancy);
        setIsSuccess(true);

        setTimeout(() => {
          const successMessage = document.getElementById("success-message");
          if (successMessage) {
            successMessage.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 100);

        setTimeout(() => {
          resetForm();
          setIsSuccess(false);
        }, 3000);

        return createdVacancy.id;
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);

      let errorMessage = "Erro ao enviar formulário. Tente novamente.";

      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ title: errorMessage });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, listingType, getCurrentUserId, resetForm]);

  return {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    lastCreatedVacancyId,
    updateField,
    updatePreference,
    addPhoto,
    removePhoto,
    validateForm,
    submitForm,
    resetForm,
  };
};
