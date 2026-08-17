import React from "react";
import { OptionPill } from "../OptionPill";

interface PreferenceOption {
  label: string;
  value: string;
}

interface PreferenceQuestionProps {
  question: string;
  options: PreferenceOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}

const PreferenceQuestion: React.FC<PreferenceQuestionProps> = ({
  question,
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <div className="mb-9">
      <label className="mb-4 block text-lg font-semibold text-gray-800">
        {question}
      </label>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <OptionPill
            key={option.value}
            label={option.label}
            value={option.value}
            isSelected={selectedValue === option.value}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default PreferenceQuestion;
