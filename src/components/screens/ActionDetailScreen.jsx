// src/components/screens/ActionDetailScreen.jsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Fish, 
  MapPin, 
  ShoppingBag, 
  Baby, 
  Globe, 
  Users, 
  Heart,
  Leaf,
  Car,
  Briefcase,
  Home,
  ArrowLeftRight
} from 'lucide-react';
import Card from '@/components/ui/Card';
import SectionTitle from '@/components/ui/SectionTitle';
import CaseItem from '@/components/ui/CaseItem';
import ValuationChart from '@/components/ui/ValuationChart';
import MarkdownViewer from '@/components/shared/MarkdownViewer';

// Extended icon mapping for all possible icons
const iconMap = {
  Fish: Fish,
  MapPin: MapPin,
  ShoppingBag: ShoppingBag,
  Baby: Baby,
  Globe: Globe,
  Users: Users,
  Heart: Heart,
  Leaf: Leaf,
  Car: Car,
  Briefcase: Briefcase,
  Home: Home,
  ArrowLeftRight: ArrowLeftRight,
};

export default function ActionDetailScreen({ action }) {
  const router = useRouter();
  
  // Get the appropriate icons
  const ActionIcon = iconMap[action.icon] || MapPin;
  const ScopeIcon = action.scope === 'global' ? Globe : (iconMap[action.scopeIcon] || Fish);
  
  // Parse the valuation to determine color
  const getValuationColor = (valuation) => {
    if (!valuation) return 'text-gray-600';
    if (valuation.startsWith('+')) return 'text-green-600';
    if (valuation.startsWith('-')) return 'text-red-600';
    return 'text-gray-600'; // For exchange types like "⇆ 20%"
  };

  return (
    <>
      {/* Action Description Card */}
      <div className="m-4">
        <Card>
          <div className="p-5">
            <h1 className="text-xl font-bold text-gray-800 mb-3">{action.name}</h1>
            <p className="text-gray-700 text-sm leading-relaxed">
              {action.description}
            </p>
          </div>
        </Card>
      </div>

      {/* Applies To Section */}
      <div className="px-4 pb-4">
        <Card>
          <div className="p-4 flex items-center">
            <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center mr-3">
              <ScopeIcon size={16} className={action.scope === 'global' ? 'text-green-600' : 'text-blue-700'} />
            </div>
            <span className="text-gray-800 font-medium">
              Aplica a {action.scope === 'global' ? 'Todos' : action.appliesTo?.join(', ') || 'Comunidad'}
            </span>
          </div>
        </Card>
      </div>

      {/* Current Valuation - Only show if it's a karma value (not exchange) */}
      {!action.currentValuation?.includes('⇆') && (
        <div className="px-4 pb-4">
          <Card className="p-4">
            <ValuationChart 
              title="Valoración actual"
              currentValue={action.currentValuation}
              avgValue={action.medianValuation}
              totalImpact={action.totalImpact}
              showValuationInfo={true}
              actionId={action.id}
            />
          </Card>
        </div>
      )}

      {/* Exchange Information - Only show for exchange type actions */}
      {action.currentValuation?.includes('⇆') && (
        <div className="px-4 pb-4">
          <Card className="p-4">
            <div className="flex items-center mb-3">
              <ArrowLeftRight size={20} className="text-purple-600 mr-2" />
              <h3 className="font-medium text-gray-800">Intercambio automático</h3>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-purple-800">
                Esta acción activa un intercambio de <strong>{action.currentValuation}</strong> entre los participantes del pacto.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Time-based Valuation - Only show if not exchange type */}
      {!action.currentValuation?.includes('⇆') && (
        <div className="px-4 pb-4">
          <Card className="p-4">
            <ValuationChart 
              title="Valoración en el tiempo"
              showTimeChart={true}
              showValuationInfo={false}
            />
          </Card>
        </div>
      )}

      {/* Recent Cases Section */}
      {action.recentCases && action.recentCases.length > 0 && (
        <>
          <SectionTitle 
            title="Últimos casos" 
            actionText="Ver todos" 
            onAction={() => console.log('Ver todos casos')} 
          />

          <div className="px-4 pb-4">
            <Card>
              {action.recentCases.map((caseItem, index) => (
                <CaseItem 
                  key={index}
                  name={caseItem.name}
                  time={caseItem.time}
                  date={caseItem.date}
                  value={caseItem.value}
                  isPositive={caseItem.isPositive}
                />
              ))}
            </Card>
          </div>
        </>
      )}

      {/* Full Description Section */}
      {action.fullDescription && (
        <>
          <SectionTitle title="Descripción completa" />
          
          <div className="px-4 pb-4">
            <Card>
              <div className="p-5">
                <div className="prose prose-sm max-w-none">
                  <MarkdownViewer content={action.fullDescription} />
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Details Section */}
      {action.details && (
        <>
          <SectionTitle title="Detalles" />

          <div className="px-4 pb-6">
            <Card>
              <div className="p-5">
                {/* Ubicación */}
                {action.details.ubicacion && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">Ubicación</h4>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4">
                      {action.details.ubicacion.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Consideraciones */}
                {action.details.consideraciones && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">Consideraciones</h4>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4">
                      {action.details.consideraciones.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Condiciones */}
                {action.details.condiciones && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">Condiciones</h4>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4">
                      {action.details.condiciones.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Impacto */}
                {action.details.impacto && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Impacto</h4>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4">
                      {action.details.impacto.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="px-4 pb-6 space-y-3">
        {/* Report this action */}
        <button 
          onClick={() => router.push(`/reportar-acto?action=${action.id}`)}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Reportar que alguien hizo esta acción
        </button>
        
        {/* Valorate this action - only if not exchange type */}
        {!action.currentValuation?.includes('⇆') && (
          <button 
            onClick={() => router.push(`/valorar-accion?action=${action.id}`)}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            Cambiar mi valoración
          </button>
        )}
        
        {/* Create pact - only for exchange type actions */}
        {action.currentValuation?.includes('⇆') && (
          <button 
            onClick={() => router.push(`/pactar?action=${action.id}`)}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            Crear pacto con esta acción
          </button>
        )}
      </div>
    </>
  );
}