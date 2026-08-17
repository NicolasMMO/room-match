import React, { useState } from "react";
import Button from "../components/Button/Button";
import { Layout } from "../components/Layout/Layout";
import MatchNotification from "../components/MatchNotification";
import { Toast } from "../components/Toast/Toast";
import VacancyCard from "../components/VacancyCard";
import { useVacancies } from "../hooks/useVacancies";
import { LikeResponse } from "../types/match";

export const VacanciesPage: React.FC = () => {
  const {
    vacancies,
    isLoading,
    error,
    handleDismiss,
    handleInterest,
    refreshVacancies,
  } = useVacancies();

  const [matchNotification, setMatchNotification] = useState<{
    isOpen: boolean;
    vacancy?: any;
    matchId?: number;
  }>({
    isOpen: false,
  });

  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isVisible: false,
    message: "",
    type: "success",
  });

  const handleInterestWithNotification = async (vacancyId: string) => {
    const result: LikeResponse | null = await handleInterest(vacancyId);

    if (result) {
      if (result.matched) {
        const vacancy = vacancies.find((v) => v.id === vacancyId);
        setMatchNotification({
          isOpen: true,
          vacancy,
          matchId: result.match_id ?? undefined,
        });
      } else {
        // Like registrado mas sem match ainda
        setToast({
          isVisible: true,
          message: "Interesse registrado!",
          type: "success",
        });
      }
    } else {
      // Erro ao registrar like
      setToast({
        isVisible: true,
        message: "Erro ao registrar interesse. Tente novamente.",
        type: "error",
      });
    }
  };

  const closeMatchNotification = () => {
    setMatchNotification({ isOpen: false });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-96 flex items-center justify-center">
          <div className="text-lg text-blue-600">Carregando vagas...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-96 flex flex-col items-center justify-center gap-4">
          <div className="text-lg text-red-600">Erro: {error}</div>
          <Button
            onClick={refreshVacancies}
            variant="primary"
            className="px-4 py-2"
          >
            Tentar Novamente
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h2 className="mb-8 text-2xl font-bold text-gray-800">
          Encontre seu próximo lar
        </h2>

        {vacancies.length === 0 ? (
          <div className="min-h-96 flex flex-col items-center justify-center gap-4">
            <div className="text-lg text-gray-600">Nenhuma vaga disponível</div>
            <Button
              onClick={refreshVacancies}
              variant="primary"
              className="px-4 py-2"
            >
              Recarregar Vagas
            </Button>
          </div>
        ) : (
          <div
            className="
            auto-fill grid
            grid-cols-1
            gap-6
            [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]
            sm:grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-3
          "
          >
            {vacancies.map((vacancy) => (
              <VacancyCard
                key={vacancy.id}
                vacancy={vacancy}
                onDismiss={handleDismiss}
                onInterest={handleInterestWithNotification}
              />
            ))}
          </div>
        )}
      </div>

      {/* Notificação de Match */}
      <MatchNotification
        isOpen={matchNotification.isOpen}
        onClose={closeMatchNotification}
        vacancyTitle={matchNotification.vacancy?.title}
        vacancyPrice={matchNotification.vacancy?.price}
        vacancyLocation={matchNotification.vacancy?.location}
        matchId={matchNotification.matchId}
        onViewMatch={() => {
          // Aqui pode redirecionar para a página de matches
          window.location.href = "/matches";
        }}
      />

      {/* Toast de Feedback */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
        duration={3000}
      />
    </Layout>
  );
};

export default VacanciesPage;
