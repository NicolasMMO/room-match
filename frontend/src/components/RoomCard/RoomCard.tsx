import React from 'react';
import { Room } from '../../shared/types';

interface RoomCardProps {
  room: Room;
  onExpressInterest?: (roomId: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onExpressInterest }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      {}
      <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
        {room.images.length > 0 ? (
          <img
            src={room.images[0]}
            alt={room.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {}
      <div className="p-4">
        {}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {room.title}
          </h3>
        </div>

        {}
        <p className="text-2xl font-bold text-purple-600 mb-2">
          {formatPrice(room.price)}
          <span className="text-sm text-gray-500 font-normal">/mês</span>
        </p>

        {}
        <p className="text-gray-600 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {room.location}
        </p>

        {}
        <div className="flex justify-between text-sm text-gray-600 mb-3">
          <span>{room.availableSpots} vagas disponíveis</span>
          <span>Disponível em {formatDate(room.availableFrom)}</span>
        </div>

        {}
        <div className="flex flex-wrap gap-1 mb-4">
          {room.rules.allowsPets && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              🐕 Aceita pets
            </span>
          )}
          {room.rules.allowsSmokers && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              🚬 Permite fumar
            </span>
          )}
          {room.rules.allowsParties && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              🎉 Permite festas
            </span>
          )}
        </div>

        {}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-medium text-sm">
                {room.owner.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="ml-2 text-sm text-gray-600">{room.owner.name}</span>
          </div>

          {room.matchScore && (
            <div className="text-right">
              <span className="text-xs text-gray-500">Compatibilidade</span>
              <div className="text-sm font-semibold text-green-600">
                {Math.round(room.matchScore)}%
              </div>
            </div>
          )}
        </div>

        {}
        <button
          onClick={() => onExpressInterest?.(room.id)}
          className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          {room.isReal ? 'Demonstrar Interesse' : 'Participar do Grupo'}
        </button>
      </div>
    </div>
  );
};
