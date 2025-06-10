"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Fish, Users, Globe, Heart, Code, Car } from 'lucide-react';
import Card from '@/components/ui/Card';
import ActionRow from '@/components/ui/ActionRow';
import { dataService } from '@/services/dataService';

// Icon mapping
const iconMap = {
  Fish,
  Users,
  Globe,
  Heart,
  Code,
  Car,
  // Add more as needed
};

export default function MinkaValuationsScreen({ minkaId }) {
  const router = useRouter();
  
  const [minka, setMinka] = useState(null);
  const [actionsWithValuations, setActionsWithValuations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (minkaId) {
      loadMinkaData();
    } else {
      setError('No minka ID provided');
      setIsLoading(false);
    }
  }, [minkaId]);

  const loadMinkaData = async () => {
    try {
      const minkaData = await dataService.getMinka(minkaId);
      
      if (!minkaData) {
        setError(`Minka '${minkaId}' not found`);
        return;
      }
      
      const valuationsData = await dataService.getActionsWithValuations(minkaId);
      
      setMinka(minkaData);
      setActionsWithValuations(valuationsData || []);
      setError(null);
    } catch (error) {
      console.error('Error loading minka valuations:', error);
      setError(`Error loading data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewValuation = () => {
    router.push(`/valorar-nueva-accion?minka=${minkaId}`);
  };

  if (isLoading) {
    return (
      <div className="m-4">
        <Card className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando valoraciones...</p>
          <p className="text-xs text-gray-500 mt-2">Minka ID: {minkaId || 'undefined'}</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
        </Card>
      </div>
    );
  }

  if (!minka) {
    return (
      <div className="m-4">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Minka no encontrada</h2>
          <p className="text-gray-600 mb-4">La minka '{minkaId}' no existe.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
        </Card>
      </div>
    );
  }

  const MinkaIcon = iconMap[minka.icon] || iconMap.Users;

  return (
    <>
      {/* Title Card */}
      <div className="m-4">
        <Card>
          <div className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
                <MinkaIcon size={28} className={minka.iconColor || 'text-blue-600'} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Acciones valoradas</h1>
                <p className="text-gray-600">por {minka.name}</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Todas las acciones que {minka.name.toLowerCase()} ha valorado con karma.
            </p>
          </div>
        </Card>
      </div>

      {/* Create New Valuation Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleCreateNewValuation}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" />
          Valorar nueva acción para {minka.name}
        </button>
      </div>

      {/* Valuations List */}
      <div className="px-4 pb-6">
        {actionsWithValuations.length === 0 ? (
          <Card className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">No hay valoraciones</h3>
            <p className="text-gray-600 mb-4">
              {minka.name} aún no ha valorado ninguna acción.
            </p>
            <button
              onClick={handleCreateNewValuation}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Crear primera valoración
            </button>
          </Card>
        ) : (
          <Card>
            {actionsWithValuations.map((actionWithValuation, index) => (
              <ActionRow 
                key={actionWithValuation.id || index}
                action={actionWithValuation}
                valuation={actionWithValuation.valuation}
                minkaContext={minka}
              />
            ))}
          </Card>
        )}
      </div>

      {/* Footer Note */}
      {actionsWithValuations.length > 0 && (
        <div className="px-4 pb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Nota:</strong> Estas valoraciones se aplican cuando alguien realiza estas acciones. 
              Los miembros de {minka.name} contribuyen con el karma especificado.
            </p>
          </div>
        </div>
      )}
    </>
  );
}