import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormGroup, Layout, Toast } from "../components";
import { useUserPreferences } from "../hooks/useUserPreferences";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/userService";

interface Preferences {
  [key: number]: string;
}

export const PreferencesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [preferences, setPreferences] = useState<Preferences>({});
  const [aboutMe, setAboutMe] = useState("");
  const [isFromRegister, setIsFromRegister] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );

  const { getCurrentUserId } = useAuth();

  const {
    savePreferences,
    isLoading,
    isFetchingPreferences,
    isSuccess,
    error,
    availablePreferences,
  } = useUserPreferences();

  useEffect(() => {
    const fromRegister = (location.state as any)?.fromRegister;
    if (!fromRegister) return;

    setIsFromRegister(true);
    // Clear location.state so the banner doesn't reappear if you revisit.
    navigate(".", { replace: true, state: null });
  }, [location.state, navigate]);

  const selectOption = (preferenceId: number, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [preferenceId]: value,
    }));
  };

  const isQuestionAnswered = (preferenceId: number): boolean => {
    return !!preferences[preferenceId];
  };

  const getQuestionLabelClass = (preferenceId: number): string => {
    if (isQuestionAnswered(preferenceId)) {
      return "text-gray-800";
    }
    return "text-red-600 font-medium";
  };

  const handleSavePreferences = async () => {
    console.log("Saving preferences:", preferences);

    const userId = getCurrentUserId();
    if (!userId) {
      setToastMessage("Usuário não autenticado.");
      setToastType("error");
      setShowToast(true);
      return;
    }

    try {
      await userService.updateUser(userId, { description: aboutMe });
    } catch (err) {
      console.error("Failed to update description", err);
    }

    const { success, error: saveError } = await savePreferences(preferences);

    if (success) {
      setTimeout(() => {
        navigate("/vacancies");
      }, 2000);
    } else {
      setToastMessage(saveError || error || "Erro ao salvar preferências!");
      setToastType("error");
      setShowToast(true);
    }
  };

  const renderOptionPill = (preferenceId: number, option: string) => (
    <div
      key={option}
      className={`option-pill ${
        preferences[preferenceId] === option ? "selected" : ""
      }`}
      onClick={() => selectOption(preferenceId, option)}
    >
      {option}
    </div>
  );

  if (isFetchingPreferences) {
    return (
      <Layout showNavbar={false}>
        <div className="main-container">
          <div className="card">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-accent"></i>
              <p className="mt-4 text-gray-600">Carregando preferências...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout showNavbar={false}>
        <div className="main-container">
          <div className="card">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Preferências</h1>
              <p className="text-gray-600 mt-2">
                Para personalizar sua experiência, conte-nos sobre suas
                preferências
              </p>
            </div>

            {isSuccess && (
              <div
                id="success-message"
                className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4"
              >
                <p className="text-center font-medium text-green-800">
                  {isFromRegister
                    ? "✓ Conta criada e preferências salvas com sucesso!"
                    : "✓ Preferências salvas com sucesso!"}
                </p>
              </div>
            )}

            <FormGroup label="Sobre mim" htmlFor="aboutMe" className="mb-6">
              <textarea
                id="aboutMe"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                placeholder="Conte um pouco sobre você para aparecer no seu perfil."
              />
            </FormGroup>

            <div className="preference-section">
              <div className="preference-header">
                <i className="fas fa-users"></i>
                <div>
                  <h3>Suas Preferências</h3>
                  <p>Responda as perguntas abaixo para encontrar combinações ideais.</p>
                </div>
              </div>

              {availablePreferences.map((preference) => {
                const options =
                  preference.answer_type === "BOOLEAN"
                    ? ["Sim", "Não"]
                    : ["Sim", "Não", "Indiferente"];

                return (
                  <div key={preference.id} className="preference-question">
                    <label className={getQuestionLabelClass(preference.id)}>
                      {preference.title}
                    </label>
                    <div className="preference-options">
                      {options.map((option) =>
                        renderOptionPill(preference.id, option)
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "right", marginTop: "30px" }}>
              <a
                href="#"
                className={`btn btn-accent ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{ fontSize: "1.1em", padding: "15px 35px" }}
                onClick={(e) => {
                  e.preventDefault();
                  if (!isLoading) {
                    handleSavePreferences();
                  }
                }}
              >
                <i
                  className={`fas ${
                    isLoading ? "fa-spinner fa-spin" : "fa-save"
                  }`}
                ></i>
                {isLoading ? " Salvando..." : " Salvar Preferências"}
              </a>
            </div>
          </div>
        </div>
      </Layout>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};
