import React from "react";
import { Person, PersonActions } from "../../types/person";
import CardActions from "../CardActions";
import MatchScoreBadge from "../MatchScoreBadge";
import PersonInfo from "../PersonInfo";
import PersonPhoto from "../PersonPhoto";

interface PersonCardProps {
  person: Person;
  onDismiss: PersonActions["handleDismiss"];
  onInterest: PersonActions["handleInterest"];
}

export const PersonCard: React.FC<PersonCardProps> = ({
  person,
  onDismiss,
  onInterest,
}) => {
  return (
    <div
      className="
      relative flex flex-col
      overflow-hidden rounded-xl bg-white
      text-center shadow-lg
      transition-transform duration-200
      hover:-translate-y-1
    "
    >
      <MatchScoreBadge matchScore={person.matchScore} />

      <PersonPhoto
        src={person.profileImage}
        alt={`Foto do ${person.name}`}
        name={person.name}
      />

      <PersonInfo
        name={person.name}
        occupation={person.occupation}
        bio={person.bio}
        id={person.id}
      />

      <CardActions
        itemId={person.id}
        onDismiss={onDismiss}
        onInterest={onInterest}
      />
    </div>
  );
};

export default PersonCard;
