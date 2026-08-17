export type PersonMatchScoreLevel = "high" | "medium" | "low";

export interface PersonMatchScore {
  percentage: number;
  level: PersonMatchScoreLevel;
  icon: string;
}

export interface Person {
  id: number;
  name: string;
  occupation: string;
  bio: string;
  profileImage: string;
  matchScore: PersonMatchScore;
  detailsUrl: string;
  email?: string;
  birthday?: string | null;
  description?: string | null;
}

export interface PeoplePageState {
  people: Person[];
  vacancy: {
    title: string;
    id: string;
  };
  isLoading: boolean;
  error: string | null;
  dismissedPeople: number[];
  interestedPeople: number[];
}

export interface PersonActions {
  handleDismiss: (personId: number) => void;
  handleInterest: (
    personId: number,
  ) => Promise<import("./match").LikeResponse | null>;
  refreshPeople: () => void;
}
