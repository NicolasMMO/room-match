import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { roomService } from "../../services/room.service";
import { ExpressInterestData, RoomFilters, UpdateRoomData } from "../types";

export const useRooms = (filters?: RoomFilters) => {
  return useQuery({
    queryKey: ["rooms", filters],
    queryFn: () => roomService.getRooms(filters),
    staleTime: 2 * 60 * 1000,
  });
};

export const useRoom = (id: string) => {
  return useQuery({
    queryKey: ["room", id],
    queryFn: () => roomService.getRoomById(id),
    enabled: !!id,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomService.createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoomData }) =>
      roomService.updateRoom(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["room", id] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomService.deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};

export const useExpressInterest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      data,
    }: {
      roomId: string;
      data: ExpressInterestData;
    }) => roomService.expressInterest(roomId, data),
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: ["room", roomId] });
      queryClient.invalidateQueries({ queryKey: ["myInterests"] });
    },
  });
};

export const useDismissInterest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomService.dismissInterest,
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({ queryKey: ["room", roomId] });
      queryClient.invalidateQueries({ queryKey: ["myInterests"] });
    },
  });
};

export const useMyRooms = () => {
  return useQuery({
    queryKey: ["myRooms"],
    queryFn: roomService.getMyRooms,
  });
};

export const useMyInterests = () => {
  return useQuery({
    queryKey: ["myInterests"],
    queryFn: roomService.getMyInterests,
  });
};

export const useManageRoomUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      userId,
      action,
    }: {
      roomId: string;
      userId: string;
      action: "accept" | "reject";
    }) => roomService.manageRoomUser(roomId, userId, action),
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: ["room", roomId] });
      queryClient.invalidateQueries({ queryKey: ["myRooms"] });
    },
  });
};
