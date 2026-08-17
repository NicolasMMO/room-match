import React from "react";

interface FormGridProps {
  children: React.ReactNode;
}

export const FormGrid: React.FC<FormGridProps> = ({ children }) => {
  return (
    <div
      className="
      grid grid-cols-1
      gap-6
      [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]
      sm:grid-cols-1
      md:grid-cols-2
      lg:grid-cols-3
    "
    >
      {children}
    </div>
  );
};

export default FormGrid;
