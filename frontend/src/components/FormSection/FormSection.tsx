import React from "react";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
}) => {
  return (
    <>
      <h4
        className="
        mb-6 mt-10 border-b-2 border-gray-200
        pb-2.5 text-xl font-semibold text-blue-600
      "
      >
        {title}
      </h4>
      {children}
    </>
  );
};

export default FormSection;
