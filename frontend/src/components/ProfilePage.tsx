import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProfile } from "../hooks/useProfile";
import { Layout } from "./Layout/Layout";
import ProfileMain from "./ProfileMain/ProfileMain";
import ProfileSidebar from "./ProfileSidebar/ProfileSidebar";

export const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, isAuthenticated } = useAuth();
  const { profile, isLoading, error } = useProfile(userId!);
  const navigate = useNavigate();

  const isOwnProfile = isAuthenticated && user && user.id.toString() === userId;

  if (isLoading) {
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

  if (!profile) {
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
          <h1 className="text-3xl font-bold text-gray-800">
            {isOwnProfile ? "Meu Perfil" : `Perfil de ${profile.name}`}
          </h1>
          <p className="text-gray-600">
            {isOwnProfile
              ? "Visualize e edite suas informações pessoais"
              : "Informações do usuário"}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {}
          <div className="md:col-span-2">
            <ProfileMain
              aboutMe={profile.aboutMe}
              preferences={profile.preferences}
            />
          </div>

          {}
          <div className="md:col-span-1">
            <ProfileSidebar
              name={profile.name}
              profileImage={profile.profileImage}
              onEditProfile={
                isOwnProfile ? () => navigate(`/profile/${userId}/edit`) : undefined
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

export default ProfilePage;
