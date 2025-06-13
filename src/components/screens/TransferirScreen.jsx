"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, User, ArrowRight, Minus } from 'lucide-react';
import Card from '@/components/ui/Card';
import FormField from '@/components/shared/FormField';
import SearchInput from '@/components/shared/SearchInput';
import { dataService } from '@/services/dataService';

export default function TransferirScreen() {
  const router = useRouter();
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [karmaAmount, setKarmaAmount] = useState('');
  const [motivo, setMotivo] = useState('');
  
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle user search
  const handleUserSearch = async (query) => {
    try {
      const results = await dataService.searchUsers(query);
      // Filter out current user (Juan)
      const filteredResults = results.filter(user => user.id !== '1');
      setUserSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
      setUserSearchResults([]);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUserSearchResults([]);
    
    // Clear error when user is selected
    if (errors.user) {
      setErrors(prev => ({ ...prev, user: '' }));
    }
  };

  // Handle karma amount change
  const handleKarmaChange = (value) => {
    setKarmaAmount(value);
    
    // Clear error when user starts typing
    if (errors.karma) {
      setErrors(prev => ({ ...prev, karma: '' }));
    }
  };

  // Handle motivo change
  const handleMotivoChange = (value) => {
    setMotivo(value);
    
    // Clear error when user starts typing
    if (errors.motivo) {
      setErrors(prev => ({ ...prev, motivo: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedUser) {
      newErrors.user = 'Debe seleccionar un usuario destinatario';
    }
    
    if (!karmaAmount.trim()) {
      newErrors.karma = 'Debe ingresar una cantidad de karma';
    } else {
      const numValue = parseFloat(karmaAmount);
      if (isNaN(numValue)) {
        newErrors.karma = 'La cantidad debe ser un número válido';
      } else if (numValue === 0) {
        newErrors.karma = 'La cantidad no puede ser cero';
      } else if (Math.abs(numValue) > 10000) {
        newErrors.karma = 'La cantidad debe estar entre -10,000 y 10,000';
      }
    }

    if (!motivo.trim()) {
      newErrors.motivo = 'Debe explicar el motivo de la transferencia';
    } else if (motivo.length < 10) {
      newErrors.motivo = 'El motivo debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const transferData = {
        fromUserId: '1', // Current user Juan
        toUserId: selectedUser.id,
        amount: parseFloat(karmaAmount),
        motivo: motivo,
        timestamp: new Date().toISOString()
      };
      
      const result = await dataService.createTransfer(transferData);
      console.log('Transfer saved:', result);
      setShowSuccess(true);
      
      // Navigate back after success
      setTimeout(() => {
        router.push('/');
      }, 2500);
      
    } catch (error) {
      console.error('Error saving transfer:', error);
      setErrors({ submit: 'Error al procesar la transferencia. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate values for dynamic explanation
  const karmaNum = parseFloat(karmaAmount) || 0;
  const isPositive = karmaNum > 0;
  const absAmount = Math.abs(karmaNum);

  // Success state
  if (showSuccess) {
    return (
      <div className="m-4">
        <Card className="p-6 text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">¡Enviado!</h2>
          <p className="text-gray-600 mb-4">
            {isPositive ? (
              <>Se han enviado <strong>₭{absAmount}</strong> a <strong>{selectedUser?.name}</strong></>
            ) : (
              <>Se han pagado <strong>₭{absAmount}</strong> para penalizar a <strong>{selectedUser?.name}</strong></>
            )}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              <strong>Motivo:</strong> {motivo}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Title Card */}
      <div className="m-4">
        <Card>
          <div className="p-5">
            <h1 className="text-xl font-bold text-gray-800 mb-3">Transferir</h1>
            <p className="text-gray-700 text-sm leading-relaxed">
              Enviá karma a otro usuario o pagá para penalizarlo.
            </p>
          </div>
        </Card>
      </div>

      {/* Transfer Form */}
      <div className="px-4 pb-6">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* User Selection */}
            <FormField
              label="¿A quién querés transferir?"
              required
              error={errors.user}
            >
              <SearchInput
                placeholder="Buscar usuario por nombre o username..."
                onSearch={handleUserSearch}
                suggestions={userSearchResults}
                onSelect={handleUserSelect}
                value={selectedUser ? `${selectedUser.name} (@${selectedUser.username})` : ''}
                renderSuggestion={(user) => (
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <User size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{user.name}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                  </div>
                )}
              />
            </FormField>

            {/* Karma Amount */}
            <FormField
              label="¿Cuánto querés transferir?"
              required
              error={errors.karma}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg">₭</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={karmaAmount}
                  onChange={(e) => handleKarmaChange(e.target.value)}
                  placeholder="Ej: 50, -25, 12.5"
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.karma ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
            </FormField>

            {/* Dynamic Explanation */}
            {karmaAmount && !isNaN(parseFloat(karmaAmount)) && karmaNum !== 0 && (
              <div className={`p-4 border rounded-lg ${
                isPositive 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center">
                  {isPositive ? (
                    <ArrowRight size={20} className="text-green-600 mr-3" />
                  ) : (
                    <Minus size={20} className="text-red-600 mr-3" />
                  )}
                  <div>
                    {isPositive ? (
                      <p className="text-green-800 font-medium">
                        Enviar <strong>₭{absAmount}</strong>{selectedUser && <> a <strong>{selectedUser.name}</strong></>}
                      </p>
                    ) : (
                      <p className="text-red-800 font-medium">
                        Pagar <strong>₭{absAmount}</strong> para penalizar{selectedUser && <> a <strong>{selectedUser.name}</strong></>} en <strong>₭{absAmount}</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Motivo */}
            <FormField
              label="Motivo"
              required
              error={errors.motivo}
              description={`${selectedUser?.name || 'El usuario'} no sabrá que fuiste vos, pero sí podrá ver el motivo de la transacción.`}
            >
              <textarea
                value={motivo}
                onChange={(e) => handleMotivoChange(e.target.value)}
                placeholder="Ej: Por ayudar a Miguel el trabajo, Por molestar a Ana..."
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.motivo ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{motivo.length} caracteres</span>
                <span>Mínimo 10 caracteres</span>
              </div>
            </FormField>

            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-blue-800 text-sm">
                  <p className="font-medium mb-1">Transferencia anónima</p>
                  <p>El destinatario verá el motivo pero no sabrá que la transferencia vino de vos.</p>
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle size={18} className="text-red-500 mr-2" />
                <span className="text-red-700 text-sm">{errors.submit}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedUser || !karmaAmount || !motivo.trim()}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-white ${
                  isSubmitting || !selectedUser || !karmaAmount || !motivo.trim()
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : isPositive 
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isSubmitting ? 'Procesando...' : 
                 karmaNum > 0 ? 'Transferir' :
                 karmaNum < 0 ? 'Penalizar' :
                 'Enviar transferencia'}
              </button>
            </div>
          </form>
        </Card>
      </div>

    </>
  );
}