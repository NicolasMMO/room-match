import React from "react";
import { Link } from "react-router-dom";
import { generateSlug } from "../../utils/slugUtils";

interface PersonInfoProps {
  name: string;
  occupation: string;
  bio: string;
  id: number;
}

export const PersonInfo: React.FC<PersonInfoProps> = ({
  name,
  occupation,
  bio,
  id,
}) => {
  return (
    <Link to={`/user/${generateSlug(name)}`} state={{ id }} className="text-inherit no-underline">
      <h4 className="m-0 mb-1 text-xl font-semibold text-blue-600">{name.split(' ')[0]}</h4>
      <p className="mb-4 text-sm text-gray-600">{occupation}</p>
      <p className="mb-5 flex-grow text-sm leading-relaxed text-gray-700">
        {bio}
      </p>
    </Link>
  );
};

export default PersonInfo;
