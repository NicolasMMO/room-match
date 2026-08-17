import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button/Button";
import { Layout } from "../components/Layout/Layout";
import matchService from "../services/matchService";
import { vacancyService } from "../services/vacancyService";
import { MatchWithDetails } from "../types/match";
import { generateSlug } from "../utils/slugUtils";

export const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<MatchWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasVacancy, setHasVacancy] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("Usuário não autenticado");
        return;
      }

      const userIdNum = parseInt(userId, 10);
      setCurrentUserId(userIdNum);

      // Verifica se o usuário tem vaga
      let userVacancies = null;
      try {
        userVacancies = await vacancyService.getVacanciesByUser(userIdNum);
        setHasVacancy(userVacancies && userVacancies.length > 0);
      } catch (e) {
        console.warn("Erro ao verificar vagas:", e);
      }

      // Busca matches do usuário (quando demonstrou interesse em vagas)
      let allMatches: MatchWithDetails[] = [];

      try {
        const userMatchesResponse =
          await matchService.getUserMatches(userIdNum);
        allMatches = [...userMatchesResponse.matches];
      } catch (e) {
        console.warn("Erro ao buscar matches do usuário:", e);
      }

      // Se o usuário tem vaga, também busca matches da vaga (quando a vaga demonstrou interesse em candidatos)
      if (userVacancies && userVacancies.length > 0) {
        try {
          const firstVacancyId = userVacancies[0].id;
          const vacancyMatchesResponse =
            await matchService.getVacancyMatches(firstVacancyId);
          allMatches = [...allMatches, ...vacancyMatchesResponse.matches];
        } catch (e) {
          console.warn("Erro ao buscar matches da vaga:", e);
        }
      }

      setMatches(allMatches);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar matches");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-96 flex items-center justify-center">
          <div className="text-lg text-blue-600">Carregando matches...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-96 flex flex-col items-center justify-center gap-4">
          <div className="text-lg text-red-600">Erro: {error}</div>
          <Button onClick={loadMatches} variant="primary" className="px-4 py-2">
            Tentar Novamente
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Meus Matches</h2>
          <div className="flex items-center gap-2 text-accent-600">
            <i className="fas fa-heart"></i>
            <span className="font-semibold">{matches.length} matches</span>
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="min-h-96 flex flex-col items-center justify-center gap-4">
            <div className="text-center">
              <div className="mb-4 text-6xl text-gray-300">
                <i className="fas fa-heart-broken"></i>
              </div>
              <p className="mb-2 text-xl font-semibold text-gray-700">
                Nenhum match ainda
              </p>
              <p className="mb-6 text-gray-600">
                {hasVacancy
                  ? "Continue explorando candidatos e demonstrando interesse!"
                  : "Continue explorando vagas e demonstrando interesse!"}
              </p>
              <Link to={hasVacancy ? "/people" : "/vacancies"}>
                <Button variant="accent" className="px-6 py-3">
                  {hasVacancy ? "Explorar Candidatos" : "Explorar Vagas"}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => {
              // Para cada match, verifica quem é o "outro lado"
              // Se o match.user_id é o usuário logado → mostrar a VAGA
              // Se o match.user_id NÃO é o usuário logado → mostrar o USUÁRIO (candidato)
              const isUserMatch = match.user_id === currentUserId;

              const displayTitle = isUserMatch
                ? match.vacancy?.title || "Vaga"
                : match.user?.name || "Candidato";

              const displaySubtitle = isUserMatch
                ? match.vacancy?.address_neighborhood || ""
                : match.user?.email || "";

              const displayPrice =
                isUserMatch && match.vacancy?.rent
                  ? `R$ ${match.vacancy.rent}`
                  : null;

              const displayIcon = isUserMatch ? "fa-home" : "fa-user";

              return (
                <div
                  key={match.id}
                  className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  {/* Imagem/Avatar */}
                  <div className="h-48 bg-gradient-to-br from-accent-400 to-accent-600">
                    <div className="flex h-full items-center justify-center text-white">
                      <i
                        className={`fas ${displayIcon} text-6xl opacity-50`}
                      ></i>
                    </div>
                  </div>

                  {/* Informações */}
                  <div className="p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <i className="fas fa-heart text-accent-500"></i>
                      <span className="text-xs font-semibold uppercase tracking-wide text-accent-600">
                        Match
                      </span>
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-gray-800">
                      {displayTitle}
                    </h3>

                    <div className="mb-4 space-y-2 text-sm text-gray-600">
                      {displaySubtitle && (
                        <p className="flex items-center gap-2">
                          <i
                            className={`fas ${isUserMatch ? "fa-map-marker-alt" : "fa-envelope"} text-accent-500`}
                          ></i>
                          {displaySubtitle}
                        </p>
                      )}
                      {displayPrice && (
                        <p className="flex items-center gap-2">
                          <i className="fas fa-dollar-sign text-accent-500"></i>
                          {displayPrice}
                        </p>
                      )}
                      {match.vacancy && isUserMatch && (
                        <p className="flex items-center gap-2 text-xs">
                          <i className="fas fa-bed text-accent-500"></i>
                          {match.vacancy.available_spots} vaga(s) de{" "}
                          {match.vacancy.total_rooms} quarto(s)
                        </p>
                      )}
                      <p className="flex items-center gap-2 text-xs text-gray-500">
                        <i className="fas fa-clock"></i>
                        Match em{" "}
                        {new Date(match.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex gap-2">
                      {isUserMatch && match.vacancy && (
                        <Link
                          to={`/vacancy/${generateSlug(match.vacancy.title)}`}
                          state={{ id: match.vacancy_id }}
                          className="flex-1"
                        >
                          <Button variant="primary" className="w-full text-sm">
                            Ver Vaga
                          </Button>
                        </Link>
                      )}
                      {!isUserMatch && match.user && (
                        <Link
                          to={`/user/${generateSlug(match.user.name)}`}
                          state={{ id: match.user_id }}
                          className="flex-1"
                        >
                          <Button variant="primary" className="w-full text-sm">
                            Ver Perfil
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="accent"
                        className="flex-1 text-sm"
                        onClick={() => {
                          alert("Funcionalidade de chat em desenvolvimento");
                        }}
                      >
                        <i className="fas fa-comment mr-1"></i>
                        Conversar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MatchesPage;
