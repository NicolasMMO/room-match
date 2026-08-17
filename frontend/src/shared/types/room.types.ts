export interface Room {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  availableSpots: number;
  totalRooms: number;
  images: string[];
  availableFrom: string;
  ownerId: string;
  owner: {
    name: string;
    email: string;
    phone?: string;
  };
  rules: RoomRules;
  isReal: boolean;
  matchScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoomRules {
  allowsPets: boolean;
  allowsSmokers: boolean;
  allowsParties: boolean;
}

export interface CreateRoomData {
  title: string;
  description: string;
  price: number;
  location: string;
  availableSpots: number;
  totalRooms: number;
  images: File[];
  availableFrom: string;
  rules: RoomRules;
  isReal: boolean;
}

export interface UpdateRoomData extends Partial<CreateRoomData> {
  id: string;
}

export interface RoomFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  allowsPets?: boolean;
  allowsSmokers?: boolean;
  allowsParties?: boolean;
  availableFrom?: string;
  isReal?: boolean;
}

export interface ExpressInterestData {
  message?: string;
}

export interface RoomInterest {
  id: string;
  userId: string;
  roomId: string;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  room: Room;
}
