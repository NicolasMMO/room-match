import React from "react";

interface OptionPillProps {
  label: string;
  value: string;
  isSelected: boolean;
  onClick: (value: string) => void;
}

const OptionPill: React.FC<OptionPillProps> = ({
  label,
  value,
  isSelected,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`
        hover:border-accent-500 cursor-pointer rounded-full border-2 px-6 py-3 font-medium transition-all duration-200
        ease-in-out hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50
        ${
          isSelected
            ? "border-primary-500 bg-primary-500 font-semibold text-white"
            : "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
        }
      `}
      onClick={() => onClick(value)}
    >
      {label}
    </button>
  );
};

export default OptionPill;
