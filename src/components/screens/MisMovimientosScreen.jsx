// src/components/screens/MisMovimientosScreen.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { Fish, Car, Globe, User, Factory, Users, Heart, Leaf, Code, Briefcase } from 'lucide-react';
import Card from '@/components/ui/Card';
import MovementItem from '@/components/ui/MovementItem';
import { dataService } from '@/services/dataService';

// Icon mapping for different scopes
const iconMap = {
  Fish: Fish,
  Car: Car,
  Globe: Globe,
  User: User,
  Factory: Factory,
  Users: Users,
  Heart: Heart,
  Leaf: Leaf,
  Code: Code,
  Briefcase: Briefcase
};

export default function MisMovimientosScreen() {
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = async () => {
    try {
      // Get movements for current user (hardcoded as '1' for Juan)
      const userMovements = await dataService.getUserMovements('1');
      setMovements(userMovements);
    } catch (error) {
      console.error('Error loading movements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Title */}
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800">Mis movimientos</h1>
      </div>

      {/* Movements List */}
      <div className="px-4 pb-6">
        <div className="space-y-0">
          {movements.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-600">No hay movimientos registrados</p>
            </Card>
          ) : (
            movements.map((movement) => {
              const ScopeIcon = iconMap[movement.scopeIcon] || User;
              
              return (
                <MovementItem 
                  key={movement.id}
                  transactionText={movement.text}
                  amount={movement.amount.toString()}
                  isPositive={movement.isPositive}
                  scopeIcon={<ScopeIcon size={14} className={getScopeIconColor(movement.scopeIcon)} />}
                  scopeLabel={movement.scopeLabel}
                  scopePosition="left"
                  percentage={movement.reason}
                  alignment={movement.alignment}
                  timestamp={movement.timestamp}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

// Helper function to get icon color based on scope
function getScopeIconColor(iconName) {
  const colorMap = {
    Fish: 'text-blue-600',
    Car: 'text-gray-600',
    Globe: 'text-green-600',
    User: 'text-gray-600',
    Factory: 'text-purple-600',
    Users: 'text-purple-600',
    Heart: 'text-red-600',
    Leaf: 'text-green-600',
    Code: 'text-emerald-600',
    Briefcase: 'text-gray-600'
  };
  
  return colorMap[iconName] || 'text-gray-600';
}