import React from "react";
import { PreferenceValue } from "../../types/createListing";
import ListingOptionPill from "../ListingOptionPill";

interface ListingPreferenceQuestionProps {
  label: string;
  selectedValue: PreferenceValue;
  onSelect: (value: PreferenceValue) => void;
  options?: Array<{ label: string; value: PreferenceValue }>;
  showIndifferent?: boolean;
}

export const ListingPreferenceQuestion: React.FC<
  ListingPreferenceQuestionProps
> = ({ label, selectedValue, onSelect, options, showIndifferent = false }) => {
  const defaultOptions = [
    { label: "Sim", value: "YES" as PreferenceValue },
    { label: "Não", value: "no" as PreferenceValue },
    ...(showIndifferent
      ? [{ label: "Indiferente", value: "indifferent" as PreferenceValue }]
      : []),
  ];

  const optionsToUse = options || defaultOptions;

  return (
    <div className="preference-question">
      <label
        className="
        mb-4 block text-lg font-semibold text-gray-800
      "
      >
        {label}
      </label>
      <div className="flex flex-wrap gap-4">
        {optionsToUse.map((option) => (
          <ListingOptionPill
            key={option.value}
            label={option.label}
            value={option.value}
            selectedValue={selectedValue}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default ListingPreferenceQuestion;
