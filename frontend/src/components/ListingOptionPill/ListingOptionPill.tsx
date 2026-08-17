import React from "react";
import { PreferenceValue } from "../../types/createListing";

interface OptionPillProps {
  label: string;
  value: PreferenceValue;
  selectedValue: PreferenceValue;
  onSelect: (value: PreferenceValue) => void;
}

export const OptionPill: React.FC<OptionPillProps> = ({
  label,
  value,
  selectedValue,
  onSelect,
}) => {
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`
        cursor-pointer rounded-full border-2 px-5 py-2.5
        font-medium transition-all duration-200
        ${
          isSelected
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600"
        }
      `}
    >
      {label}
    </button>
  );
};

export default OptionPill;
