import React from "react";
import { Vacancy } from "../../types/vacancy";

interface VacancyInfoProps {
  title: Vacancy["title"];
  location: Vacancy["location"];
  price: Vacancy["price"];
}

export const VacancyInfo: React.FC<VacancyInfoProps> = ({
  title,
  location,
  price,
}) => {
  return (
    <div className="flex-grow p-5">
      <h3 className="m-0 mb-1 text-xl font-semibold text-blue-600">{title}</h3>
      <p className="mb-2 text-sm text-gray-600">{location}</p>
      <p className="my-2.5 text-lg font-bold text-orange-500">{price}</p>
    </div>
  );
};

export default VacancyInfo;
