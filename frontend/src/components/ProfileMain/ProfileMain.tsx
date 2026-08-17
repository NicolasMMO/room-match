import React from "react";
import PreferenceItem from "../PreferenceItem/PreferenceItem";

interface ProfilePreference {
  icon: string;
  label: string;
  value: string;
}

interface ProfileMainProps {
  aboutMe: string;
  preferences: ProfilePreference[];
}

const ProfileMain: React.FC<ProfileMainProps> = ({
  aboutMe,
  preferences,
}) => {
  return (
    <div className="profile-main shadow-card rounded-xl bg-white p-8">
      <div className="mb-8">
        <h4 className="mb-4 flex items-center gap-2 border-b-2 border-gray-200 pb-2.5 text-xl text-primary-500">
          <i className="fas fa-user" />
          Sobre
        </h4>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {aboutMe?.trim() ? aboutMe : "Nenhuma descrição disponível."}
        </p>
      </div>

      <h4 className="mb-5 mt-10 flex items-center gap-2 border-b-2 border-gray-200 pb-2.5 text-xl text-primary-500">
        <i className="fas fa-home" />
        Preferências de Moradia
      </h4>

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
    </div>
  );
};

export default ProfileMain;
