"use client";

import React from 'react';
import { 
  Fish, 
  LogOut,
  UserPlus,
  MapPin,
  ShoppingBag,
  Baby,
  Plus,
  Globe
} from 'lucide-react';
import Card from '@/components/ui/Card';
import ActionItem from '@/components/ui/ActionItem';
import SectionTitle from '@/components/ui/SectionTitle';
import ActionRow from '@/components/ui/ActionRow';
import MinkaListItem from '@/components/ui/MinkaListItem';
import CreateMinkaButton from '@/components/ui/CreateMinkaButton';

export default function PescadoresDetailScreen() {
  return (
    <>
      {/* Pescadores Title Card */}
      <div className="m-4">
        <Card>
          <div className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
                <Fish size={28} className="text-blue-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">PESCADORES</h1>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Fomentar la pesca nacional segura y sustentable.
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
            />
            <ActionItem 
              icon={<UserPlus size={20} className="text-blue-700" />}
              label="Invitar miembro"
              highlight={true}
            />
          </div>
        </Card>
      </div>

      {/* Valued Actions Section */}
      <SectionTitle 
        title="Acciones valoradas" 
        actionText="Ver todas" 
        onAction={() => console.log('Ver todas acciones')} 
      />

      <div className="px-4 pb-4">
        <Card>
          <ActionRow 
            icon={<MapPin size={18} className="text-gray-600" />}
            title="Emprender viaje"
            subtitle="Salir de pesca con barco mediano a mar abierto"
            value="+ ₭ 500"
            valueColor="text-green-600"
            actionId="emprender-viaje"
            scopeIcon={<Fish size={14} className="text-blue-600" />}
            scopeLabel="Pescadores"
            miVoto="-0.5₭"
            resultado="-0.7₭"
          />
          <ActionRow 
            icon={<ShoppingBag size={18} className="text-gray-600" />}
            title="Vender pescado"
            subtitle="Comercializar la pesca del día en el mercado local"
            value="⇆ 20%"
            valueColor="text-gray-600"
            actionId="vender-pescado"
            scopeIcon={<Fish size={14} className="text-blue-600" />}
            scopeLabel="Pescadores"
            miVoto="0₭"
            resultado="+0.2₭"
          />
          <ActionRow 
            icon={<Baby size={18} className="text-gray-600" />}
            title="Pescar trucha bebé"
            subtitle="Perjudicar la sustentabilidad del ecosistema marino"
            value="- ₭ 200"
            valueColor="text-red-600"
            actionId="pescar-trucha-bebe"
            scopeIcon={<Globe size={14} className="text-green-600" />}
            scopeLabel="Global"
            miVoto="-0.5₭"
            resultado="-0.7₭"
          />
        </Card>
      </div>

      {/* Ver todas las acciones button */}
      <div className="px-4 pb-4">
        <button 
          onClick={() => console.log('Ver todas las acciones valoradas por pescadores')}
          className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium border border-gray-300"
        >
          Ver todas las acciones valoradas por pescadores
        </button>
      </div>

      {/* Sub-Minkas Section */}
      <SectionTitle 
        title="Minkas en Pescadores" 
        actionText="Ver todas"
        onAction={() => console.log('Ver todas las minkas')}
      />

      <div className="px-4 pb-4">
        <Card>
          <MinkaListItem 
            icon={
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Fish size={20} className="text-blue-600" />
              </div>
            }
            title="Atuneros"
            subtitle="12 miembros"
            value="₭ 100"
            isPositive={true}
            isMember={true}
          />
          
          <MinkaListItem 
            icon={
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Fish size={20} className="text-blue-600" />
              </div>
            }
            title="Agua dulce"
            subtitle="50 miembros"
            value="₭ 22"
            isPositive={true}
            isMember={false}
          />
          
          <MinkaListItem 
            icon={
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Fish size={20} className="text-blue-600" />
              </div>
            }
            title="Truchas"
            subtitle="35 miembros"
            value="₭ 12"
            isPositive={false}
            isMember={false}
          />
        </Card>
      </div>

      {/* Ver todas las minkas button */}
      <div className="px-4 pb-6">
        <button 
          onClick={() => console.log('Ver todas las minkas en pescadores')}
          className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium border border-gray-300"
        >
          Ver todas las minkas en pescadores
        </button>
      </div>
    </>
  );
}