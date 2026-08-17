import React, { useRef } from "react";

interface PhotoUploaderProps {
  photos: File[];
  onAddPhoto: (file: File) => void;
  onRemovePhoto: (index: number) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photos,
  onAddPhoto,
  onRemovePhoto,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        onAddPhoto(file);
      }
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        onAddPhoto(file);
      }
    });
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="
          border-3 cursor-pointer rounded-xl border-dashed
          border-gray-300 bg-gray-50 p-10 text-center
          transition-colors duration-200
          hover:border-blue-400 hover:bg-blue-50
        "
      >
        <i className="fas fa-cloud-upload-alt mb-4 block text-5xl text-blue-600"></i>
        <p className="text-lg text-gray-600">
          Arraste e solte as fotos aqui ou{" "}
          <span className="font-medium text-blue-600">
            clique para selecionar
          </span>
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Formatos aceitos: JPG, PNG, GIF
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(photo)}
                alt={`Foto ${index + 1}`}
                className="h-24 w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => onRemovePhoto(index)}
                className="
                  absolute right-1 top-1 flex h-6
                  w-6 items-center justify-center
                  rounded-full bg-red-500 text-white
                  transition-colors hover:bg-red-600
                "
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;
