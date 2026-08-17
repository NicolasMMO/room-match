import React, { useState } from "react";
import { RoomFilters } from "../../shared/types";

interface SearchFiltersProps {
  onFiltersChange: (filters: RoomFilters) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  onFiltersChange,
}) => {
  const [filters, setFilters] = useState<RoomFilters>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof RoomFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Localização
          </label>
          <input
            type="text"
            placeholder="Cidade, bairro..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={filters.location || ""}
            onChange={(e) =>
              handleFilterChange("location", e.target.value || undefined)
            }
          />
        </div>

        {}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço mínimo
          </label>
          <input
            type="number"
            placeholder="R$ 0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={filters.minPrice || ""}
            onChange={(e) =>
              handleFilterChange(
                "minPrice",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
        </div>

        {}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço máximo
          </label>
          <input
            type="number"
            placeholder="R$ 5000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={filters.maxPrice || ""}
            onChange={(e) =>
              handleFilterChange(
                "maxPrice",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
        </div>

        {}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={
              filters.isReal === undefined ? "" : filters.isReal.toString()
            }
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange(
                "isReal",
                value === "" ? undefined : value === "true",
              );
            }}
          >
            <option value="">Todos</option>
            <option value="true">Vagas Reais</option>
            <option value="false">Grupos de Procura</option>
          </select>
        </div>
      </div>

      {}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
        >
          {showAdvanced ? "Ocultar" : "Mostrar"} filtros avançados
          <svg
            className={`ml-1 w-4 h-4 transform transition-transform ${showAdvanced ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={clearFilters}
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          Limpar filtros
        </button>
      </div>

      {}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disponível a partir de
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.availableFrom || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "availableFrom",
                    e.target.value || undefined,
                  )
                }
              />
            </div>

            {}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Preferências
              </label>
              <div className="space-y-1">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    checked={filters.allowsPets || false}
                    onChange={(e) =>
                      handleFilterChange(
                        "allowsPets",
                        e.target.checked || undefined,
                      )
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Aceita pets
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    checked={filters.allowsSmokers || false}
                    onChange={(e) =>
                      handleFilterChange(
                        "allowsSmokers",
                        e.target.checked || undefined,
                      )
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Permite fumar
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    checked={filters.allowsParties || false}
                    onChange={(e) =>
                      handleFilterChange(
                        "allowsParties",
                        e.target.checked || undefined,
                      )
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Permite festas
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
