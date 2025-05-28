"use client";

import React from 'react';
import { Fish, MapPin, ShoppingBag, Baby } from 'lucide-react';
import Card from '@/components/ui/Card';
import SectionTitle from '@/components/ui/SectionTitle';
import ActionRow from '@/components/ui/ActionRow';
import CaseItem from '@/components/ui/CaseItem';
import ValuationChart from '@/components/ui/ValuationChart';

export default function EmprenderViajeScreen() {
  return (
    <>
      {/* Action Description Card */}
      <div className="m-4">
        <Card>
          <div className="p-5">
            <h1 className="text-xl font-bold text-gray-800 mb-3">Emprender viaje</h1>
            <p className="text-gray-700 text-sm leading-relaxed">
              Salir de pesca con barco mediano a mar abierto.
            </p>
          </div>
        </Card>
      </div>

      {/* Applies To Section */}
      <div className="px-4 pb-4">
        <Card>
          <div className="p-4 flex items-center">
            <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center mr-3">
              <Fish size={16} className="text-blue-700" />
            </div>
            <span className="text-gray-800 font-medium">Aplica a Pescadores</span>
          </div>
        </Card>
      </div>

      {/* Current Valuation */}
      <div className="px-4 pb-4">
        <Card className="p-4">
          <ValuationChart 
            title="Valoración actual"
            currentValue="+₭12"
            avgValue="+₭10"
            totalImpact="+₭500"
            showValuationInfo={true}
            actionId="emprender-viaje"
          />
        </Card>
      </div>

      {/* Time-based Valuation */}
      <div className="px-4 pb-4">
        <Card className="p-4">
          <ValuationChart 
            title="Valoración en el tiempo"
            showTimeChart={true}
            showValuationInfo={false}
          />
        </Card>
      </div>

      {/* Recent Cases Section */}
      <SectionTitle 
        title="Últimos casos" 
        actionText="Ver todos" 
        onAction={() => console.log('Ver todos casos')} 
      />

      <div className="px-4 pb-4">
        <Card>
          <CaseItem 
            name="Juan"
            time="11:36"
            date="10/2/2025"
            value="₭300"
            isPositive={true}
          />
          <CaseItem 
            name="Vanna"
            time="10:02"
            date="11/1/2025"
            value="₭200"
            isPositive={true}
          />
          <CaseItem 
            name="Juan"
            time="10:00"
            date="25/02/2023"
            value="₭10"
            isPositive={true}
          />
        </Card>
      </div>

      {/* Details Section */}
      <SectionTitle title="Detalles" />

      <div className="px-4 pb-6">
        <Card>
          <div className="p-5">
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Ubicación</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li className="flex items-start">
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  Salir de Puerto Alegro o Río de La Plata.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  Embarcación pesquera de más de 8 metros.
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  Tripulación de 8 pescadores con experiencia.
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Consideraciones</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li className="flex items-start">
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  Respetar las zonas de pesca autorizadas.
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}