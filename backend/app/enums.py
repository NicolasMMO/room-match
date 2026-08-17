from enum import Enum


class PreferenceType(Enum):
    VACANCY = "VACANCY"
    USER = "USER"


class PreferenceResponse(Enum):
    NO = "NO"
    INDIFFERENT = "INDIFFERENT"
    YES = "YES"


class AnswerType(Enum):
    """Tipo de resposta aceita pela preferência."""
    BOOLEAN = "BOOLEAN"      # Aceita apenas Sim/Não
    TERNARY = "TERNARY"      # Aceita Sim/Não/Indiferente


class VacancyType(Enum):
    PROPERTY = "PROPERTY"
    SEARCH_GROUP = "SEARCH_GROUP"


class DefaultPreference(Enum):
    """
    Preferências padrão do sistema.
    Formato: (título, tipo, answer_type)
    """

    # Preferências de usuário (características pessoais)
    # BOOLEAN = Sim/Não apenas | TERNARY = Sim/Não/Indiferente
    SMOKER = ("Você é fumante?", PreferenceType.USER, AnswerType.BOOLEAN)
    USER_ACCEPTS_SMOKER = ("Aceita morar com fumante?",
                           PreferenceType.USER, AnswerType.TERNARY)
    HAS_PETS = ("Você tem pets?", PreferenceType.USER, AnswerType.BOOLEAN)
    USER_ACCEPTS_PETS = ("Aceita morar com pets?",
                         PreferenceType.USER, AnswerType.TERNARY)
    WORKS_FROM_HOME = ("Trabalha em home office?",
                       PreferenceType.USER, AnswerType.BOOLEAN)
    STUDENT = ("É estudante?", PreferenceType.USER, AnswerType.BOOLEAN)
    EARLY_RISER = ("Acorda cedo?", PreferenceType.USER, AnswerType.TERNARY)
    NIGHT_OWL = ("Dorme tarde?", PreferenceType.USER, AnswerType.TERNARY)
    LIKES_PARTIES = ("Gosta de festas em casa?",
                     PreferenceType.USER, AnswerType.TERNARY)
    PLAYS_MUSIC = ("Toca instrumento?",
                   PreferenceType.USER, AnswerType.BOOLEAN)
    COOKS_OFTEN = ("Cozinha frequentemente?",
                   PreferenceType.USER, AnswerType.TERNARY)
    CLEAN_FREAK = ("Muito organizado?",
                   PreferenceType.USER, AnswerType.TERNARY)
    HAS_CAR = ("Precisa de estacionamento?",
               PreferenceType.USER, AnswerType.BOOLEAN)

    # Preferências de vaga (requisitos/aceitação)
    VACANCY_ACCEPTS_SMOKER = (
        "Aceita fumante?", PreferenceType.VACANCY, AnswerType.TERNARY)
    VACANCY_ACCEPTS_PETS = (
        "Aceita pets?", PreferenceType.VACANCY, AnswerType.TERNARY)
    ACCEPTS_COUPLES = (
        "Aceita casais?", PreferenceType.VACANCY, AnswerType.TERNARY)
    QUIET_ENVIRONMENT = ("Ambiente silencioso?",
                         PreferenceType.VACANCY, AnswerType.TERNARY)
    ALLOWS_VISITORS = ("Permite visitas?",
                       PreferenceType.VACANCY, AnswerType.TERNARY)
    ALLOWS_PARTIES = ("Permite festas?",
                      PreferenceType.VACANCY, AnswerType.TERNARY)
    SHARED_EXPENSES = ("Despesas compartilhadas?",
                       PreferenceType.VACANCY, AnswerType.BOOLEAN)
    HOME_OFFICE_FRIENDLY = ("Estrutura para home office?",
                            PreferenceType.VACANCY, AnswerType.BOOLEAN)
    VACANCY_ACCEPTS_STUDENTS = (
        "Aceita estudantes?", PreferenceType.VACANCY, AnswerType.TERNARY)
    HAS_PARKING = ("Possui estacionamento?",
                   PreferenceType.VACANCY, AnswerType.BOOLEAN)
    WOMEN_ONLY = ("Apenas mulheres?",
                  PreferenceType.VACANCY, AnswerType.BOOLEAN)
    MEN_ONLY = ("Apenas homens?", PreferenceType.VACANCY, AnswerType.BOOLEAN)

    @property
    def title(self) -> str:
        return self.value[0]

    @property
    def preference_type(self) -> PreferenceType:
        return self.value[1]

    @property
    def answer_type(self) -> "AnswerType":
        return self.value[2]
