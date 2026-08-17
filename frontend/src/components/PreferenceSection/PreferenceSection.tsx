import React from "react";

interface PreferenceSectionProps {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

const PreferenceSection: React.FC<PreferenceSectionProps> = ({
  icon,
  title,
  description,
  children,
}) => {
  return (
    <div className="mb-12">
      <div className="mb-8 flex items-center gap-4 border-b border-gray-200 pb-4">
        <i className={`${icon} text-3xl text-primary-500`} />
        <div>
          <h3 className="m-0 text-2xl font-semibold text-gray-800">{title}</h3>
          <p className="m-0 mt-1 text-gray-600">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default PreferenceSection;
