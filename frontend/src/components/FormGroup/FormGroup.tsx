import React from "react";

interface FormGroupProps {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
  error?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({
  label,
  htmlFor,
  children,
  className = "",
  error,
}) => {
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FormGroup;
