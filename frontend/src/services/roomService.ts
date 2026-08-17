import { apiClient } from "../api";
import { Vacancy, VacancyFilters } from "../types";

export const roomService = {

  getVacancies: async (filters?: VacancyFilters): Promise<Vacancy[]> => {
    const response = await apiClient.get("/vacancies", { params: filters });
    return response.data;
  },

  getVacancyById: async (id: string): Promise<Vacancy> => {
    const response = await apiClient.get(`/vacancies/${id}`);
    return response.data;
  },

  createVacancy: async (data: Partial<Vacancy>): Promise<Vacancy> => {
    const response = await apiClient.post("/vacancies", data);
    return response.data;
  },

  showInterest: async (vacancyId: string): Promise<void> => {
    await apiClient.post(`/vacancies/${vacancyId}/interest`);
  },

  dismissVacancy: async (vacancyId: string): Promise<void> => {
    await apiClient.post(`/vacancies/${vacancyId}/dismiss`);
  },

  getMyVacancies: async (): Promise<Vacancy[]> => {
    const response = await apiClient.get("/vacancies/my");
    return response.data;
  },

  updateVacancy: async (
    id: string,
    data: Partial<Vacancy>,
  ): Promise<Vacancy> => {
    const response = await apiClient.put(`/vacancies/${id}`, data);
    return response.data;
  },

  deleteVacancy: async (id: string): Promise<void> => {
    await apiClient.delete(`/vacancies/${id}`);
  },
};
