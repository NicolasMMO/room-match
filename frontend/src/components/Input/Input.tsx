import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: boolean;
}

const Input: React.FC<InputProps> = ({ className = "", error, ...props }) => {
  const errorClass = error ? "error" : "";

  return <input className={`${errorClass} ${className}`} {...props} />;
};

export default Input;
