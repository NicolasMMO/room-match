import React, { useState } from "react";

interface PersonPhotoProps {
  src: string;
  alt: string;
  name: string;
}

export const PersonPhoto: React.FC<PersonPhotoProps> = ({ src, alt, name }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    console.log("Erro ao carregar imagem:", src);
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    console.log("Imagem carregada com sucesso:", src);
    setIsLoading(false);
    setHasError(false);
  };

  const generateFallbackAvatar = (name: string): string => {
    const seed = name.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4`;
  };

  if (hasError) {
    return (
      <img
        src={generateFallbackAvatar(name)}
        alt={alt}
        className="
          mx-auto my-4 h-32 w-32
          rounded-full border-4 border-gray-200 object-cover
        "
        onError={(e) => {

          const target = e.target as HTMLImageElement;
          target.src = `https://via.placeholder.com/120x120/005A9C/FFFFFF?text=${name.charAt(0)}`;
        }}
      />
    );
  }

  return (
    <div className="relative mx-auto my-4 h-32 w-32">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-gray-200 bg-gray-100">
          <div className="text-gray-500">Carregando...</div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`
          h-32 w-32 rounded-full border-4 border-gray-200 object-cover
          ${isLoading ? 'opacity-0' : 'opacity-100'}
          transition-opacity duration-300
        `}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};

export default PersonPhoto;
