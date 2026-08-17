import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../Button/Button";

interface MatchNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  vacancyTitle?: string;
  vacancyPrice?: string;
  vacancyLocation?: string;
  matchId?: number;
  onViewMatch?: () => void;
}

export const MatchNotification: React.FC<MatchNotificationProps> = ({
  isOpen,
  onClose,
  onViewMatch,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Aguarda animação de saída
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-md transform rounded-2xl bg-white p-8 shadow-2xl transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ícone de celebração */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600">
            <i className="fas fa-heart text-5xl text-white animate-pulse"></i>
          </div>
        </div>

        {/* Título */}
        <h2 className="mb-3 text-center text-3xl font-bold text-gray-800">
          É um Match! 🎉
        </h2>

        {/* Descrição */}
        <p className="mb-6 text-center text-gray-600">
          Vocês demonstraram interesse mútuo e agora podem conversar para
          acertar os detalhes.
        </p>

        {/* Botões de ação */}
        <div className="flex gap-3">
          <Button onClick={handleClose} variant="primary" className="flex-1">
            Continuar Explorando
          </Button>
          {onViewMatch && (
            <Button
              onClick={() => {
                onViewMatch();
                handleClose();
              }}
              variant="accent"
              className="flex-1"
            >
              Ver Matches
            </Button>
          )}
        </div>

        {/* Botão de fechar */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Fechar"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default MatchNotification;
