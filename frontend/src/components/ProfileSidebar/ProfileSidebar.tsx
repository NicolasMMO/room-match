import React from "react";
import { Button, Card } from "../index";

interface ProfileSidebarProps {
  profileImage: string;
  name: string;
  onEditProfile?: () => void;
  onChangePassword?: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  profileImage,
  name,
  onEditProfile,
  onChangePassword,
}) => {
  return (
    <div className="profile-sidebar">
      <Card className="px-5 py-10 text-center">
        <img
          src={profileImage}
          alt={`Foto de ${name}`}
          className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-primary-500 object-cover"
          onError={(e) => {

            e.currentTarget.src =
              "https://api.dicebear.com/7.x/avataaars/svg?seed=Default&backgroundColor=b6e3f4";
          }}
        />

        <h3 className="m-0 text-2xl font-bold text-primary-500">{name}</h3>

        {(onEditProfile || onChangePassword) && (
          <div className="mt-8 flex flex-col gap-2.5">
            {onEditProfile && (
              <Button variant="primary" onClick={onEditProfile} className="w-full">
                Editar Perfil
              </Button>
            )}

            {onChangePassword && (
              <Button onClick={onChangePassword} className="w-full">
                Alterar Senha
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfileSidebar;
