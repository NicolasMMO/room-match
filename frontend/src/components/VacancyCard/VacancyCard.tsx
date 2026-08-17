import React from "react";
import { Link } from "react-router-dom";
import { Vacancy, VacancyActions } from "../../types/vacancy";
import { generateSlug } from "../../utils/slugUtils";
import CardActions from "../CardActions";
import VacancyInfo from "../VacancyInfo";
import VacancyPhoto from "../VacancyPhoto";

interface VacancyCardProps {
  vacancy: Vacancy;
  onDismiss: VacancyActions["handleDismiss"];
  onInterest: VacancyActions["handleInterest"];
}

export const VacancyCard: React.FC<VacancyCardProps> = ({
  vacancy,
  onDismiss,
  onInterest,
}) => {
  return (
    <div
      className="
      flex flex-col overflow-hidden rounded-xl
      bg-white shadow-lg transition-transform duration-200
      hover:-translate-y-1
    "
    >
      <Link
        to={`/vacancy/${generateSlug(vacancy.title)}`}
        state={{ id: parseInt(vacancy.id) }}
        className="
          flex flex-grow
          flex-col text-inherit no-underline
        "
      >
        <VacancyPhoto
          photo={vacancy.photo}
          matchScore={vacancy.matchScore}
          type={vacancy.type}
        />
        <VacancyInfo
          title={vacancy.title}
          location={vacancy.location}
          price={vacancy.price}
        />
      </Link>
      <CardActions
        itemId={vacancy.id}
        onDismiss={onDismiss}
        onInterest={onInterest}
      />
    </div>
  );
};

export default VacancyCard;
