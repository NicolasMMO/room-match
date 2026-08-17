"""
Testes unitários para o ScoreCalculatorService.
Utiliza mapeamento semântico por título de preferências (via DefaultPreference enum).
"""
import pytest
from unittest.mock import MagicMock

from app.enums import DefaultPreference, PreferenceResponse
from app.services.score_calculator_service import ScoreCalculatorService


class TestScoreCalculatorService:
    """Testes para o serviço de cálculo de score."""

    @pytest.fixture
    def mock_user_preferences_repository(self):
        return MagicMock()

    @pytest.fixture
    def mock_vacancy_preferences_repository(self):
        return MagicMock()

    @pytest.fixture
    def service(self, mock_user_preferences_repository, mock_vacancy_preferences_repository):
        return ScoreCalculatorService(
            user_preferences_repository=mock_user_preferences_repository,
            vacancy_preferences_repository=mock_vacancy_preferences_repository,
        )

    # ==================== Testes da Matriz de Compatibilidade ====================

    class TestCompatibilityMatrix:
        """Testes para verificar a matriz de compatibilidade."""

        @pytest.fixture
        def service(self):
            return ScoreCalculatorService(MagicMock(), MagicMock())

        def test_yes_yes_returns_full_compatibility(self, service):
            """YES + YES = 100% compatibilidade."""
            score = service._get_compatibility_score(
                PreferenceResponse.YES, PreferenceResponse.YES
            )
            assert score == 1.0

        def test_no_no_returns_full_compatibility(self, service):
            """NO + NO = 100% compatibilidade."""
            score = service._get_compatibility_score(
                PreferenceResponse.NO, PreferenceResponse.NO
            )
            assert score == 1.0

        def test_yes_no_returns_zero_compatibility(self, service):
            """YES + NO = 0% compatibilidade (incompatível)."""
            score = service._get_compatibility_score(
                PreferenceResponse.YES, PreferenceResponse.NO
            )
            assert score == 0.0

        def test_no_yes_returns_zero_compatibility(self, service):
            """NO + YES = 0% compatibilidade (incompatível)."""
            score = service._get_compatibility_score(
                PreferenceResponse.NO, PreferenceResponse.YES
            )
            assert score == 0.0

        def test_yes_indifferent_returns_partial_compatibility(self, service):
            """YES + INDIFFERENT = 75% compatibilidade."""
            score = service._get_compatibility_score(
                PreferenceResponse.YES, PreferenceResponse.INDIFFERENT
            )
            assert score == 0.75

        def test_no_indifferent_returns_partial_compatibility(self, service):
            """NO + INDIFFERENT = 75% compatibilidade."""
            score = service._get_compatibility_score(
                PreferenceResponse.NO, PreferenceResponse.INDIFFERENT
            )
            assert score == 0.75

        def test_indifferent_yes_returns_partial_compatibility(self, service):
            """INDIFFERENT + YES = 75% compatibilidade."""
            score = service._get_compatibility_score(
                PreferenceResponse.INDIFFERENT, PreferenceResponse.YES
            )
            assert score == 0.75

        def test_indifferent_no_returns_partial_compatibility(self, service):
            """INDIFFERENT + NO = 75% compatibilidade."""
            score = service._get_compatibility_score(
                PreferenceResponse.INDIFFERENT, PreferenceResponse.NO
            )
            assert score == 0.75

        def test_indifferent_indifferent_returns_neutral(self, service):
            """INDIFFERENT + INDIFFERENT = 50% compatibilidade."""
            score = service._get_compatibility_score(
                PreferenceResponse.INDIFFERENT, PreferenceResponse.INDIFFERENT
            )
            assert score == 0.5

    # ==================== Testes da Matriz de Compatibilidade INVERSA ====================

    class TestInverseCompatibilityMatrix:
        """Testes para verificar a matriz de compatibilidade inversa."""

        @pytest.fixture
        def service(self):
            return ScoreCalculatorService(MagicMock(), MagicMock())

        def test_yes_yes_returns_zero_compatibility(self, service):
            """Músico (YES) + Ambiente silencioso (YES) = 0% (incompatível)."""
            score = service._get_inverse_compatibility_score(
                PreferenceResponse.YES, PreferenceResponse.YES
            )
            assert score == 0.0

        def test_yes_no_returns_full_compatibility(self, service):
            """Músico (YES) + Não precisa silêncio (NO) = 100% (compatível)."""
            score = service._get_inverse_compatibility_score(
                PreferenceResponse.YES, PreferenceResponse.NO
            )
            assert score == 1.0

        def test_no_yes_returns_full_compatibility(self, service):
            """Não músico (NO) + Ambiente silencioso (YES) = 100% (compatível)."""
            score = service._get_inverse_compatibility_score(
                PreferenceResponse.NO, PreferenceResponse.YES
            )
            assert score == 1.0

        def test_no_no_returns_full_compatibility(self, service):
            """Não músico (NO) + Não precisa silêncio (NO) = 100% (compatível)."""
            score = service._get_inverse_compatibility_score(
                PreferenceResponse.NO, PreferenceResponse.NO
            )
            assert score == 1.0

    # ==================== Testes de Classificação de Nível ====================

    class TestScoreLevelClassification:
        """Testes para classificação de níveis de score."""

        @pytest.fixture
        def service(self):
            return ScoreCalculatorService(MagicMock(), MagicMock())

        def test_high_level_at_threshold(self, service):
            """Score >= 70 deve ser classificado como 'high'."""
            assert service._classify_score_level(70) == "high"
            assert service._classify_score_level(100) == "high"
            assert service._classify_score_level(85) == "high"

        def test_medium_level_range(self, service):
            """Score >= 40 e < 70 deve ser classificado como 'medium'."""
            assert service._classify_score_level(40) == "medium"
            assert service._classify_score_level(50) == "medium"
            assert service._classify_score_level(69) == "medium"

        def test_low_level_below_threshold(self, service):
            """Score < 40 deve ser classificado como 'low'."""
            assert service._classify_score_level(0) == "low"
            assert service._classify_score_level(20) == "low"
            assert service._classify_score_level(39) == "low"

    # ==================== Testes de Cálculo de Score com Mapeamento Semântico ====================

    class TestCalculateUserVacancyScoreSemantic:
        """Testes para cálculo de score usando mapeamento semântico por título."""

        @pytest.fixture
        def mock_user_repo(self):
            return MagicMock()

        @pytest.fixture
        def mock_vacancy_repo(self):
            return MagicMock()

        @pytest.fixture
        def service(self, mock_user_repo, mock_vacancy_repo):
            return ScoreCalculatorService(mock_user_repo, mock_vacancy_repo)

        def test_smoker_accepts_smoker_match(self, service, mock_user_repo, mock_vacancy_repo):
            """Fumante (YES) + Aceita fumante (YES) = 100%."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 1, "title": DefaultPreference.SMOKER.title,
                    "rate": PreferenceResponse.YES},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 10, "title": DefaultPreference.VACANCY_ACCEPTS_SMOKER.title,
                    "rate": PreferenceResponse.YES},
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            assert result["percentage"] == 100
            assert result["level"] == "high"

        def test_smoker_not_accepts_smoker_incompatible(self, service, mock_user_repo, mock_vacancy_repo):
            """Fumante (YES) + Não aceita fumante (NO) = 0%."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 1, "title": DefaultPreference.SMOKER.title,
                    "rate": PreferenceResponse.YES},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 10, "title": DefaultPreference.VACANCY_ACCEPTS_SMOKER.title,
                    "rate": PreferenceResponse.NO},
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            assert result["percentage"] == 0
            assert result["level"] == "low"

        def test_non_smoker_accepts_smoker_compatible(self, service, mock_user_repo, mock_vacancy_repo):
            """Não fumante (NO) + Aceita fumante (YES) = 0% (incompatível por matriz)."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 1, "title": DefaultPreference.SMOKER.title,
                    "rate": PreferenceResponse.NO},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 10, "title": DefaultPreference.VACANCY_ACCEPTS_SMOKER.title,
                    "rate": PreferenceResponse.YES},
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            # NO + YES = 0 na matriz normal
            assert result["percentage"] == 0
            assert result["level"] == "low"

        def test_has_pets_accepts_pets_match(self, service, mock_user_repo, mock_vacancy_repo):
            """Tem pets (YES) + Aceita pets (YES) = 100%."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 2, "title": DefaultPreference.HAS_PETS.title,
                    "rate": PreferenceResponse.YES},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 11, "title": DefaultPreference.VACANCY_ACCEPTS_PETS.title,
                    "rate": PreferenceResponse.YES},
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            assert result["percentage"] == 100
            assert result["level"] == "high"

        def test_multiple_preferences_mixed(self, service, mock_user_repo, mock_vacancy_repo):
            """Múltiplas preferências com resultados mistos."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 1, "title": DefaultPreference.SMOKER.title,
                    "rate": PreferenceResponse.YES},
                {"preference_id": 2, "title": DefaultPreference.HAS_PETS.title,
                    "rate": PreferenceResponse.YES},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 10, "title": DefaultPreference.VACANCY_ACCEPTS_SMOKER.title,
                    "rate": PreferenceResponse.YES},  # 100%
                {"preference_id": 11, "title": DefaultPreference.VACANCY_ACCEPTS_PETS.title,
                    "rate": PreferenceResponse.NO},  # 0%
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            # (100% + 0%) / 2 = 50%
            assert result["percentage"] == 50
            assert result["level"] == "medium"

        def test_musician_quiet_environment_inverse_incompatible(self, service, mock_user_repo, mock_vacancy_repo):
            """Toca instrumento (YES) + Ambiente silencioso (YES) = 0% (inversa)."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 5, "title": DefaultPreference.PLAYS_MUSIC.title,
                    "rate": PreferenceResponse.YES},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 15, "title": DefaultPreference.QUIET_ENVIRONMENT.title,
                    "rate": PreferenceResponse.YES},
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            assert result["percentage"] == 0
            assert result["level"] == "low"

        def test_musician_not_quiet_environment_inverse_compatible(self, service, mock_user_repo, mock_vacancy_repo):
            """Toca instrumento (YES) + Ambiente não silencioso (NO) = 100% (inversa)."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 5, "title": DefaultPreference.PLAYS_MUSIC.title,
                    "rate": PreferenceResponse.YES},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 15, "title": DefaultPreference.QUIET_ENVIRONMENT.title,
                    "rate": PreferenceResponse.NO},
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            assert result["percentage"] == 100
            assert result["level"] == "high"

        def test_non_musician_quiet_environment_inverse_compatible(self, service, mock_user_repo, mock_vacancy_repo):
            """Não toca instrumento (NO) + Ambiente silencioso (YES) = 100% (inversa)."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 5, "title": DefaultPreference.PLAYS_MUSIC.title,
                    "rate": PreferenceResponse.NO},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 15, "title": DefaultPreference.QUIET_ENVIRONMENT.title,
                    "rate": PreferenceResponse.YES},
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            assert result["percentage"] == 100
            assert result["level"] == "high"

        def test_no_user_preferences_returns_50_percent(self, service, mock_user_repo, mock_vacancy_repo):
            """Sem preferências do usuário deve retornar 50% (neutro)."""
            mock_user_repo.get_user_preferences_with_details.return_value = []
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 10, "title": DefaultPreference.VACANCY_ACCEPTS_SMOKER.title,
                    "rate": PreferenceResponse.YES},
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            assert result["percentage"] == 50
            assert result["level"] == "medium"

        def test_no_vacancy_preferences_returns_50_percent(self, service, mock_user_repo, mock_vacancy_repo):
            """Sem preferências da vaga deve retornar 50% (neutro)."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 1, "title": DefaultPreference.SMOKER.title,
                    "rate": PreferenceResponse.YES},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = []

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            assert result["percentage"] == 50
            assert result["level"] == "medium"

        def test_no_mapped_preferences_returns_50_percent(self, service, mock_user_repo, mock_vacancy_repo):
            """Preferências sem mapeamento devem retornar 50% (neutro)."""
            # Preferência de usuário que não tem par na vaga
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 99, "title": "Preferência não mapeada",
                    "rate": PreferenceResponse.YES},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 100, "title": "Outra preferência",
                    "rate": PreferenceResponse.YES},
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            assert result["percentage"] == 50
            assert result["level"] == "medium"

        def test_include_details_returns_comparison_breakdown(self, service, mock_user_repo, mock_vacancy_repo):
            """Com include_details=True deve retornar breakdown com comparações."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 1, "title": DefaultPreference.SMOKER.title,
                    "rate": PreferenceResponse.YES},
                {"preference_id": 2, "title": DefaultPreference.HAS_PETS.title,
                    "rate": PreferenceResponse.NO},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 10, "title": DefaultPreference.VACANCY_ACCEPTS_SMOKER.title,
                    "rate": PreferenceResponse.YES},
                {"preference_id": 11, "title": DefaultPreference.VACANCY_ACCEPTS_PETS.title,
                    "rate": PreferenceResponse.NO},
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1, include_details=True
            )

            assert "details" in result
            assert result["details"]["total_preferences_compared"] == 2
            assert result["details"]["matches"] == 2
            assert "comparisons" in result["details"]
            assert len(result["details"]["comparisons"]) == 2

    # ==================== Testes de Batch ====================

    class TestBatchCalculations:
        """Testes para cálculos em lote."""

        @pytest.fixture
        def mock_user_repo(self):
            return MagicMock()

        @pytest.fixture
        def mock_vacancy_repo(self):
            return MagicMock()

        @pytest.fixture
        def service(self, mock_user_repo, mock_vacancy_repo):
            return ScoreCalculatorService(mock_user_repo, mock_vacancy_repo)

        def test_batch_scores_for_multiple_vacancies(self, service, mock_user_repo, mock_vacancy_repo):
            """Batch deve calcular scores para múltiplas vagas."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 1, "title": DefaultPreference.SMOKER.title,
                    "rate": PreferenceResponse.YES},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.side_effect = [
                [{"preference_id": 10, "title": DefaultPreference.VACANCY_ACCEPTS_SMOKER.title,
                    "rate": PreferenceResponse.YES}],
                [{"preference_id": 10, "title": DefaultPreference.VACANCY_ACCEPTS_SMOKER.title,
                    "rate": PreferenceResponse.NO}],
                [{"preference_id": 10, "title": DefaultPreference.VACANCY_ACCEPTS_SMOKER.title,
                    "rate": PreferenceResponse.INDIFFERENT}],
            ]

            results = service.calculate_scores_batch(
                user_id=1, vacancy_ids=[1, 2, 3])

            assert len(results) == 3
            assert results[0]["vacancy_id"] == 1
            assert results[0]["percentage"] == 100
            assert results[1]["vacancy_id"] == 2
            assert results[1]["percentage"] == 0
            assert results[2]["vacancy_id"] == 3
            assert results[2]["percentage"] == 75

        def test_batch_scores_for_multiple_users(self, service, mock_user_repo, mock_vacancy_repo):
            """Batch deve calcular scores para múltiplos usuários."""
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 10, "title": DefaultPreference.VACANCY_ACCEPTS_SMOKER.title,
                    "rate": PreferenceResponse.YES},
            ]
            mock_user_repo.get_user_preferences_with_details.side_effect = [
                [{"preference_id": 1, "title": DefaultPreference.SMOKER.title,
                    "rate": PreferenceResponse.YES}],
                [{"preference_id": 1, "title": DefaultPreference.SMOKER.title,
                    "rate": PreferenceResponse.NO}],
            ]

            results = service.calculate_users_scores_for_vacancy(
                vacancy_id=1, user_ids=[1, 2])

            assert len(results) == 2
            assert results[0]["user_id"] == 1
            assert results[0]["percentage"] == 100
            assert results[1]["user_id"] == 2
            assert results[1]["percentage"] == 0

    # ==================== Testes de Edge Cases ====================

    class TestEdgeCases:
        """Testes para casos extremos."""

        @pytest.fixture
        def mock_user_repo(self):
            return MagicMock()

        @pytest.fixture
        def mock_vacancy_repo(self):
            return MagicMock()

        @pytest.fixture
        def service(self, mock_user_repo, mock_vacancy_repo):
            return ScoreCalculatorService(mock_user_repo, mock_vacancy_repo)

        def test_all_preferences_match_perfectly(self, service, mock_user_repo, mock_vacancy_repo):
            """Todas as preferências com match perfeito = 100%."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 1, "title": DefaultPreference.SMOKER.title,
                    "rate": PreferenceResponse.YES},
                {"preference_id": 2, "title": DefaultPreference.HAS_PETS.title,
                    "rate": PreferenceResponse.YES},
                {"preference_id": 3, "title": DefaultPreference.LIKES_PARTIES.title,
                    "rate": PreferenceResponse.YES},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 10, "title": DefaultPreference.VACANCY_ACCEPTS_SMOKER.title,
                    "rate": PreferenceResponse.YES},
                {"preference_id": 11, "title": DefaultPreference.VACANCY_ACCEPTS_PETS.title,
                    "rate": PreferenceResponse.YES},
                {"preference_id": 12, "title": DefaultPreference.ALLOWS_PARTIES.title,
                    "rate": PreferenceResponse.YES},
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            assert result["percentage"] == 100

        def test_all_preferences_incompatible(self, service, mock_user_repo, mock_vacancy_repo):
            """Todas as preferências incompatíveis = 0%."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 1, "title": DefaultPreference.SMOKER.title,
                    "rate": PreferenceResponse.YES},
                {"preference_id": 2, "title": DefaultPreference.HAS_PETS.title,
                    "rate": PreferenceResponse.YES},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 10, "title": DefaultPreference.VACANCY_ACCEPTS_SMOKER.title,
                    "rate": PreferenceResponse.NO},
                {"preference_id": 11, "title": DefaultPreference.VACANCY_ACCEPTS_PETS.title,
                    "rate": PreferenceResponse.NO},
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            assert result["percentage"] == 0

        def test_all_indifferent_returns_50_percent(self, service, mock_user_repo, mock_vacancy_repo):
            """Todas preferências INDIFFERENT devem retornar 50%."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 1, "title": DefaultPreference.SMOKER.title,
                    "rate": PreferenceResponse.INDIFFERENT},
                {"preference_id": 2, "title": DefaultPreference.HAS_PETS.title,
                    "rate": PreferenceResponse.INDIFFERENT},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 10, "title": DefaultPreference.VACANCY_ACCEPTS_SMOKER.title,
                    "rate": PreferenceResponse.INDIFFERENT},
                {"preference_id": 11, "title": DefaultPreference.VACANCY_ACCEPTS_PETS.title,
                    "rate": PreferenceResponse.INDIFFERENT},
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            assert result["percentage"] == 50
            assert result["level"] == "medium"

        def test_none_user_preferences(self, service, mock_user_repo, mock_vacancy_repo):
            """None nas preferências do usuário deve retornar 50%."""
            mock_user_repo.get_user_preferences_with_details.return_value = None
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 10, "title": DefaultPreference.VACANCY_ACCEPTS_SMOKER.title,
                    "rate": PreferenceResponse.YES},
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            assert result["percentage"] == 50

        def test_none_vacancy_preferences(self, service, mock_user_repo, mock_vacancy_repo):
            """None nas preferências da vaga deve retornar 50%."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 1, "title": DefaultPreference.SMOKER.title,
                    "rate": PreferenceResponse.YES},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = None

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            assert result["percentage"] == 50

        def test_works_from_home_home_office_friendly_match(self, service, mock_user_repo, mock_vacancy_repo):
            """Trabalha em casa (YES) + Estrutura home office (YES) = 100%."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 3, "title": DefaultPreference.WORKS_FROM_HOME.title,
                    "rate": PreferenceResponse.YES},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 13, "title": DefaultPreference.HOME_OFFICE_FRIENDLY.title,
                    "rate": PreferenceResponse.YES},
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            assert result["percentage"] == 100
            assert result["level"] == "high"

        def test_student_accepts_students_match(self, service, mock_user_repo, mock_vacancy_repo):
            """Estudante (YES) + Aceita estudantes (YES) = 100%."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 4, "title": DefaultPreference.STUDENT.title,
                    "rate": PreferenceResponse.YES},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 14, "title": DefaultPreference.VACANCY_ACCEPTS_STUDENTS.title,
                    "rate": PreferenceResponse.YES},
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            assert result["percentage"] == 100
            assert result["level"] == "high"

        def test_has_car_has_parking_match(self, service, mock_user_repo, mock_vacancy_repo):
            """Tem carro (YES) + Possui estacionamento (YES) = 100%."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 6, "title": DefaultPreference.HAS_CAR.title,
                    "rate": PreferenceResponse.YES},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
                {"preference_id": 16, "title": DefaultPreference.HAS_PARKING.title,
                    "rate": PreferenceResponse.YES},
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            assert result["percentage"] == 100
            assert result["level"] == "high"

        def test_clean_freak_cleaning_schedule_match(self, service, mock_user_repo, mock_vacancy_repo):
            """Muito organizado (YES) + Escala de limpeza (YES) = 100%."""
            mock_user_repo.get_user_preferences_with_details.return_value = [
                {"preference_id": 7, "title": DefaultPreference.CLEAN_FREAK.title,
                    "rate": PreferenceResponse.YES},
            ]
            mock_vacancy_repo.get_vacancy_preferences_with_details.return_value = [
            ]

            result = service.calculate_user_vacancy_score(
                user_id=1, vacancy_id=1)

            assert result["percentage"] == 100
            assert result["level"] == "high"
