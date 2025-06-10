// src/components/screens/ActionDetailScreen.jsx - Updated for pure actions
"use client";

import React, { useState, useEffect } from 'react';
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
  ArrowLeftRight,
  Code,
  FileText
} from 'lucide-react';
import Card from '@/components/ui/Card';
import SectionTitle from '@/components/ui/SectionTitle';
import CaseItem from '@/components/ui/CaseItem';
import ValuationChart from '@/components/ui/ValuationChart';
import MarkdownViewer from '@/components/shared/MarkdownViewer';
import { dataService } from '@/services/dataService';

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
  Code: Code,
  FileText: FileText,
};

export default function ActionDetailScreen({ action, minkaContext = null }) {
  const router = useRouter();
  const [valuation, setValuation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Default to pescadores if no minka context provided
  const currentMinkaId = minkaContext?.id || 'pescadores';
  
  useEffect(() => {
    loadValuation();
  }, [action.id, currentMinkaId]);

  const loadValuation = async () => {
    try {
      const actionValuation = await dataService.getActionValuation(currentMinkaId, action.id);
      setValuation(actionValuation);
    } catch (error) {
      console.error('Error loading valuation:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get the appropriate icons
  const ActionIcon = iconMap[action.icon] || MapPin;
  
  // Determine scope icon based on valuation
  let ScopeIcon, scopeLabel, scopeIconColor;
  
  if (valuation) {
    if (valuation.associatedMinka === 'global') {
      ScopeIcon = Globe;
      scopeLabel = 'Global';
      scopeIconColor = 'text-green-600';
    } else if (valuation.complement) {
      // For complement, show the icon with indication
      ScopeIcon = iconMap[minkaContext?.icon] || Fish;
      scopeLabel = `No ${valuation.associatedMinka}`;
      scopeIconColor = 'text-red-600';
    } else {
      ScopeIcon = iconMap[minkaContext?.icon] || Fish;
      scopeLabel = valuation.associatedMinka;
      scopeIconColor = minkaContext?.iconColor || 'text-blue-600';
    }
  } else {
    // Default if no valuation
    ScopeIcon = Fish;
    scopeLabel = 'No valorado';
    scopeIconColor = 'text-gray-400';
  }

  // Format valuation value
  let valueDisplay, valueColor;
  
  if (valuation) {
    if (valuation.isExchange) {
      valueDisplay = `⇆ ${valuation.exchangePercentage}%`;
      valueColor = 'text-gray-600';
    } else {
      const isPositive = valuation.value >= 0;
      valueDisplay = `${isPositive ? '+' : ''}₭${Math.abs(valuation.value)}`;
      valueColor = isPositive ? 'text-green-600' : 'text-red-600';
    }
  } else {
    valueDisplay = 'No valorado';
    valueColor = 'text-gray-400';
  }

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

      {/* Applies To Section - Only show if there's a valuation */}
      {valuation && (
        <div className="px-4 pb-4">
          <Card>
            <div className="p-4 flex items-center">
              <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center mr-3">
                <ScopeIcon size={16} className={scopeIconColor} />
              </div>
              <span className="text-gray-800 font-medium">
                Aplica a {scopeLabel}
                {valuation.complement && ' (complemento)'}
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* Current Valuation - Only show if there's a valuation and it's not exchange */}
      {valuation && !valuation.isExchange && (
        <div className="px-4 pb-4">
          <Card className="p-4">
            <ValuationChart 
              title="Valoración actual"
              currentValue={valueDisplay}
              avgValue={`+₭${valuation.medianValue}`}
              totalImpact={`+₭${valuation.totalImpact}`}
              showValuationInfo={true}
              actionId={action.id}
              minkaId={currentMinkaId}
            />
          </Card>
        </div>
      )}

      {/* Exchange Information - Only show for exchange type actions */}
      {valuation && valuation.isExchange && (
        <div className="px-4 pb-4">
          <Card className="p-4">
            <div className="flex items-center mb-3">
              <ArrowLeftRight size={20} className="text-purple-600 mr-2" />
              <h3 className="font-medium text-gray-800">Intercambio automático</h3>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-purple-800">
                Esta acción activa un intercambio de <strong>{valueDisplay}</strong> entre los participantes del pacto.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Time-based Valuation - Only show if not exchange type */}
      {valuation && !valuation.isExchange && (
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

      {/* No Valuation Notice */}
      {!valuation && (
        <div className="px-4 pb-4">
          <Card className="p-4">
            <div className="text-center">
              <h3 className="font-medium text-gray-800 mb-2">No valorado por {minkaContext?.name || 'esta minka'}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {minkaContext?.name || 'Esta minka'} aún no ha establecido una valoración para esta acción.
              </p>
              <button 
                onClick={() => router.push(`/valorar-nueva-accion?minka=${currentMinkaId}&action=${action.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Crear valoración
              </button>
            </div>
          </Card>
        </div>
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
        
        {/* Valorate this action - only if there's a valuation and it's not exchange type */}
        {valuation && !valuation.isExchange && (
          <button 
            onClick={() => router.push(`/valorar-nueva-accion?minka=${currentMinkaId}&action=${action.id}`)}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            Cambiar valoración de {minkaContext?.name || 'esta minka'}
          </button>
        )}
        
        {/* Create pact - only for exchange type actions */}
        {valuation && valuation.isExchange && (
          <button 
            onClick={() => router.push(`/pactar?action=${action.id}`)}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            Crear pacto con esta acción
          </button>
        )}

        {/* Create valuation - only if no valuation exists */}
        {!valuation && (
          <button 
            onClick={() => router.push(`/valorar-nueva-accion?minka=${currentMinkaId}&action=${action.id}`)}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Crear valoración para {minkaContext?.name || 'esta minka'}
          </button>
        )}
      </div>
    </>
  );
}