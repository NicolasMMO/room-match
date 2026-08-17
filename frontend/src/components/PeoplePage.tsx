import React, { useState } from "react";
import Button from "../components/Button/Button";
import { Layout } from "../components/Layout/Layout";
import MatchNotification from "../components/MatchNotification";
import PersonCard from "../components/PersonCard";
import { Toast } from "../components/Toast/Toast";
import { usePeople } from "../hooks/usePeople";
import { LikeResponse } from "../types/match";

export const PeoplePage: React.FC = () => {
  const {
    people,
    vacancy,
    isLoading,
    error,
    handleDismiss,
    handleInterest,
    refreshPeople,
  } = usePeople();

  const [matchNotification, setMatchNotification] = useState<{
    isOpen: boolean;
    person?: any;
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

  const handleInterestWithNotification = async (
    personId: number,
  ): Promise<LikeResponse | null> => {
    const result: LikeResponse | null = await handleInterest(personId);

    if (result) {
      if (result.matched) {
        const person = people.find((p) => p.id === personId);
        setMatchNotification({
          isOpen: true,
          person,
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

    return result;
  };

  const closeMatchNotification = () => {
    setMatchNotification({ isOpen: false });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-96 flex items-center justify-center">
          <div className="text-lg text-blue-600">Carregando candidatos...</div>
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
            onClick={refreshPeople}
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
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Possíveis Candidatos
          </h2>
          <p className="font-medium text-gray-600">
            Na sua vaga:{" "}
            <span className="text-orange-500">"{vacancy.title}"</span>
          </p>
        </div>

        {people.length === 0 ? (
          <div className="min-h-96 flex flex-col items-center justify-center gap-4">
            <div className="text-lg text-gray-600">
              Nenhum candidato disponível
            </div>
            <Button
              onClick={refreshPeople}
              variant="primary"
              className="px-4 py-2"
            >
              Recarregar Candidatos
            </Button>
          </div>
        ) : (
          <div
            className="
            grid grid-cols-1
            gap-6
            [grid-template-columns:repeat(auto-fill,minmax(350px,1fr))]
            sm:grid-cols-1
            md:grid-cols-2
            lg:grid-cols-2
            xl:grid-cols-3
          "
          >
            {people.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
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
        vacancyTitle={matchNotification.person?.name}
        vacancyLocation={matchNotification.person?.occupation}
        matchId={matchNotification.matchId}
        onViewMatch={() => {
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

export default PeoplePage;
