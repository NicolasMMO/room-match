import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { vacancyService } from "../services/vacancyService";
import { userService } from "../services/userService";
import { vacancyPreferencesService } from "../services/vacancyPreferencesService";
import { generateSlug } from "../utils/slugUtils";
import { mapApiPreferencesToProfile } from "../utils/mappers";
import { Layout } from "../components/Layout/Layout";
import PreferenceItem from "../components/PreferenceItem/PreferenceItem";
import { ProfilePreference } from "../types/profile";
import { Card } from "../components/index";

const VacancyDescriptionPage: React.FC = () => {
    const { vacancySlug } = useParams();
    const location = useLocation();
    const vacancyId = (location.state as any)?.id || 0;
    const [vacancy, setVacancy] = useState<any>(null);
    const [owner, setOwner] = useState<any>(null);
    const [preferences, setPreferences] = useState<ProfilePreference[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVacancy = async () => {
            try {
                console.log("Buscando vaga com slug:", vacancySlug, "ID extraído:", vacancyId);
                if (!vacancyId) {
                    setError("ID da vaga não encontrado. Acesse a página a partir de um anúncio válido.");
                    setLoading(false);
                    return;
                }
                const vacancyData = await vacancyService.getVacancyById(vacancyId);
                console.log("Vaga carregada:", vacancyData);

                // Buscar preferências da vaga
                try {
                    console.log("Buscando preferências para vaga ID:", vacancyId);
                    const prefsData = await vacancyPreferencesService.getVacancyPreferences(Number(vacancyId));
                    console.log("Resposta completa de preferências da vaga:", prefsData);

                    if (Array.isArray(prefsData)) {
                        setPreferences(mapApiPreferencesToProfile(prefsData));
                    } else if (prefsData?.preferences && Array.isArray(prefsData.preferences)) {
                        setPreferences(mapApiPreferencesToProfile(prefsData.preferences));
                    }
                } catch (prefErr: any) {
                    console.error("Erro ao buscar preferências da vaga:", prefErr);
                }

                setVacancy(vacancyData);

                if (vacancyData.user_id) {
                    const ownerData = await userService.getUserById(vacancyData.user_id);
                    console.log("Proprietário carregado:", ownerData);
                    setOwner(ownerData);
                }
                setLoading(false);
            } catch (err: any) {
                console.error("Erro ao carregar vaga:", err);
                setError(`Erro ao carregar vaga: ${err.message || err}`);
                setLoading(false);
            }
        };
        fetchVacancy();
    }, [vacancyId]);

    if (loading) {
        return (
            <Layout>
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-blue-600">Carregando vaga...</div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-red-600">{error}</div>
                </div>
            </Layout>
        );
    }

    if (!vacancy) {
        return (
            <Layout>
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-gray-600">Vaga não encontrada</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">{vacancy.title}</h1>
                    <p className="text-gray-600">Detalhes e preferências da vaga</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Seção Principal */}
                    <div className="md:col-span-2">
                        <div className="profile-main shadow-card rounded-xl bg-white p-8">
                            {/* Seção Descrição */}
                            <div className="mb-8">
                                <h4 className="mb-4 flex items-center gap-2 border-b-2 border-gray-200 pb-2.5 text-xl text-primary-500">
                                    <i className="fas fa-home" />
                                    Descrição
                                </h4>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {vacancy.description || "Nenhuma descrição disponível."}
                                </p>
                            </div>

                            {/* Seção Preferências */}
                            <div className="mb-8">
                                <h4 className="mb-5 flex items-center gap-2 border-b-2 border-gray-200 pb-2.5 text-xl text-primary-500">
                                    <i className="fas fa-heart" />
                                    Preferências da Vaga
                                </h4>

                                {preferences && preferences.length > 0 ? (
                                    <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
                                        {preferences.map((preference, index) => (
                                            <PreferenceItem
                                                key={index}
                                                icon={preference.icon}
                                                label={preference.label}
                                                value={preference.value}
                                            />
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">Nenhuma preferência específica para esta vaga.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Informações da Vaga */}
                    <div className="md:col-span-1">
                        <div className="sticky top-8 flex flex-col gap-6">
                            {/* Proprietário */}
                            {owner && (
                                <Card className="px-5 py-8">
                                    <h4 className="mb-4 flex items-center gap-2 border-b-2 border-gray-200 pb-2.5 text-xl text-primary-500">
                                        <i className="fas fa-user" />
                                        Criada por
                                    </h4>
                                    <Link
                                        to={`/user/${generateSlug(owner.name)}`}
                                        state={{ id: owner.id }}
                                        className="flex items-center gap-4 rounded-lg bg-blue-50 p-4 hover:bg-blue-100 transition"
                                    >
                                        <img
                                            src={
                                                owner.profileImage ||
                                                owner.profile_picture_path ||
                                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${owner.name}`
                                            }
                                            alt={owner.name}
                                            className="h-16 w-16 rounded-full object-cover border-2 border-blue-200"
                                        />
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-blue-600">{owner.name}</p>
                                            <p className="text-sm text-gray-600">Ver perfil completo</p>
                                        </div>
                                    </Link>
                                </Card>
                            )}

                            <Card className="px-5 py-10">
                                <div className="flex flex-col gap-4">
                                {/* Preço */}
                                {vacancy.price && (
                                    <div className="text-center pb-4 border-b">
                                        <p className="text-sm text-gray-500 mb-1">Aluguel</p>
                                        <p className="text-2xl font-bold text-primary-500">{vacancy.price}</p>
                                    </div>
                                )}

                                {/* Localização */}
                                {vacancy.location && (
                                    <div className="border-b pb-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <i className="fas fa-map-marker-alt text-primary-500" />
                                            <span>{vacancy.location}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Tipo de Vaga */}
                                {vacancy.type && (
                                    <div className="border-b pb-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <i className="fas fa-door-open text-primary-500" />
                                            <span className="capitalize">{vacancy.type}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Endereço */}
                                {(vacancy.address_street || vacancy.address_number) && (
                                    <div>
                                        <h4 className="mb-3 flex items-center gap-2 border-b-2 border-gray-200 pb-2.5 text-xl text-primary-500">
                                            <i className="fas fa-map-marker-alt" />
                                            Endereço
                                        </h4>
                                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                            {vacancy.address_street && <>{vacancy.address_street}</>}
                                            {vacancy.address_number && <>, {vacancy.address_number}</>}
                                        </p>
                                    </div>
                                )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default VacancyDescriptionPage;
