import React, { useEffect } from "react";
import "./Toast.css";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    const icons = {
      success: "✓",
      error: "✕",
      info: "ℹ",
    };
    return icons[type];
  };

  return (
    <div className="toast-container">
      <div className={`toast ${type} ${isVisible ? "visible" : ""}`}>
        <div className="toast-content">
          <div className={`toast-icon ${type}`}>{getIcon()}</div>
          <div className="toast-message">{message}</div>
          <button onClick={onClose} className="toast-close" aria-label="Fechar">
            ×
          </button>
        </div>
      </div>
    </div>
  );
};
