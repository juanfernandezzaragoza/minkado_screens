"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, Users, FileText, ArrowRight, ArrowLeft, Percent, User, X, ChevronLeft, ChevronsLeftRight, ChevronsRightLeft } from 'lucide-react';
import Card from '@/components/ui/Card';
import FormField from '@/components/shared/FormField';
import SearchInput from '@/components/shared/SearchInput';
import { dataService } from '@/services/dataService';

export default function PactarScreen() {
  const router = useRouter();
  
  // Form data
  const [selectedAction, setSelectedAction] = useState(null);
  const [transferDirection, setTransferDirection] = useState('');
  const [transferType, setTransferType] = useState('fixed');
  const [transferAmount, setTransferAmount] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [actionSearchResults, setActionSearchResults] = useState([]);
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Navigation
  const goToNextStep = () => setCurrentStep(prev => prev + 1);
  const goToPrevStep = () => setCurrentStep(prev => prev - 1);
  const goToHome = () => router.push('/');

  // Handle action search
  const handleActionSearch = async (query) => {
    try {
      const results = await dataService.searchActions(query);
      setActionSearchResults(results);
    } catch (error) {
      console.error('Error searching actions:', error);
      setActionSearchResults([]);
    }
  };

  const handleActionSelect = (action) => {
    setSelectedAction(action);
    setActionSearchResults([]);
    if (errors.action) {
      setErrors(prev => ({ ...prev, action: '' }));
    }
  };

  // Handle user search
  const handleUserSearch = async (query) => {
    try {
      const results = await dataService.searchUsers(query);
      const filteredResults = results.filter(user => 
        user.id !== '1' && !selectedUsers.find(selected => selected.id === user.id)
      );
      setUserSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
      setUserSearchResults([]);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUsers(prev => [...prev, user]);
    setUserSearchResults([]);
    setErrors(prev => ({ ...prev, users: '' }));
  };

  const removeUser = (userId) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== userId));
  };

  // Handle direction selection
  const handleDirectionSelect = (direction) => {
    setTransferDirection(direction);
    if (errors.direction) {
      setErrors(prev => ({ ...prev, direction: '' }));
    }
  };

  // Handle transfer amount change
  const handleTransferAmountChange = (value) => {
    setTransferAmount(value);
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!selectedAction) {
        newErrors.action = 'Debe seleccionar una acción';
      }
    }

    if (step === 2) {
      if (!transferDirection) {
        newErrors.direction = 'Debe seleccionar la dirección de transferencia';
      }
      
      if (!transferAmount.trim()) {
        newErrors.amount = 'Debe especificar la cantidad de la transferencia';
      } else {
        const numValue = parseFloat(transferAmount);
        if (isNaN(numValue) || numValue <= 0) {
          newErrors.amount = 'La cantidad debe ser un número positivo';
        } else if (transferType === 'percentage' && numValue > 100) {
          newErrors.amount = 'El porcentaje no puede ser mayor a 100%';
        } else if (transferType === 'fixed' && numValue > 10000) {
          newErrors.amount = 'La cantidad fija no puede ser mayor a ₭10,000';
        }
      }
    }
    
    if (step === 3 && selectedUsers.length === 0) {
      newErrors.users = 'Debe invitar al menos un usuario al pacto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    
    try {
      const pactData = {
        actionId: selectedAction.id,
        creatorId: '1',
        participantIds: selectedUsers.map(user => user.id),
        transferDirection,
        transferType,
        transferAmount: parseFloat(transferAmount),
        createdAt: new Date().toISOString()
      };
      
      const result = await dataService.createPact(pactData);
      console.log('Pact created:', result);
      setShowSuccess(true);
      
      setTimeout(() => {
        router.push('/');
      }, 3000);
      
    } catch (error) {
      console.error('Error creating pact:', error);
      setErrors({ submit: 'Error al crear el pacto. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (showSuccess) {
    return (
      <div className="m-4">
        <Card className="p-6 text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">¡Pacto propuesto!</h2>
          <p className="text-gray-600 mb-4">
            Se ha enviado la propuesta de pacto para <strong>"{selectedAction?.name}"</strong> a {selectedUsers.length} usuario{selectedUsers.length > 1 ? 's' : ''}.
          </p>
          <p className="text-sm text-gray-500">
            Los participantes recibirán una notificación para aceptar o rechazar el pacto.
          </p>
        </Card>
      </div>
    );
  }

  // Step 1: Choose action and explain pacts
  if (currentStep === 1) {
    return (
      <>
        <div className="m-4">
          <Card>
            <div className="p-5">
              <div className="flex items-center mb-3">
                <ChevronLeft 
                  size={24} 
                  onClick={goToHome}
                  className="cursor-pointer text-gray-600 mr-2"
                />
                <h1 className="text-xl font-bold text-gray-800">¿Qué acción activará el pacto?</h1>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Los pactos son transferencias automáticas gatilladas cuando sucede una acción (paso 1 de 4)
              </p>
              

            </div>
          </Card>
        </div>

        <div className="px-4 pb-6">
          <Card className="p-6">
            <FormField
              label="Acción que activará las transferencias automáticas"
              required
              error={errors.action}
            >
              <SearchInput
                placeholder="Buscar acción..."
                onSearch={handleActionSearch}
                suggestions={actionSearchResults}
                onSelect={handleActionSelect}
                value={selectedAction ? selectedAction.name : ''}
                renderSuggestion={(action) => (
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <FileText size={16} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{action.name}</div>
                      <div className="text-sm text-gray-500">{action.description}</div>
                    </div>
                  </div>
                )}
              />
            </FormField>

            {/* Selected Action Preview */}
            {selectedAction && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-600 mr-3" />
                  <div>
                    <div className="font-medium text-green-800">Acción seleccionada: {selectedAction.name}</div>
                    <div className="text-sm text-green-700">{selectedAction.description}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={() => {
                  if (validateStep(1)) goToNextStep();
                }}
                disabled={!selectedAction}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                  !selectedAction
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                Continuar
              </button>
            </div>
          </Card>
        </div>
      </>
    );
  }

  // Step 2: Choose transfer direction and amount
  if (currentStep === 2) {
    return (
      <>
        <div className="m-4">
          <Card>
            <div className="p-5">
              <div className="flex items-center mb-3">
                <ChevronLeft 
                  size={24} 
                  onClick={goToPrevStep}
                  className="cursor-pointer text-gray-600 mr-2"
                />
                <h1 className="text-xl font-bold text-gray-800">¿Quién transfiere a quién?</h1>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Cuando alguien haga "{selectedAction?.name}", ¿cómo querés que fluya el karma? (paso 2 de 4)
              </p>
            </div>
          </Card>
        </div>

        <div className="px-4 pb-6">
          <Card className="p-6">
            <div className="space-y-6">
              {/* Direction Selection */}
              <FormField
                label="Dirección de la transferencia"
                required
                error={errors.direction}
              >
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => handleDirectionSelect('give')}
                    className={`w-full border-2 rounded-lg p-6 transition-all text-left ${
                      transferDirection === 'give'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <ChevronsRightLeft size={24} className="text-blue-600 mr-4" />
                      <div>
                        <div className="font-bold text-gray-800 text-lg">Todos para uno</div>
                        <div className="text-gray-600 mt-1">Los demás participantes le transfieren karma al que realiza la acción</div>
                        <div className="text-sm text-blue-700 mt-2 font-medium">
                          Ejemplo: Cuando reparo mi auto, los demás me ayudan con los gastos
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectionSelect('receive')}
                    className={`w-full border-2 rounded-lg p-6 transition-all text-left ${
                      transferDirection === 'receive'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <ChevronsLeftRight size={24} className="text-purple-600 mr-4" />
                      <div>
                        <div className="font-bold text-gray-800 text-lg">Uno para todos</div>
                        <div className="text-gray-600 mt-1">El que realiza la acción les transfiere karma a los demás participantes</div>
                        <div className="text-sm text-purple-700 mt-2 font-medium">
                          Ejemplo: Cuando gano dinero, comparto parte con los demás
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </FormField>

              {/* Amount Selection - Only show if direction is selected */}
              {transferDirection && (
                <>
                  {/* Type Selection */}
                  <FormField
                    label="¿Cuánto se va a transferir?"
                    description="Elegí si será un porcentaje o una cantidad fija"
                  >
                    <div className="flex gap-3 mb-4">
                      <label className={`flex-1 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        transferType === 'percentage' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <input
                          type="radio"
                          name="transferType"
                          value="percentage"
                          checked={transferType === 'percentage'}
                          onChange={(e) => setTransferType(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center">
                          <Percent size={20} className="text-blue-600 mr-3" />
                          <div>
                            <div className="font-medium text-gray-800">Porcentaje</div>
                            <div className="text-sm text-gray-600">% del karma/costo</div>
                          </div>
                        </div>
                      </label>

                      <label className={`flex-1 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        transferType === 'fixed' 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <input
                          type="radio"
                          name="transferType"
                          value="fixed"
                          checked={transferType === 'fixed'}
                          onChange={(e) => setTransferType(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center">
                          <span className="text-purple-600 mr-3 font-bold text-lg">₭</span>
                          <div>
                            <div className="font-medium text-gray-800">Cantidad fija</div>
                            <div className="text-sm text-gray-600">Karma específico</div>
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* Amount Input */}
                    <div className="relative">
                      <input
                        type="number"
                        step={transferType === 'percentage' ? '1' : '0.1'}
                        max={transferType === 'percentage' ? '100' : '10000'}
                        min="0.1"
                        value={transferAmount}
                        onChange={(e) => handleTransferAmountChange(e.target.value)}
                        placeholder={transferType === 'percentage' ? 'Ej: 20' : 'Ej: 50.5'}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.amount ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 font-medium">
                          {transferType === 'percentage' ? '%' : '₭'}
                        </span>
                      </div>
                    </div>
                    {errors.amount && (
                      <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                    )}
                  </FormField>
                </>
              )}

              <button
                onClick={() => {
                  if (validateStep(2)) goToNextStep();
                }}
                disabled={!transferDirection || !transferAmount || isNaN(parseFloat(transferAmount))}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                  !transferDirection || !transferAmount || isNaN(parseFloat(transferAmount))
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                Continuar
              </button>
            </div>
          </Card>
        </div>
      </>
    );
  }

  // Step 3: Choose participants
  if (currentStep === 3) {
    return (
      <>
        <div className="m-4">
          <Card>
            <div className="p-5">
              <div className="flex items-center mb-3">
                <ChevronLeft 
                  size={24} 
                  onClick={goToPrevStep}
                  className="cursor-pointer text-gray-600 mr-2"
                />
                <h1 className="text-xl font-bold text-gray-800">¿A quién querés proponer el pacto?</h1>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Invitá a otros usuarios a formar parte de este pacto (paso 3 de 4)
              </p>
            </div>
          </Card>
        </div>

        <div className="px-4 pb-6">
          <Card className="p-6">
            <FormField
              label="Participantes del pacto"
              required
              error={errors.users}
              description="Buscá y agregá usuarios al pacto"
            >
              <div className="space-y-3">
                {selectedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedUsers.map(user => (
                      <div key={user.id} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        <span>{user.name}</span>
                        <button
                          type="button"
                          onClick={() => removeUser(user.id)}
                          className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <SearchInput
                  placeholder="Buscar usuarios para invitar..."
                  onSearch={handleUserSearch}
                  suggestions={userSearchResults}
                  onSelect={handleUserSelect}
                  value=""
                  className="w-full"
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
              </div>
            </FormField>

            <button
              onClick={() => {
                if (validateStep(3)) goToNextStep();
              }}
              disabled={selectedUsers.length === 0}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                selectedUsers.length === 0
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              Continuar ({selectedUsers.length} participante{selectedUsers.length !== 1 ? 's' : ''})
            </button>
          </Card>
        </div>
      </>
    );
  }

  // Step 4: Summary and submit (same as before)
  if (currentStep === 4) {
    const numAmount = parseFloat(transferAmount) || 0;
    const totalParticipants = selectedUsers.length + 1;
    const isReceiving = transferDirection === 'receive';
    const isPercentage = transferType === 'percentage';

    return (
      <>
        <div className="m-4">
          <Card>
            <div className="p-5">
              <div className="flex items-center mb-3">
                <ChevronLeft 
                  size={24} 
                  onClick={goToPrevStep}
                  className="cursor-pointer text-gray-600 mr-2"
                />
                <h1 className="text-xl font-bold text-gray-800">Resumen del pacto</h1>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Revisá los detalles antes de proponer el pacto (paso 4 de 4)
              </p>
            </div>
          </Card>
        </div>

        <div className="px-4 pb-6">
          <Card className="p-6">
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-4">Detalles del pacto:</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Acción:</span>
                    <span className="font-medium text-gray-800">{selectedAction.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Participantes:</span>
                    <span className="font-medium text-gray-800">{totalParticipants} total</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dirección:</span>
                    <span className="font-medium text-gray-800">
                      {transferDirection === 'give' ? 'Todos → Uno' : 'Uno → Todos'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cantidad:</span>
                    <span className="font-medium text-gray-800">
                      {isPercentage ? `${numAmount}%` : `₭${numAmount}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic explanation */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Cuando cualquier participante realice "{selectedAction.name}":</h4>
                <div className="text-blue-700 text-sm">
                  {transferDirection === 'give' ? (
                    <p>
                      → Los otros {selectedUsers.length} participantes le darán{' '}
                      <strong>
                        {isPercentage ? `${numAmount}%` : `₭${numAmount}`}
                      </strong>
                      {isPercentage && ' cada uno'}
                    </p>
                  ) : (
                    <p>
                      → Se les dará a los otros {selectedUsers.length} participantes{' '}
                      <strong>
                        {isPercentage ? `${numAmount}%` : `₭${numAmount}`}
                      </strong>
                      {isPercentage ? ' del total' : ' cada uno'}
                    </p>
                  )}
                </div>
              </div>

              {/* Participants list */}
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Participantes invitados:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map(user => (
                    <div key={user.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {user.name}
                    </div>
                  ))}
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
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-4 px-4 rounded-lg font-medium text-white ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isSubmitting ? 'Creando pacto...' : 'Proponer pacto'}
              </button>
            </div>
          </Card>
        </div>
      </>
    );
  }
}