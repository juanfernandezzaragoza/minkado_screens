"use client";

import React from 'react';
import { Fish, Car, Globe, User, Factory } from 'lucide-react';
import Card from '@/components/ui/Card';
import MovementItem from '@/components/ui/MovementItem';

export default function MisMovimientosScreen() {
  return (
    <>
      {/* Title */}
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800">Mis movimientos</h1>
      </div>

      {/* Movements List */}
      <div className="px-4 pb-6">
        <div className="space-y-0">
          {/* Giving due to pooling - LEFT ARROW */}
          <MovementItem 
            transactionText="← 20% a Pescadores"
            amount="30"
            isPositive={false}
            scopeIcon={<Fish size={14} className="text-blue-600" />}
            scopeLabel="Pescadores"
            scopePosition="left"
            percentage="Por vender pescado"
            alignment="left"
            timestamp="10:15"
          />

          {/* Not pooling - no arrow */}
          <MovementItem 
            transactionText="₭30 a Rubén"
            amount="30"
            isPositive={false}
            scopeIcon={<User size={14} className="text-gray-600" />}
            scopeLabel="Particular"
            scopePosition="left"
            percentage="Por poner música fuerte molestando a Juan"
            alignment="right"
            timestamp="09:42"
          />
          
          {/* Receiving due to pooling - RIGHT ARROW */}
          <MovementItem 
            transactionText="→ 70% de Automovilistas"
            amount="500"
            isPositive={true}
            scopeIcon={<Car size={14} className="text-gray-600" />}
            scopeLabel="Automovilistas"
            scopePosition="left"
            percentage="Por reparar mi auto"
            alignment="left"
            timestamp="14:30"
          />
          
          {/* Giving due to pooling - LEFT ARROW */}
          <MovementItem 
            transactionText="← 70% a Germán"
            amount="30"
            isPositive={false}
            scopeIcon={<Car size={14} className="text-gray-600" />}
            scopeLabel="Automovilistas"
            scopePosition="left"
            percentage="Por reparar su auto"
            alignment="right"
            timestamp="11:20"
          />
          
          {/* NEW ITEM - Pymes argentinas */}
          <MovementItem 
            transactionText="₭500 por dar bicicleta a Juan"
            amount="500"
            isPositive={true}
            scopeIcon={<Factory size={14} className="text-purple-600" />}
            scopeLabel="Pymes argentinas"
            scopePosition="left"
            percentage="Aplicable a Pymes argentinas"
            alignment="left"
            timestamp="12:30"
          />
          
          {/* Receiving due to pooling - RIGHT ARROW */}
          <MovementItem 
            transactionText="→ 20% de Roberto"
            amount="50"
            isPositive={true}
            scopeIcon={<Fish size={14} className="text-blue-600" />}
            scopeLabel="Pescadores"
            scopePosition="left"
            percentage="Por su venta de pescado"
            alignment="right"
            timestamp="16:45"
          />
          
          {/* Not pooling - no arrow */}
          <MovementItem 
            transactionText="₭500 por emprender un viaje"
            amount="500"
            isPositive={true}
            scopeIcon={<Fish size={14} className="text-blue-600" />}
            scopeLabel="Pescadores"
            scopePosition="left"
            percentage="Aplicable a pescadores"
            alignment="left"
            timestamp="08:00"
          />
          
          {/* Not pooling - no arrow - FIXED NEGATIVE SIGN */}
          <MovementItem 
            transactionText="-₭20 por pescar trucha bebé"
            amount="20"
            isPositive={false}
            scopeIcon={<Globe size={14} className="text-green-600" />}
            scopeLabel="Global"
            scopePosition="left"
            percentage="Aplicable a todos"
            alignment="left"
            timestamp="13:55"
          />
        </div>
      </div>
    </>
  );
}