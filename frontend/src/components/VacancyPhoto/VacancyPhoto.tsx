import React from "react";
import { Vacancy } from "../../types/vacancy";
import MatchScoreBadge from "../MatchScoreBadge";

interface VacancyPhotoProps {
  photo: Vacancy["photo"];
  matchScore: Vacancy["matchScore"];
  type: Vacancy["type"];
}

export const VacancyPhoto: React.FC<VacancyPhotoProps> = ({
  photo,
  matchScore,
}) => {
  const backgroundStyle = photo.url
    ? { backgroundImage: `url(${photo.url})` }
    : { background: photo.gradient };

  return (
    <div className="relative h-44 bg-cover bg-center" style={backgroundStyle}>
      <MatchScoreBadge matchScore={matchScore} />
    </div>
  );
};

export default VacancyPhoto;
