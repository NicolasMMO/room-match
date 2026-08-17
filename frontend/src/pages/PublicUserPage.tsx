import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { userService } from "../services/userService";
import { useAuth } from "../contexts/AuthContext";
import { Layout } from "../components/Layout/Layout";
import ProfileSidebar from "../components/ProfileSidebar/ProfileSidebar";
import PreferenceItem from "../components/PreferenceItem/PreferenceItem";
import { mapApiPreferencesToProfile } from "../utils/mappers";
import { ProfilePreference } from "../types/profile";

const PublicUserPage: React.FC = () => {
    const { userSlug } = useParams();
    const location = useLocation();
    const userId = (location.state as any)?.id || 0;
    const { user: authUser, isAuthenticated } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [preferences, setPreferences] = useState<ProfilePreference[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Verifica se é o perfil do próprio usuário autenticado
    const isOwnProfile = isAuthenticated && authUser && authUser.id === userId;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log("Buscando usuário com slug:", userSlug, "ID extraído:", userId);
                if (!userId) {
                    setError("ID do usuário não encontrado. Acesse a página a partir de um perfil válido.");
                    setLoading(false);
                    return;
                }

                const userData = await userService.getUserById(userId);
                console.log("Usuário carregado:", userData);
                setUser(userData);

                // Buscar preferências públicas
                try {
                    console.log("Buscando preferências para usuário ID:", userData.id);
                    const prefsData = await userService.getUserPreferences(userData.id, "USER");
                    console.log("Resposta de preferências:", prefsData);

                    if (Array.isArray(prefsData)) {
                        setPreferences(mapApiPreferencesToProfile(prefsData));
                    } else if (prefsData?.preferences && Array.isArray(prefsData.preferences)) {
                        setPreferences(mapApiPreferencesToProfile(prefsData.preferences));
                    }
                } catch (prefErr: any) {
                    console.error("Erro ao buscar preferências:", prefErr);
                }

                setLoading(false);
            } catch (err: any) {
                console.error("Erro ao carregar usuário:", err);
                setError(`Erro ao carregar usuário: ${err.message || err}`);
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    if (loading) {
        return (
            <Layout>
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-blue-600">Carregando perfil...</div>
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

    if (!user) {
        return (
            <Layout>
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-gray-600">Perfil não encontrado</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Perfil de {user.name}</h1>
                    <p className="text-gray-600">
                        {isOwnProfile ? "Seu perfil" : "Informações e preferências públicas"}
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Seção Principal */}
                    <div className="md:col-span-2">
                        <div className="profile-main shadow-card rounded-xl bg-white p-8">
                            {/* Seção Sobre */}
                            <div className="mb-8">
                                <h4 className="mb-4 flex items-center gap-2 border-b-2 border-gray-200 pb-2.5 text-xl text-primary-500">
                                    <i className="fas fa-user" />
                                    Sobre
                                </h4>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {user.description || user.bio || "Nenhuma descrição disponível."}
                                </p>
                            </div>

                            {/* Seção Preferências */}
                            <div>
                                <h4 className="mb-5 flex items-center gap-2 border-b-2 border-gray-200 pb-2.5 text-xl text-primary-500">
                                    <i className="fas fa-heart" />
                                    Preferências Públicas
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
                                    <p className="text-gray-500">Nenhuma preferência pública disponível.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <ProfileSidebar
                            name={user.name}
                            profileImage={user.profileImage || user.profile_picture_path}
                            onEditProfile={
                                isOwnProfile
                                    ? () => {
                                        console.log("Editar perfil");
                                    }
                                    : undefined
                            }
                            onChangePassword={
                                isOwnProfile
                                    ? () => {
                                        console.log("Alterar senha");
                                    }
                                    : undefined
                            }
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PublicUserPage;