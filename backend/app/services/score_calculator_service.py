from typing import Dict, List, Optional, Set, Tuple

from app.enums import DefaultPreference, PreferenceResponse
from app.repositories.user_preferences_repository import UserPreferencesRepository
from app.repositories.vacancy_preferences_repository import VacancyPreferencesRepository


class ScoreCalculatorService:
    """
    Serviço responsável por calcular o score de compatibilidade
    entre usuários e vagas baseado em suas preferências.

    Utiliza mapeamento semântico para comparar preferências de usuário
    com suas correspondentes preferências de vaga.
    """

    # Mapeamento semântico: título da preferência do usuário -> título da preferência da vaga
    # Usa os enums DefaultPreference para facilitar manutenção
    USER_TO_VACANCY_PREFERENCE_MAP: Dict[str, str] = {
        # Características do usuário → Aceitação da vaga
        DefaultPreference.SMOKER.title: DefaultPreference.VACANCY_ACCEPTS_SMOKER.title,
        DefaultPreference.HAS_PETS.title: DefaultPreference.VACANCY_ACCEPTS_PETS.title,
        DefaultPreference.LIKES_PARTIES.title: DefaultPreference.ALLOWS_PARTIES.title,
        DefaultPreference.WORKS_FROM_HOME.title: DefaultPreference.HOME_OFFICE_FRIENDLY.title,
        DefaultPreference.STUDENT.title: DefaultPreference.VACANCY_ACCEPTS_STUDENTS.title,
        DefaultPreference.HAS_CAR.title: DefaultPreference.HAS_PARKING.title,
        # Aceitação do usuário → Aceitação da vaga (deve ser igual)
        DefaultPreference.USER_ACCEPTS_SMOKER.title: DefaultPreference.VACANCY_ACCEPTS_SMOKER.title,
        DefaultPreference.USER_ACCEPTS_PETS.title: DefaultPreference.VACANCY_ACCEPTS_PETS.title,
    }

    # Preferências com comparação inversa
    # (YES do usuário + YES da vaga = incompatível)
    INVERSE_COMPARISON_PREFERENCES: Set[str] = {
        # Músico + Ambiente silencioso = incompatível
        DefaultPreference.PLAYS_MUSIC.title,
    }

    # Mapeamento para preferências inversas
    INVERSE_USER_TO_VACANCY_MAP: Dict[str, str] = {
        DefaultPreference.PLAYS_MUSIC.title: DefaultPreference.QUIET_ENVIRONMENT.title,
    }

    # Matriz de compatibilidade: (user_rate, vacancy_rate) -> score
    COMPATIBILITY_MATRIX: Dict[Tuple[PreferenceResponse, PreferenceResponse], float] = {
        # Compatibilidade total (100%)
        (PreferenceResponse.YES, PreferenceResponse.YES): 1.0,
        (PreferenceResponse.NO, PreferenceResponse.NO): 1.0,
        # Incompatibilidade total (0%)
        (PreferenceResponse.YES, PreferenceResponse.NO): 0.0,
        (PreferenceResponse.NO, PreferenceResponse.YES): 0.0,
        # Compatibilidade parcial com INDIFFERENT (75%)
        (PreferenceResponse.YES, PreferenceResponse.INDIFFERENT): 0.75,
        (PreferenceResponse.NO, PreferenceResponse.INDIFFERENT): 0.75,
        (PreferenceResponse.INDIFFERENT, PreferenceResponse.YES): 0.75,
        (PreferenceResponse.INDIFFERENT, PreferenceResponse.NO): 0.75,
        # Ambos indiferentes (50%)
        (PreferenceResponse.INDIFFERENT, PreferenceResponse.INDIFFERENT): 0.5,
    }

    # Matriz de compatibilidade INVERSA (para preferências como músico vs silêncio)
    INVERSE_COMPATIBILITY_MATRIX: Dict[Tuple[PreferenceResponse, PreferenceResponse], float] = {
        # Músico (YES) + Ambiente silencioso (YES) = incompatível
        (PreferenceResponse.YES, PreferenceResponse.YES): 0.0,
        # Músico (YES) + Não precisa silêncio (NO) = compatível
        (PreferenceResponse.YES, PreferenceResponse.NO): 1.0,
        # Não músico (NO) + Ambiente silencioso (YES) = compatível
        (PreferenceResponse.NO, PreferenceResponse.YES): 1.0,
        # Não músico (NO) + Não precisa silêncio (NO) = compatível
        (PreferenceResponse.NO, PreferenceResponse.NO): 1.0,
        # INDIFFERENT mantém lógica parcial
        (PreferenceResponse.YES, PreferenceResponse.INDIFFERENT): 0.75,
        (PreferenceResponse.NO, PreferenceResponse.INDIFFERENT): 0.75,
        (PreferenceResponse.INDIFFERENT, PreferenceResponse.YES): 0.75,
        (PreferenceResponse.INDIFFERENT, PreferenceResponse.NO): 0.75,
        (PreferenceResponse.INDIFFERENT, PreferenceResponse.INDIFFERENT): 0.5,
    }

    # Thresholds para classificação de nível
    HIGH_THRESHOLD = 70
    MEDIUM_THRESHOLD = 40

    def __init__(
        self,
        user_preferences_repository: UserPreferencesRepository,
        vacancy_preferences_repository: VacancyPreferencesRepository,
    ):
        self.user_preferences_repository = user_preferences_repository
        self.vacancy_preferences_repository = vacancy_preferences_repository

    def calculate_user_vacancy_score(
        self, user_id: int, vacancy_id: int, include_details: bool = False
    ) -> Dict:
        """
        Calcula o score de compatibilidade entre um usuário e uma vaga.

        Args:
            user_id: ID do usuário
            vacancy_id: ID da vaga
            include_details: Se True, inclui breakdown do cálculo

        Returns:
            Dict com percentage, level e opcionalmente details
        """
        user_prefs = self.user_preferences_repository.get_user_preferences_with_details(
            user_id
        )
        vacancy_prefs = (
            self.vacancy_preferences_repository.get_vacancy_preferences_with_details(
                vacancy_id
            )
        )

        # Caso sem preferências cadastradas
        if not user_prefs or not vacancy_prefs:
            return self._create_score_result(
                50,
                include_details,
                {
                    "reason": "Preferências insuficientes para cálculo preciso",
                    "user_preferences_count": len(user_prefs) if user_prefs else 0,
                    "vacancy_preferences_count": (
                        len(vacancy_prefs) if vacancy_prefs else 0
                    ),
                },
            )

        # Criar mapa de preferências da vaga por TÍTULO para lookup semântico
        vacancy_map: Dict[str, PreferenceResponse] = {
            pref["title"]: pref["rate"] for pref in vacancy_prefs
        }

        total_score = 0.0
        comparisons = 0
        matches = 0
        partial_matches = 0
        incompatibilities = 0
        comparison_details = []

        # Comparar cada preferência do usuário com a correspondente da vaga
        for user_pref in user_prefs:
            user_title = user_pref["title"]
            user_rate = user_pref["rate"]

            # Verificar se é uma preferência com comparação inversa
            if user_title in self.INVERSE_COMPARISON_PREFERENCES:
                vacancy_title = self.INVERSE_USER_TO_VACANCY_MAP.get(
                    user_title)
                if vacancy_title and vacancy_title in vacancy_map:
                    vacancy_rate = vacancy_map[vacancy_title]
                    score = self._get_inverse_compatibility_score(
                        user_rate, vacancy_rate)
                    total_score += score
                    comparisons += 1

                    if include_details:
                        comparison_details.append({
                            "user_preference": user_title,
                            "vacancy_preference": vacancy_title,
                            "user_rate": user_rate.value,
                            "vacancy_rate": vacancy_rate.value,
                            "score": score,
                            "inverse": True,
                        })

                    if score == 1.0:
                        matches += 1
                    elif score >= 0.5:
                        partial_matches += 1
                    else:
                        incompatibilities += 1

            # Verificar mapeamento semântico normal
            elif user_title in self.USER_TO_VACANCY_PREFERENCE_MAP:
                vacancy_title = self.USER_TO_VACANCY_PREFERENCE_MAP[user_title]
                if vacancy_title in vacancy_map:
                    vacancy_rate = vacancy_map[vacancy_title]
                    score = self._get_compatibility_score(
                        user_rate, vacancy_rate)
                    total_score += score
                    comparisons += 1

                    if include_details:
                        comparison_details.append({
                            "user_preference": user_title,
                            "vacancy_preference": vacancy_title,
                            "user_rate": user_rate.value,
                            "vacancy_rate": vacancy_rate.value,
                            "score": score,
                            "inverse": False,
                        })

                    if score == 1.0:
                        matches += 1
                    elif score >= 0.5:
                        partial_matches += 1
                    else:
                        incompatibilities += 1

        # Caso sem preferências em comum
        if comparisons == 0:
            return self._create_score_result(
                50,
                include_details,
                {
                    "reason": "Nenhuma preferência em comum para comparar",
                    "user_preferences_count": len(user_prefs),
                    "vacancy_preferences_count": len(vacancy_prefs),
                },
            )

        # Calcular porcentagem final
        percentage = int((total_score / comparisons) * 100)

        details = (
            {
                "total_preferences_compared": comparisons,
                "matches": matches,
                "partial_matches": partial_matches,
                "incompatibilities": incompatibilities,
                "comparisons": comparison_details,
            }
            if include_details
            else None
        )

        return self._create_score_result(percentage, include_details, details)

    def calculate_vacancy_user_score(
        self, vacancy_id: int, user_id: int, include_details: bool = False
    ) -> Dict:
        """
        Calcula o score do ponto de vista da vaga (quanto o usuário atende).
        Por enquanto usa a mesma lógica, mas pode ser customizada no futuro.
        """
        return self.calculate_user_vacancy_score(user_id, vacancy_id, include_details)

    def calculate_scores_batch(self, user_id: int, vacancy_ids: List[int]) -> List[Dict]:
        """
        Calcula scores para múltiplas vagas de uma vez.
        Otimizado para evitar múltiplas queries das preferências do usuário.

        Args:
            user_id: ID do usuário
            vacancy_ids: Lista de IDs das vagas

        Returns:
            Lista de dicts com vacancy_id, percentage e level
        """
        # Buscar preferências do usuário uma única vez
        user_prefs = self.user_preferences_repository.get_user_preferences_with_details(
            user_id
        )

        results = []

        for vacancy_id in vacancy_ids:
            vacancy_prefs = (
                self.vacancy_preferences_repository.get_vacancy_preferences_with_details(
                    vacancy_id
                )
            )

            score = self._calculate_score_from_prefs(user_prefs, vacancy_prefs)

            results.append(
                {
                    "vacancy_id": vacancy_id,
                    "percentage": score["percentage"],
                    "level": score["level"],
                }
            )

        return results

    def calculate_users_scores_for_vacancy(
        self, vacancy_id: int, user_ids: List[int]
    ) -> List[Dict]:
        """
        Calcula scores para múltiplos usuários em relação a uma vaga.

        Args:
            vacancy_id: ID da vaga
            user_ids: Lista de IDs dos usuários

        Returns:
            Lista de dicts com user_id, percentage e level
        """
        # Buscar preferências da vaga uma única vez
        vacancy_prefs = (
            self.vacancy_preferences_repository.get_vacancy_preferences_with_details(
                vacancy_id
            )
        )

        results = []

        for user_id in user_ids:
            user_prefs = (
                self.user_preferences_repository.get_user_preferences_with_details(
                    user_id
                )
            )

            score = self._calculate_score_from_prefs(user_prefs, vacancy_prefs)

            results.append(
                {
                    "user_id": user_id,
                    "percentage": score["percentage"],
                    "level": score["level"],
                }
            )

        return results

    def _calculate_score_from_prefs(
        self, user_prefs: List[Dict], vacancy_prefs: List[Dict]
    ) -> Dict:
        """
        Calcula score a partir de listas de preferências já carregadas.
        Método interno para otimização de batch.
        Usa mapeamento semântico por título.
        """
        if not user_prefs or not vacancy_prefs:
            return {"percentage": 50, "level": "medium"}

        # Criar mapa por TÍTULO para lookup semântico
        vacancy_map = {pref["title"]: pref["rate"] for pref in vacancy_prefs}

        total_score = 0.0
        comparisons = 0

        for user_pref in user_prefs:
            user_title = user_pref["title"]
            user_rate = user_pref["rate"]

            # Verificar preferências inversas
            if user_title in self.INVERSE_COMPARISON_PREFERENCES:
                vacancy_title = self.INVERSE_USER_TO_VACANCY_MAP.get(
                    user_title)
                if vacancy_title and vacancy_title in vacancy_map:
                    vacancy_rate = vacancy_map[vacancy_title]
                    score = self._get_inverse_compatibility_score(
                        user_rate, vacancy_rate)
                    total_score += score
                    comparisons += 1

            # Verificar mapeamento semântico normal
            elif user_title in self.USER_TO_VACANCY_PREFERENCE_MAP:
                vacancy_title = self.USER_TO_VACANCY_PREFERENCE_MAP[user_title]
                if vacancy_title in vacancy_map:
                    vacancy_rate = vacancy_map[vacancy_title]
                    score = self._get_compatibility_score(
                        user_rate, vacancy_rate)
                    total_score += score
                    comparisons += 1

        if comparisons == 0:
            return {"percentage": 50, "level": "medium"}

        percentage = int((total_score / comparisons) * 100)
        level = self._classify_score_level(percentage)

        return {"percentage": percentage, "level": level}

    def _get_compatibility_score(
        self, user_rate: PreferenceResponse, vacancy_rate: PreferenceResponse
    ) -> float:
        """
        Retorna o score de compatibilidade entre duas respostas de preferência.
        """
        return self.COMPATIBILITY_MATRIX.get((user_rate, vacancy_rate), 0.5)

    def _get_inverse_compatibility_score(
        self, user_rate: PreferenceResponse, vacancy_rate: PreferenceResponse
    ) -> float:
        """
        Retorna o score de compatibilidade INVERSA.
        Usado para preferências onde YES do usuário + YES da vaga = incompatível.
        Exemplo: Músico (YES) + Ambiente silencioso (YES) = 0%
        """
        return self.INVERSE_COMPATIBILITY_MATRIX.get((user_rate, vacancy_rate), 0.5)

    def _classify_score_level(self, percentage: int) -> str:
        """
        Classifica o score em um nível semântico.
        """
        if percentage >= self.HIGH_THRESHOLD:
            return "high"
        elif percentage >= self.MEDIUM_THRESHOLD:
            return "medium"
        else:
            return "low"

    def _create_score_result(
        self, percentage: int, include_details: bool, details: Optional[Dict]
    ) -> Dict:
        """
        Cria o objeto de resultado do score.
        """
        result = {
            "percentage": percentage,
            "level": self._classify_score_level(percentage),
        }

        if include_details and details:
            result["details"] = details

        return result
