import { PreferencesData } from "../types/preferences";

export const preferencesData: PreferencesData = {
  sections: [
    {
      id: "lifestyle",
      icon: "fas fa-users",
      title: "Estilo de Vida e Convivência",
      description: "Sobre seus hábitos e como você gosta de conviver.",
      questions: [
        {
          id: "smoking",
          question: "Você se incomoda com moradores fumantes?",
          options: [
            { label: "Sim", value: "YES" },
            { label: "Não", value: "NO" },
            { label: "Indiferente", value: "INDIFFERENT" },
          ],
        },
        {
          id: "cleanliness",
          question: "Para você, limpeza e organização são prioridade máxima?",
          options: [
            { label: "Sim", value: "YES" },
            { label: "Não", value: "NO" },
            { label: "Indiferente", value: "INDIFFERENT" },
          ],
        },
        {
          id: "quietness",
          question:
            "Você precisa de um ambiente silencioso na maior parte do tempo?",
          options: [
            { label: "Sim", value: "YES" },
            { label: "Não", value: "NO" },
            { label: "Indiferente", value: "INDIFFERENT" },
          ],
        },
      ],
    },
    {
      id: "property",
      icon: "fas fa-home",
      title: "Sobre o Imóvel",
      description: "O que você espera do seu futuro lar.",
      questions: [
        {
          id: "pets",
          question: "O local pode ter animais de estimação?",
          options: [
            { label: "Sim", value: "YES" },
            { label: "Não", value: "NO" },
            { label: "Indiferente", value: "INDIFFERENT" },
          ],
        },
        {
          id: "parties",
          question: "O local pode ter festas ou reuniões sociais?",
          options: [
            { label: "Sim", value: "YES" },
            { label: "Não", value: "NO" },
            { label: "Indiferente", value: "INDIFFERENT" },
          ],
        },
      ],
    },
  ],
};
