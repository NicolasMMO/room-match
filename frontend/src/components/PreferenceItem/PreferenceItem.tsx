import React from "react";

interface PreferenceItemProps {
  icon: string;
  label: string;
  value: string;
}

const PreferenceItem: React.FC<PreferenceItemProps> = ({
  icon,
  label,
  value,
}) => {
  return (
    <li className="flex items-center text-base">
      <i className={`${icon} text-accent-500 mr-3 w-6 text-center text-xl`} />
      <span>
        <strong>{label}</strong>: {value}
      </span>
    </li>
  );
};

export default PreferenceItem;
