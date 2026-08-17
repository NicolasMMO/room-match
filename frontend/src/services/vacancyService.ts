import { apiClient } from "../api/axios";
import {
  VacancyApiResponse,
  VacancyApiType,
  VacancyCreateRequest,
  VacancyListApiResponse,
  VacancySearchParams,
  VacancyUpdateRequest,
} from "../types/vacancy";

export const vacancyService = {

  getAllVacancies: async (
    params?: VacancySearchParams
  ): Promise<VacancyListApiResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.skip !== undefined) {
      searchParams.append("skip", params.skip.toString());
    }
    if (params?.limit !== undefined) {
      searchParams.append("limit", params.limit.toString());
    }

    const url = `/vacancies/${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    const response = await apiClient.get<VacancyListApiResponse>(url);
    return response.data;
  },

  getVacancyById: async (id: number): Promise<VacancyApiResponse> => {
    const response = await apiClient.get<VacancyApiResponse>(
      `/vacancies/${id}`
    );
    return response.data;
  },

  createVacancy: async (
    vacancy: VacancyCreateRequest
  ): Promise<VacancyApiResponse> => {
    const response = await apiClient.post<VacancyApiResponse>(
      "/vacancies/",
      vacancy
    );
    return response.data;
  },

  updateVacancy: async (
    id: number,
    vacancy: VacancyUpdateRequest
  ): Promise<VacancyApiResponse> => {
    const response = await apiClient.put<VacancyApiResponse>(
      `/vacancies/${id}`,
      vacancy
    );
    return response.data;
  },

  deleteVacancy: async (id: number): Promise<void> => {
    await apiClient.delete(`/vacancies/${id}`);
  },

  getVacanciesByUser: async (userId: number): Promise<VacancyApiResponse[]> => {
    const response = await apiClient.get<VacancyApiResponse[]>(
      `/vacancies/user/${userId}`
    );
    return response.data;
  },

  getVacanciesByType: async (
    vacancyType: VacancyApiType,
    params?: VacancySearchParams
  ): Promise<VacancyListApiResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.skip !== undefined) {
      searchParams.append("skip", params.skip.toString());
    }
    if (params?.limit !== undefined) {
      searchParams.append("limit", params.limit.toString());
    }

    const url = `/vacancies/type/${vacancyType}/${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    const response = await apiClient.get<VacancyListApiResponse>(url);
    return response.data;
  },
};
