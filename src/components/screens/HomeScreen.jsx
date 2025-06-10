// src/components/screens/HomeScreen.jsx - Updated version
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Gavel,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  ArrowLeftRight,
  Users,
  Globe,
  Heart,
  // Import more icons as needed
} from 'lucide-react';
import Card from '@/components/ui/Card';
import ActionButton from '@/components/ui/ActionButton';
import ActionItem from '@/components/ui/ActionItem';
import SectionTitle from '@/components/ui/SectionTitle';
import ListItem from '@/components/ui/ListItem';
import { theme } from '@/styles/theme';
import { dataService } from '@/services/dataService';

// Icon mapping
const iconMap = {
  Fish: Fish,
  Users: Users,
  Globe: Globe,
  Heart: Heart,
  // Add more mappings as needed
};

export default function HomeScreen() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userMinkas, setUserMinkas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    loadUserData();
  }, []);
  
  const loadUserData = async () => {
    try {
      const [user, minkas] = await Promise.all([
        dataService.getCurrentUser(),
        dataService.getUserMinkas('1') // Current user ID
      ]);
      
      setUserData(user);
      setUserMinkas(organizeMinkasHierarchy(minkas));
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Organize minkas in hierarchy for display
  const organizeMinkasHierarchy = (minkas) => {
    const organized = [];
    const minkaMap = {};
    
    // Create map
    minkas.forEach(minka => {
      minkaMap[minka.id] = { ...minka, children: [] };
    });
    
    // Build hierarchy
    minkas.forEach(minka => {
      if (!minka.parentId) {
        organized.push(minkaMap[minka.id]);
      } else if (minkaMap[minka.parentId]) {
        minkaMap[minka.parentId].children.push(minkaMap[minka.id]);
      }
    });
    
    return organized;
  };
  
  // Calculate total balance
  const calculateTotalBalance = () => {
    return userMinkas.reduce((total, minka) => {
      const minkaBalance = parseFloat(minka.balance.replace('₭', '').trim());
      const childrenBalance = minka.children.reduce((childTotal, child) => {
        return childTotal + parseFloat(child.balance.replace('₭', '').trim());
      }, 0);
      return total + minkaBalance + childrenBalance;
    }, 0);
  };
  
  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };
  
  const renderMinkaItem = (minka, indentLevel = 0) => {
    const MinkaIcon = iconMap[minka.icon] || Users;
    const items = [];
    
    // Add the minka itself
    items.push(
      <ListItem 
        key={minka.id}
        icon={
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <MinkaIcon size={22} className={minka.iconColor} />
          </div>
        }
        title={minka.name}
        subtitle={`${minka.members} miembros`}
        value={minka.balance}
        isPositive={minka.isPositive}
        indentLevel={indentLevel}
        minkaId={minka.id}
        onClick={() => router.push(`/minka/${minka.id}`)}
      />
    );
    
    // Add children
    if (minka.children && minka.children.length > 0) {
      minka.children.forEach(child => {
        items.push(...renderMinkaItem(child, indentLevel + 1));
      });
    }
    
    return items;
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
      {/* Account Overview Card */}
      <div className="m-4">
        <Card>
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="text-gray-500 text-sm">Cuenta: {userData?.username}</div>
              <div 
                className="text-sm text-blue-600 cursor-pointer"
                onClick={() => router.push('/mis-movimientos')}
              >
                Ver mis movimientos &gt;
              </div>
            </div>
            
            <div className="flex items-baseline mb-4">
              {isBalanceVisible ? (
                <>
                  <span className="text-3xl font-bold mr-1">
                    ₭ {userData?.balance.toLocaleString('es-AR')}
                  </span>
                  <span className="text-lg text-gray-500 self-start">
                    {(userData?.balance % 1).toFixed(2).substring(2)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold">₭ ••••••</span>
              )}
              <button 
                onClick={toggleBalanceVisibility}
                className="ml-2 text-gray-400 hover:text-gray-600 self-baseline"
              >
                {isBalanceVisible ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            
            <div className="flex justify-center items-center text-xs">
              <ArrowUpCircle size={14} className="text-green-500 mr-1" />
              <div className="text-green-600 font-medium">₭ {userData?.lastChange || 0}</div>
              <div className="ml-1 text-gray-500">desde la última vez</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-4 px-4 pb-6 text-center text-xs gap-4">
        <ActionButton 
          icon={<ArrowUp size={24} className="text-green-600" />} 
          label="Depositar"
          bgColor={theme.colors.success.light}
        />
        <ActionButton 
          icon={<ArrowRight size={24} className="text-blue-600" />} 
          label="Transferir"
          bgColor={theme.colors.primary.light}
          onClick={() => router.push('/transferir')}
        />
        <ActionButton 
          icon={<ArrowLeftRight size={24} className="text-purple-600" />} 
          label="Pactar"
          bgColor={theme.colors.secondary.light}
          onClick={() => router.push('/pactar')}
        />
        <ActionButton 
          icon={<ArrowDown size={24} className="text-red-600" />} 
          label="Extraer"
          bgColor={theme.colors.danger.light}
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
              onClick={() => router.push('/reportar-acto')}
            />
            <ActionItem 
              icon={<Gavel size={20} className="text-gray-700" />}
              label="Validar acto"
              onClick={() => router.push('/validar-acto')}
            />
            <ActionItem 
              icon={<FileText size={20} className="text-gray-700" />}
              label="Describir acción"
              onClick={() => router.push('/describir-accion')}
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
              onClick={() => router.push('/crear-minka')}
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
          {/* Render hierarchical minkas */}
          {userMinkas.map(minka => renderMinkaItem(minka))}
          
          {/* Total */}
          <ListItem 
            title="TOTAL"
            value={`₭ ${calculateTotalBalance().toFixed(0)}`}
            isPositive={true}
            isTotal={true}
          />
        </Card>
      </div>
    </>
  );
}

