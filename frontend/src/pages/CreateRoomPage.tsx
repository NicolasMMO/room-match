import React, { useState } from "react";
import Button from "../components/Button/Button";
import FormGroup from "../components/FormGroup/FormGroup";
import Input from "../components/Input/Input";
import { Layout } from "../components/Layout/Layout";
import { useCreateListing } from "../hooks/useCreateListing";
import { useVacancyPreferences } from "../hooks/useVacancyPreferences";
import { useAuth } from "../contexts/AuthContext";
import { RoomListingFormData } from "../types/createListing";

export const CreateRoomPage: React.FC = () => {
  const { refreshUserVacancies } = useAuth();
  const {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    updateField,
    addPhoto,
    removePhoto,
    submitForm,
  } = useCreateListing("room");

  const {
    availablePreferences,
    isFetchingPreferences,
    saveVacancyPreferences,
    isLoading: isSavingPreferences,
  } = useVacancyPreferences();

  const [preferences, setPreferences] = useState<Record<number, string>>({});
  const [preferencesError, setPreferencesError] = useState<string | null>(null);

  const roomData = formData as RoomListingFormData;

  const handlePreferenceChange = (preferenceId: number, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [preferenceId]: value,
    }));
    setPreferencesError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate preferences
    const unansweredCount = availablePreferences.filter(
      (pref) => !preferences[pref.id]
    ).length;

    if (unansweredCount > 0) {
      setPreferencesError("Por favor, responda todas as preferências.");
      setTimeout(() => {
        const el = document.getElementById("preferences-error");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          const list = document.querySelector(".preference-list");
          list?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }

    // First create the vacancy
    const vacancyId = await submitForm();

    if (vacancyId) {
      // Then save the preferences
      await saveVacancyPreferences(vacancyId, preferences);

      // Refresh user vacancies to update the navbar
      await refreshUserVacancies();
    }
  };

  const getOptions = (answerType: string) => {
    if (answerType === "BOOLEAN") {
      return ["Sim", "Não"];
    }
    return ["Sim", "Não", "Indiferente"];
  };

  return (
    <Layout>
      <div className="main-container">
        <div className="card">
          <h2 style={{ color: "var(--text-color)", marginBottom: "25px" }}>
            <i
              className="fas fa-plus-circle"
              style={{ color: "var(--accent-color)", marginRight: "12px" }}
            ></i>
            Cadastre sua Vaga
          </h2>

          {isSuccess && (
            <div
              id="success-message"
              className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4"
            >
              <p className="text-center font-medium text-green-800">
                ✓ Anúncio criado com sucesso!
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            { }
            <h4 className="form-section-header">Informações Principais</h4>

            <FormGroup label="Título do Anúncio" error={errors.title}>
              <Input
                type="text"
                name="title"
                placeholder="Ex: Suíte em apê no bairro X"
                value={roomData.title}
                onChange={(e) => updateField("title", e.target.value)}
                error={!!errors.title}
              />
            </FormGroup>

            <FormGroup label="Descrição do Imóvel" error={errors.description}>
              <textarea
                name="description"
                placeholder="Descreva o imóvel: localização, características, etc."
                value={roomData.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="resize-vertical min-h-[100px] w-full rounded-lg border border-gray-300 p-3 font-sans text-base focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </FormGroup>

            <FormGroup label="Endereço" error={errors.address}>
              <Input
                type="text"
                name="address"
                placeholder="Ex: Rua das Flores, 123, Centro, São Paulo"
                value={roomData.address}
                onChange={(e) => updateField("address", e.target.value)}
                error={!!errors.address}
              />
            </FormGroup>

            { }
            <h4 className="form-section-header">Detalhes e Valores</h4>

            <div className="form-grid">
              <FormGroup label="Aluguel por pessoa (R$)" error={errors.rent}>
                <Input
                  type="number"
                  name="rent"
                  value={roomData.rent || ""}
                  onChange={(e) => updateField("rent", Number(e.target.value))}
                  error={!!errors.rent}
                />
              </FormGroup>

              <FormGroup label="Vagas disponíveis" error={errors.vacancies}>
                <Input
                  type="number"
                  name="vacancies"
                  value={roomData.vacancies || ""}
                  onChange={(e) =>
                    updateField("vacancies", Number(e.target.value))
                  }
                  error={!!errors.vacancies}
                />
              </FormGroup>

              <FormGroup label="Total de quartos" error={errors.rooms}>
                <Input
                  type="number"
                  name="rooms"
                  value={roomData.rooms || ""}
                  onChange={(e) => updateField("rooms", Number(e.target.value))}
                  error={!!errors.rooms}
                />
              </FormGroup>
            </div>

            { }
            <h4 className="form-section-header">Regras da Casa</h4>

            {(errors.preferences || preferencesError) && (
              <div
                id="preferences-error"
                className="mb-4 text-red-600 text-sm font-medium"
              >
                {errors.preferences || preferencesError}
              </div>
            )}

            {isFetchingPreferences ? (
              <div className="text-center py-4">
                <i className="fas fa-spinner fa-spin text-2xl text-accent"></i>
                <p className="mt-2 text-gray-600">Carregando preferências...</p>
              </div>
            ) : (
              <div className="preference-list">
                {availablePreferences.map((pref) => (
                  <div key={pref.id} className="preference-question">
                    <label>{pref.title}</label>
                    <div className="preference-options">
                      {getOptions(pref.answer_type).map((option) => (
                        <div
                          key={option}
                          className={`option-pill ${preferences[pref.id] === option ? "selected" : ""
                            }`}
                          onClick={() => handlePreferenceChange(pref.id, option)}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            { }
            <h4 className="form-section-header">Fotos do Imóvel</h4>

            <div
              className="photo-uploader"
              onClick={() => document.getElementById("photo-input")?.click()}
            >
              <i className="fas fa-cloud-upload-alt mb-4 text-5xl text-primary-500"></i>
              <p>Arraste e solte as fotos aqui</p>
              <input
                id="photo-input"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    Array.from(e.target.files).forEach((file) =>
                      addPhoto(file)
                    );
                  }
                }}
              />
            </div>

            { }
            {roomData.photos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {roomData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Foto ${index + 1}`}
                      className="h-24 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            { }
            <div className="mt-10 text-right">
              <Button
                type="submit"
                variant="accent"
                disabled={isSubmitting || isSavingPreferences}
                className="btn btn-accent"
              >
                <i className="fas fa-bullhorn mr-2"></i>
                {isSubmitting || isSavingPreferences
                  ? "Publicando..."
                  : "Publicar Vaga"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
