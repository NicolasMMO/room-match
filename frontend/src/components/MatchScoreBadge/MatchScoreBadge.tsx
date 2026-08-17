import React from "react";
import { PersonMatchScore } from "../../types/person";
import { MatchScore } from "../../types/vacancy";

interface MatchScoreBadgeProps {
  matchScore: MatchScore | PersonMatchScore;
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({
  matchScore,
}) => {
  const getScoreStyles = () => {
    switch (matchScore.level) {
      case "high":
        return "bg-green-500 text-white";
      case "medium":
        return "bg-yellow-400 text-gray-800";
      case "low":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <span
      className={`
      absolute right-4 top-4 flex items-center gap-1.5 rounded-full px-3
      py-1.5 text-sm font-semibold ${getScoreStyles()}
    `}
    >
      <i className={matchScore.icon}></i>
      {matchScore.percentage}%
    </span>
  );
};

export default MatchScoreBadge;
