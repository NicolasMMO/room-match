import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProfile } from "../hooks/useProfile";
import { Layout } from "../components/Layout/Layout";
import Input from "../components/Input/Input";
import FormGroup from "../components/FormGroup/FormGroup";
import Button from "../components/Button/Button";
import { userService } from "../services/userService";
import { useUserPreferences } from "../hooks/useUserPreferences";
import { Toast } from "../components";

interface Preferences {
  [key: number]: string;
}

export const EditProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const { profile, isLoading, error: profileError } = useProfile(userId!);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [aboutMe, setAboutMe] = useState("");

  const [preferences, setPreferences] = useState<Preferences>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );

  const {
    savePreferences,
    isLoading: isSavingPreferences,
    isFetchingPreferences,
    availablePreferences,
  } = useUserPreferences();

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setAboutMe(profile.aboutMe || "");
      const userPreferences: Preferences = {};

      const mapRateToAnswer = (rate: "YES" | "NO" | "INDIFFERENT"): string => {
        const mapping = {
          YES: "Sim",
          NO: "Não",
          INDIFFERENT: "Indiferente",
        } as const;
        return mapping[rate] || "";
      };

      profile.preferences.forEach((p: any) => {
        if (typeof p?.preference_id !== "number") return;
        if (p?.rate === "YES" || p?.rate === "NO" || p?.rate === "INDIFFERENT") {
          userPreferences[p.preference_id] = mapRateToAnswer(p.rate);
          return;
        }
        if (typeof p?.value === "string" && p.value) {
          userPreferences[p.preference_id] = p.value;
        }
      });

      setPreferences(userPreferences);
    }
  }, [profile]);

  const selectOption = (preferenceId: number, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [preferenceId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        await userService.updateUser(user.id, { name, description: aboutMe });
        const { success, error } = await savePreferences(preferences);

        if (success) {
          setToastMessage("Perfil e preferências salvos com sucesso!");
          setToastType("success");
          setShowToast(true);

          setTimeout(() => {
            navigate(`/profile/${user.id}`);
          }, 2000);
        } else {
          setToastMessage(error || "Erro ao salvar preferências!");
          setToastType("error");
          setShowToast(true);
        }
      } catch (error) {
        console.error("Failed to update profile", error);
        setToastMessage("Erro ao atualizar perfil!");
        setToastType("error");
        setShowToast(true);
      }
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

  if (isLoading || isFetchingPreferences) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-blue-600">Carregando...</div>
        </div>
      </Layout>
    );
  }

  if (profileError) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-red-600">{profileError}</div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800">Editar Perfil</h1>
          <form onSubmit={handleSubmit} className="mt-8">
            <FormGroup label="Nome" htmlFor="name">
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>

            <FormGroup label="Sobre mim" htmlFor="aboutMe">
              <textarea
                id="aboutMe"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
              />
            </FormGroup>

            <div className="preference-section mt-8">
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
                    <label className="text-gray-800">{preference.title}</label>
                    <div className="preference-options">
                      {options.map((option) =>
                        renderOptionPill(preference.id, option)
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <Button type="submit" className="mt-8" disabled={isSavingPreferences}>
              {isSavingPreferences ? "Salvando..." : "Salvar"}
            </Button>
          </form>
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
