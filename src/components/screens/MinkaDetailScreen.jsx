"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  LogOut,
  UserPlus,
  Plus,
  // Dynamic icon imports based on icon name
  Fish,
  Users,
  Globe,
  MapPin,
  ShoppingBag,
  Baby
} from 'lucide-react';
import Card from '@/components/ui/Card';
import ActionItem from '@/components/ui/ActionItem';
import SectionTitle from '@/components/ui/SectionTitle';
import ActionRow from '@/components/ui/ActionRow';
import MinkaListItem from '@/components/ui/MinkaListItem';

// Icon mapping helper
const iconMap = {
  Fish: Fish,
  Users: Users,
  Globe: Globe,
  MapPin: MapPin,
  ShoppingBag: ShoppingBag,
  Baby: Baby,
  // Add more icons as needed
};

export default function MinkaDetailScreen({ minka, actions, subMinkas }) {
  const router = useRouter();
  
  const MinkaIcon = iconMap[minka.icon] || Fish;
  
  const handleCreateSubminka = () => {
    router.push(`/crear-minka?parent=${minka.id}`);
  };
  
  const handleInviteMember = () => {
    // TODO: Implement invite functionality
    console.log('Invite member to', minka.id);
  };
  
  const handleLeaveMinka = () => {
    // TODO: Implement leave functionality
    console.log('Leave minka', minka.id);
  };

  const handleViewAllActions = () => {
    router.push(`/minka/${minka.id}/valuations`);
  };

  return (
    <>
      {/* Minka Title Card */}
      <div className="m-4">
        <Card>
          <div className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
                <MinkaIcon size={28} className={minka.iconColor} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{minka.name}</h1>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {minka.description}
            </p>
          </div>
        </Card>
      </div>

      {/* Participation Section */}
      <div className="px-4 pb-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Participación</h3>
          <div className="grid grid-cols-2 gap-4">
            <ActionItem 
              icon={<LogOut size={20} className="text-gray-700" />}
              label="Abandonar minka"
              onClick={handleLeaveMinka}
            />
            <ActionItem 
              icon={<UserPlus size={20} className="text-blue-700" />}
              label="Invitar miembro"
              highlight={true}
              onClick={handleInviteMember}
            />
          </div>
        </Card>
      </div>

      {/* Valued Actions Section */}
      {actions && actions.length > 0 && (
        <>
          <SectionTitle 
            title="Acciones valoradas" 
            actionText="Ver todas" 
            onAction={handleViewAllActions} 
          />

          <div className="px-4 pb-4">
            <Card>
              {actions.slice(0, 3).map((actionWithValuation, index) => (
                <ActionRow 
                  key={actionWithValuation.id || index}
                  action={actionWithValuation}
                  valuation={actionWithValuation.valuation}
                  minkaContext={minka}
                />
              ))}
            </Card>
          </div>

          <div className="px-4 pb-4">
            <button 
              onClick={handleViewAllActions}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium border border-gray-300"
            >
              Ver todas las acciones valoradas por {minka.name.toLowerCase()}
            </button>
          </div>
        </>
      )}

      {/* No Actions Message */}
      {(!actions || actions.length === 0) && (
        <>
          <SectionTitle 
            title="Acciones valoradas" 
            actionText="Crear primera" 
            onAction={() => router.push(`/valorar-nueva-accion?minka=${minka.id}`)} 
          />

          <div className="px-4 pb-4">
            <Card className="p-6 text-center">
              <h3 className="font-medium text-gray-800 mb-2">No hay acciones valoradas</h3>
              <p className="text-gray-600 text-sm mb-4">
                {minka.name} aún no ha valorado ninguna acción.
              </p>
              <button 
                onClick={() => router.push(`/valorar-nueva-accion?minka=${minka.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Valorar primera acción
              </button>
            </Card>
          </div>
        </>
      )}

      {/* Sub-Minkas Section */}
      {subMinkas && subMinkas.length > 0 && (
        <>
          <SectionTitle 
            title={`Minkas en ${minka.name}`} 
            actionText="Ver todas"
            onAction={() => console.log('Ver todas las minkas')}
          />

          <div className="px-4 pb-4">
            <Card>
              {subMinkas.map((subMinka) => {
                const SubMinkaIcon = iconMap[subMinka.icon] || Fish;
                
                return (
                  <MinkaListItem 
                    key={subMinka.id}
                    icon={
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <SubMinkaIcon size={20} className={subMinka.iconColor} />
                      </div>
                    }
                    title={subMinka.name}
                    subtitle={`${subMinka.members} miembros`}
                    value={subMinka.balance}
                    isPositive={subMinka.isPositive}
                    isMember={true} // TODO: Check actual membership
                    onClick={() => router.push(`/minka/${subMinka.id}`)}
                  />
                );
              })}
              
              {/* Create new subminka button */}
              <div 
                className="p-4 border-t border-gray-100 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                onClick={handleCreateSubminka}
              >
                <Plus size={20} className="text-blue-600 mr-2" />
                <span className="text-blue-600 font-medium">Crear nueva minka en {minka.name}</span>
              </div>
            </Card>
          </div>

          <div className="px-4 pb-6">
            <button 
              onClick={() => console.log('Ver todas las minkas')}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium border border-gray-300"
            >
              Ver todas las minkas en {minka.name.toLowerCase()}
            </button>
          </div>
        </>
      )}

      {/* Create Sub-Minka Section - Always show if no sub-minkas */}
      {(!subMinkas || subMinkas.length === 0) && (
        <div className="px-4 pb-6">
          <Card className="p-6 text-center">
            <h3 className="font-medium text-gray-800 mb-2">Crear primera sub-minka</h3>
            <p className="text-gray-600 text-sm mb-4">
              Podés crear minkas más específicas dentro de {minka.name}.
            </p>
            <button 
              onClick={handleCreateSubminka}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Crear sub-minka
            </button>
          </Card>
        </div>
      )}
    </>
  );
}