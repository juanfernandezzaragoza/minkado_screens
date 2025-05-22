"use client"; // This is needed for client-side interactivity

import React from 'react';
import { 
  TrendingUp, 
  FileText, 
  Clock, 
  Search, 
  PlusCircle, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Fish, 
  Megaphone, 
  Gavel 
} from 'lucide-react';
import Card from '@/components/ui/Card';
import ActionButton from '@/components/ui/ActionButton';
import ActionItem from '@/components/ui/ActionItem';
import SectionTitle from '@/components/ui/SectionTitle';
import ListItem from '@/components/ui/ListItem';
import { theme } from '@/styles/theme';

export default function HomeScreen() {
  return (
    <>
      {/* Account Overview Card */}
      <div className="m-4">
        <Card>
          <div className="p-5">
            <div className="text-gray-500 text-sm mb-1">Cuenta: juan.mk</div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold mr-1">₭ 26,950</span>
              <span className="text-sm text-gray-500 align-top">.81</span>
            </div>
            <div className="flex justify-end items-center text-xs mt-1">
              <ArrowUpCircle size={14} className="text-green-500 mr-1" />
              <div className="text-green-600 font-medium">₭ 25</div>
              <div className="ml-1 text-gray-500">desde la última vez</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-4 px-4 pb-6 text-center text-xs gap-4">
        <ActionButton 
          icon={<div className="text-blue-600 font-bold text-lg">IN</div>} 
          label="Ingresar"
          bgColor={theme.colors.primary.light}
        />
        <ActionButton 
          icon={<div className="text-red-600 font-bold text-lg">TR</div>} 
          label="Transferir"
          bgColor={theme.colors.danger.light}
        />
        <ActionButton 
          icon={<div className="text-green-600 font-bold text-lg">EX</div>} 
          label="Extraer"
          bgColor={theme.colors.success.light}
        />
        <ActionButton 
          icon={<Clock size={24} className="text-purple-600" />} 
          label="Movimientos"
          bgColor={theme.colors.secondary.light}
        />
      </div>

      {/* Secondary Actions Cards */}
      <div className="px-4 pb-6">
        <Card className="p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Acciones</h3>
          <div className="grid grid-cols-2 gap-4">
            <ActionItem 
              icon={<Megaphone size={20} className="text-gray-700" />}
              label="Reportar acto"
            />
            <ActionItem 
              icon={<Gavel size={20} className="text-gray-700" />}
              label="Validar actos"
            />
            <ActionItem 
              icon={<FileText size={20} className="text-gray-700" />}
              label="Describir acción"
            />
            <ActionItem 
              icon={<Clock size={20} className="text-gray-700" />}
              label="Historial"
            />
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Minkas</h3>
          <div className="grid grid-cols-2 gap-4">
            <ActionItem 
              icon={<Search size={20} className="text-gray-700" />}
              label="Buscar Minkas"
            />
            <ActionItem 
              icon={<PlusCircle size={20} className="text-blue-700" />}
              label="Nueva Minka"
              highlight={true}
            />
          </div>
        </Card>
      </div>

      {/* Section Title */}
      <SectionTitle 
        title="MIS MINKAS" 
        actionText="Ver todas" 
        onAction={() => console.log('Ver todas clicked')} 
      />

      {/* Minka List in Card */}
      <div className="px-4 pb-6">
        <Card>
          {/* Argentina - Parent community */}
          <ListItem 
            icon={
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center overflow-hidden">
                <div className="absolute w-8 h-8 flex flex-col">
                  <div className="flex-1 bg-blue-500"></div>
                  <div className="flex-1 bg-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-blue-500"></div>
                </div>
              </div>
            }
            title="ARGENTINA"
            subtitle="2,000 miembros"
            value="₭ 36"
            isPositive={false}
            indentLevel={0}
            minkaId="argentina"
          />
          
          {/* Recoleta - Child of Argentina */}
          <ListItem 
            icon={
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-xl">
                😊
              </div>
            }
            title="RECOLETA"
            subtitle="42 miembros"
            value="₭ 51"
            isPositive={false}
            indentLevel={1}
            minkaId="recoleta"
          />
          
          {/* Pescadores - Child of Argentina */}
          <ListItem 
            icon={
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Fish size={22} className="text-blue-700" />
              </div>
            }
            title="PESCADORES"
            subtitle="85 miembros"
            value="₭ 22"
            isPositive={true}
            indentLevel={1}
            minkaId="pescadores"
          />
          
          {/* Atuneros - Child of Pescadores */}
          <ListItem 
            icon={
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Fish size={20} className="text-blue-600" />
              </div>
            }
            title="Atuneros"
            subtitle="12 miembros"
            value="₭ 100"
            isPositive={true}
            indentLevel={2}
            minkaId="atuneros"
          />
          
          {/* New parent Minka: Causas populares */}
          <ListItem 
            icon={
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="text-purple-700 font-bold text-lg">CP</span>
              </div>
            }
            title="CAUSAS POPULARES"
            subtitle="320 miembros"
            value="₭ 75"
            isPositive={false}
            indentLevel={0}
            minkaId="causas-populares"
          />
          
          {/* Ambientalismo - Child of Causas populares */}
          <ListItem 
            icon={
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-xl">
                🌱
              </div>
            }
            title="Ambientalismo"
            subtitle="185 miembros"
            value="₭ 40"
            isPositive={false}
            indentLevel={1}
            minkaId="ambientalismo"
          />
          
          {/* Networkismo - Child of Causas populares */}
          <ListItem 
            icon={
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl">
                🌐
              </div>
            }
            title="Networkismo"
            subtitle="135 miembros"
            value="₭ 35"
            isPositive={true}
            indentLevel={1}
            minkaId="networkismo"
          />

          {/* Total */}
          <ListItem 
            title="TOTAL"
            value="₭ 6"
            isPositive={true}
            isTotal={true}
          />
        </Card>
      </div>
    </>
  );
}