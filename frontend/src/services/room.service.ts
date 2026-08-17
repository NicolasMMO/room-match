import { apiClient } from "../api/axios";
import {
  CreateRoomData,
  ExpressInterestData,
  PaginatedResponse,
  Room,
  RoomFilters,
  RoomInterest,
  UpdateRoomData,
} from "../shared/types";

export const roomService = {
  async getRooms(filters?: RoomFilters): Promise<PaginatedResponse<Room>> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }

    const { data } = await apiClient.get(`/rooms?${params.toString()}`);
    return data;
  },

  async getRoomById(id: string): Promise<Room> {
    const { data } = await apiClient.get(`/rooms/${id}`);
    return data;
  },

  async getRoom(id: string): Promise<Room> {
    return this.getRoomById(id);
  },

  async createRoom(roomData: CreateRoomData): Promise<Room> {
    const formData = new FormData();

    Object.entries(roomData).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        value.forEach((file: File) => {
          formData.append("images", file);
        });
      } else if (key === "rules") {
        formData.append("rules", JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const { data } = await apiClient.post("/rooms", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  async updateRoom(id: string, roomData: UpdateRoomData): Promise<Room> {
    const formData = new FormData();

    Object.entries(roomData).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        value.forEach((file: File) => {
          formData.append("images", file);
        });
      } else if (key === "rules") {
        formData.append("rules", JSON.stringify(value));
      } else if (value !== undefined && value !== null && key !== "id") {
        formData.append(key, String(value));
      }
    });

    const { data } = await apiClient.put(`/rooms/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  async deleteRoom(id: string): Promise<void> {
    await apiClient.delete(`/rooms/${id}`);
  },

  async expressInterest(
    roomId: string,
    interestData: ExpressInterestData,
  ): Promise<RoomInterest> {
    const { data } = await apiClient.post(
      `/rooms/${roomId}/interest`,
      interestData,
    );
    return data;
  },

  async dismissInterest(roomId: string): Promise<void> {
    await apiClient.delete(`/rooms/${roomId}/interest`);
  },

  async getMyRooms(): Promise<Room[]> {
    const { data } = await apiClient.get("/rooms/my-rooms");
    return data;
  },

  async getMyInterests(): Promise<RoomInterest[]> {
    const { data } = await apiClient.get("/rooms/my-interests");
    return data;
  },

  async manageRoomUser(
    roomId: string,
    userId: string,
    action: "accept" | "reject",
  ): Promise<void> {
    await apiClient.post(`/rooms/${roomId}/users/${userId}/${action}`);
  },

  async getInterestedUsers(roomId: string): Promise<RoomInterest[]> {
    const { data } = await apiClient.get(`/rooms/${roomId}/interested-users`);
    return data;
  },
};
