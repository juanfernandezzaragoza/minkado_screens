"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, User, X, ChevronLeft, Fish, Users, Briefcase, Heart, Gamepad2, Music, Camera, Book, Zap, Target, Coffee, Palette, Code, Cpu, Globe } from 'lucide-react';
import Card from '@/components/ui/Card';
import FormField from '@/components/shared/FormField';
import SearchInput from '@/components/shared/SearchInput';
import { dataService } from '@/services/dataService';

export default function CrearMinkaScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentMinkaId = searchParams?.get('parent'); // Viene del contexto de otra minka
  
  // Form data
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedParentMinka, setSelectedParentMinka] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [iconSearchQuery, setIconSearchQuery] = useState('');
  const [minkaSearchQuery, setMinkaSearchQuery] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Available icons for minkas (expandida para búsqueda)
  const availableIcons = [
    { name: 'Fish', component: Fish, color: 'text-blue-600', keywords: ['pez', 'pescado', 'mar', 'océano'] },
    { name: 'Users', component: Users, color: 'text-purple-600', keywords: ['usuarios', 'gente', 'personas', 'comunidad'] },
    { name: 'Briefcase', component: Briefcase, color: 'text-gray-600', keywords: ['trabajo', 'oficina', 'negocio', 'empresa'] },
    { name: 'Heart', component: Heart, color: 'text-red-600', keywords: ['corazón', 'amor', 'salud', 'bienestar'] },
    { name: 'Gamepad2', component: Gamepad2, color: 'text-green-600', keywords: ['juegos', 'gaming', 'entretenimiento'] },
    { name: 'Music', component: Music, color: 'text-pink-600', keywords: ['música', 'sonido', 'audio', 'banda'] },
    { name: 'Camera', component: Camera, color: 'text-indigo-600', keywords: ['cámara', 'foto', 'fotografía', 'imagen'] },
    { name: 'Book', component: Book, color: 'text-yellow-600', keywords: ['libro', 'lectura', 'educación', 'estudio'] },
    { name: 'Zap', component: Zap, color: 'text-orange-600', keywords: ['energía', 'rayo', 'eléctrico', 'poder'] },
    { name: 'Target', component: Target, color: 'text-teal-600', keywords: ['objetivo', 'meta', 'blanco', 'precisión'] },
    { name: 'Coffee', component: Coffee, color: 'text-amber-600', keywords: ['café', 'bebida', 'desayuno', 'energía'] },
    { name: 'Palette', component: Palette, color: 'text-rose-600', keywords: ['paleta', 'arte', 'pintura', 'diseño', 'colores'] },
    { name: 'Code', component: Code, color: 'text-emerald-600', keywords: ['código', 'programación', 'desarrollo', 'tech'] },
    { name: 'Cpu', component: Cpu, color: 'text-slate-600', keywords: ['computadora', 'tecnología', 'hardware', 'procesador'] },
    { name: 'Globe', component: Globe, color: 'text-cyan-600', keywords: ['mundo', 'global', 'internacional', 'tierra'] },
    { name: 'Briefcase', component: Briefcase, color: 'text-blue-700', keywords: ['profesional', 'carrera', 'trabajo'] },
    { name: 'Users', component: Users, color: 'text-green-700', keywords: ['equipo', 'grupo', 'colaboración'] },
    { name: 'Heart', component: Heart, color: 'text-pink-700', keywords: ['cuidado', 'apoyo', 'solidaridad'] },
    { name: 'Target', component: Target, color: 'text-red-700', keywords: ['enfoque', 'dirección', 'propósito'] },
    { name: 'Zap', component: Zap, color: 'text-yellow-700', keywords: ['innovación', 'cambio', 'transformación'] }
  ];

  // Mock minkas where user is member (para elegir superminka) - will be fetched from dataService
  const [userMinkas, setUserMinkas] = useState([
    { id: 'argentina', nombre: 'ARGENTINA', miembros: 2000 },
    { id: 'pescadores', nombre: 'PESCADORES', miembros: 85 },
    { id: 'causas-populares', nombre: 'CAUSAS POPULARES', miembros: 320 }
  ]);

  // Navigation
  const goToNextStep = () => setCurrentStep(prev => prev + 1);
  const goToPrevStep = () => setCurrentStep(prev => prev - 1);
  const goToHome = () => router.push('/');

  // Skip step 2 if we have a parent context
  const shouldSkipStep2 = !!parentMinkaId;
  const totalSteps = shouldSkipStep2 ? 3 : 4;

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
    if (errors.users) {
      setErrors(prev => ({ ...prev, users: '' }));
    }
  };

  const removeUser = (userId) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== userId));
  };

  // Handle icon search
  const handleIconSearch = (query) => {
    setIconSearchQuery(query);
  };

  const getFilteredIcons = () => {
    if (!iconSearchQuery.trim()) return availableIcons;
    
    const searchLower = iconSearchQuery.toLowerCase();
    return availableIcons.filter(icon => 
      icon.name.toLowerCase().includes(searchLower) ||
      icon.keywords.some(keyword => keyword.includes(searchLower))
    );
  };

  // Handle minka search
  const handleMinkaSearch = (query) => {
    setMinkaSearchQuery(query);
  };

  const getFilteredMinkas = () => {
    if (!minkaSearchQuery.trim()) return userMinkas;
    
    const searchLower = minkaSearchQuery.toLowerCase();
    return userMinkas.filter(minka => 
      minka.nombre.toLowerCase().includes(searchLower)
    );
  };

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!nombre.trim()) {
        newErrors.nombre = 'El nombre de la minka es requerido';
      } else if (nombre.length < 3) {
        newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
      }
      
      if (!descripcion.trim()) {
        newErrors.descripcion = 'La descripción es requerida';
      } else if (descripcion.length < 10) {
        newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
      }
      
      if (!selectedIcon) {
        newErrors.icon = 'Debe seleccionar un ícono para la minka';
      }
    }
    
    if (step === 2 && !shouldSkipStep2) {
      if (!selectedParentMinka) {
        newErrors.parent = 'Debe seleccionar una superminka';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const minkaData = {
        nombre,
        descripcion,
        icon: selectedIcon.name,
        iconColor: selectedIcon.color,
        parentMinkaId: parentMinkaId || selectedParentMinka?.id || null,
        creatorId: '1',
        invitedUserIds: selectedUsers.map(user => user.id),
        createdAt: new Date().toISOString()
      };
      
      const result = await dataService.createMinka(minkaData);
      console.log('Minka created:', result);
      setShowSuccess(true);
      
      setTimeout(() => {
        router.push('/');
      }, 3000);
      
    } catch (error) {
      console.error('Error creating minka:', error);
      setErrors({ submit: 'Error al crear la minka. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-skip step 2 if needed
  const handleStep1Continue = () => {
    if (validateStep(1)) {
      if (shouldSkipStep2) {
        setCurrentStep(3); // Skip to step 3 (invites)
      } else {
        goToNextStep(); // Go to step 2 (parent selection)
      }
    }
  };

  // Success state
  if (showSuccess) {
    const IconComponent = selectedIcon?.component;
    return (
      <div className="m-4">
        <Card className="p-6 text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">¡Minka creada!</h2>
          <div className="flex items-center justify-center mb-4">
            {IconComponent && (
              <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-3`}>
                <IconComponent size={24} className={selectedIcon.color} />
              </div>
            )}
            <div>
              <p className="font-bold text-gray-800">{nombre}</p>
              <p className="text-sm text-gray-600">{descripcion}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Se han enviado invitaciones a {selectedUsers.length} usuario{selectedUsers.length !== 1 ? 's' : ''}.
          </p>
        </Card>
      </div>
    );
  }

  // Step 1: Basic Info
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
                <h1 className="text-xl font-bold text-gray-800">Información básica</h1>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Definí el nombre, descripción e ícono de tu nueva minka (paso 1 de {totalSteps})
              </p>
            </div>
          </Card>
        </div>

        <div className="px-4 pb-6">
          <Card className="p-6">
            <div className="space-y-6">
              {/* Nombre */}
              <FormField
                label="Nombre de la minka"
                required
                error={errors.nombre}
              >
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    if (errors.nombre) setErrors(prev => ({ ...prev, nombre: '' }));
                  }}
                  placeholder="Ej: Desarrolladores Web, Amantes del Café, etc."
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </FormField>

              {/* Descripción */}
              <FormField
                label="Descripción"
                required
                error={errors.descripcion}
                description="Explicá brevemente de qué se trata esta minka"
              >
                <textarea
                  value={descripcion}
                  onChange={(e) => {
                    setDescripcion(e.target.value);
                    if (errors.descripcion) setErrors(prev => ({ ...prev, descripcion: '' }));
                  }}
                  placeholder="Ej: Una comunidad para desarrolladores web que comparten conocimientos y proyectos"
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                    errors.descripcion ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </FormField>

              {/* Ícono */}
              <FormField
                label="Ícono"
                required
                error={errors.icon}
                description="Buscá y seleccioná un ícono que represente tu minka"
              >
                <div className="space-y-3">
                  {/* Search input for icons */}
                  <div className="relative">
                    <input
                      type="text"
                      value={iconSearchQuery}
                      onChange={(e) => handleIconSearch(e.target.value)}
                      placeholder="Buscar ícono... (ej: música, trabajo, etc.)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Selected icon preview */}
                  {selectedIcon && (
                    <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <selectedIcon.component size={24} className={selectedIcon.color + " mr-3"} />
                      <span className="font-medium text-blue-800">Ícono seleccionado: {selectedIcon.name}</span>
                    </div>
                  )}
                  
                  {/* Icons grid */}
                  <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {getFilteredIcons().map((icon, index) => {
                      const IconComponent = icon.component;
                      const isSelected = selectedIcon?.name === icon.name && selectedIcon?.color === icon.color;
                      return (
                        <button
                          key={`${icon.name}-${icon.color}-${index}`}
                          type="button"
                          onClick={() => {
                            setSelectedIcon(icon);
                            if (errors.icon) setErrors(prev => ({ ...prev, icon: '' }));
                          }}
                          className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                          title={icon.name}
                        >
                          <IconComponent size={20} className={icon.color} />
                        </button>
                      );
                    })}
                  </div>
                  
                  {getFilteredIcons().length === 0 && iconSearchQuery && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No se encontraron íconos que coincidan con "{iconSearchQuery}"
                    </p>
                  )}
                </div>
              </FormField>

              <button
                onClick={handleStep1Continue}
                disabled={!nombre.trim() || !descripcion.trim() || !selectedIcon}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                  !nombre.trim() || !descripcion.trim() || !selectedIcon
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
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

  // Step 2: Parent Minka (only if not coming from parent context)
  if (currentStep === 2 && !shouldSkipStep2) {
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
                <h1 className="text-xl font-bold text-gray-800">Superminka</h1>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                ¿A qué minka más grande pertenecerá tu nueva minka? (paso 2 de {totalSteps})
              </p>
            </div>
          </Card>
        </div>

        <div className="px-4 pb-6">
          <Card className="p-6">
            <div className="space-y-4">
              <FormField
                label="Superminka (opcional)"
                description="Buscá una minka padre o dejá vacío para que sea independiente"
              >
                <div className="space-y-3">
                  {/* Search input for minkas */}
                  <div className="relative">
                    <input
                      type="text"
                      value={minkaSearchQuery}
                      onChange={(e) => handleMinkaSearch(e.target.value)}
                      placeholder="Buscar minka... o dejá vacío para minka independiente"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Selected parent preview */}
                  {selectedParentMinka && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div>
                        <span className="font-medium text-blue-800">Superminka: {selectedParentMinka.nombre}</span>
                        <p className="text-sm text-blue-600">{selectedParentMinka.miembros.toLocaleString()} miembros</p>
                      </div>
                      <button
                        onClick={() => setSelectedParentMinka(null)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  
                  {/* Option for no parent */}
                  {!selectedParentMinka && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Minka independiente:</strong> No pertenecerá a ninguna superminka
                      </p>
                    </div>
                  )}
                  
                  {/* Minkas list */}
                  {minkaSearchQuery && (
                    <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                      {getFilteredMinkas().map((minka) => (
                        <button
                          key={minka.id}
                          onClick={() => {
                            setSelectedParentMinka(minka);
                            setMinkaSearchQuery('');
                          }}
                          className="w-full border-b border-gray-100 last:border-b-0 p-3 text-left hover:bg-gray-50 transition-all"
                        >
                          <div className="font-medium text-gray-800">{minka.nombre}</div>
                          <div className="text-sm text-gray-600">{minka.miembros.toLocaleString()} miembros</div>
                        </button>
                      ))}
                      
                      {getFilteredMinkas().length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No se encontraron minkas que coincidan con "{minkaSearchQuery}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </FormField>

              <button
                onClick={goToNextStep}
                className="w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Continuar {selectedParentMinka ? `(dentro de ${selectedParentMinka.nombre})` : '(minka independiente)'}
              </button>
            </div>
          </Card>
        </div>
      </>
    );
  }

  // Step 3: Invite Users
  const inviteStepNumber = shouldSkipStep2 ? 2 : 3;
  if (currentStep === 3 || (currentStep === 2 && shouldSkipStep2)) {
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
                <h1 className="text-xl font-bold text-gray-800">Invitar miembros</h1>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Invitá usuarios a unirse a tu nueva minka (paso {inviteStepNumber} de {totalSteps})
              </p>
            </div>
          </Card>
        </div>

        <div className="px-4 pb-6">
          <Card className="p-6">
            <FormField
              label="Miembros a invitar"
              description="Buscá y agregá usuarios que quieras invitar (opcional)"
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
              onClick={goToNextStep}
              className="w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Continuar ({selectedUsers.length} invitado{selectedUsers.length !== 1 ? 's' : ''})
            </button>
          </Card>
        </div>
      </>
    );
  }

  // Step 4: Confirmation
  const confirmStepNumber = shouldSkipStep2 ? 3 : 4;
  if (currentStep === 4 || (currentStep === 3 && shouldSkipStep2)) {
    const IconComponent = selectedIcon?.component;
    const parentMinka = parentMinkaId ? userMinkas.find(m => m.id === parentMinkaId) : selectedParentMinka;
    
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
                <h1 className="text-xl font-bold text-gray-800">Confirmar creación</h1>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Revisá los detalles de tu nueva minka (paso {confirmStepNumber} de {totalSteps})
              </p>
            </div>
          </Card>
        </div>

        <div className="px-4 pb-6">
          <Card className="p-6">
            <div className="space-y-6">
              {/* Minka Preview */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-4">Tu nueva minka:</h3>
                <div className="flex items-start space-x-4">
                  {IconComponent && (
                    <div className="w-12 h-12 rounded-lg bg-white border border-gray-300 flex items-center justify-center">
                      <IconComponent size={24} className={selectedIcon.color} />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-lg">{nombre}</h4>
                    <p className="text-gray-600 text-sm mt-1">{descripcion}</p>
                    {parentMinka ? (
                      <p className="text-xs text-gray-500 mt-2">
                        Dentro de: {parentMinka.nombre}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-2">
                        Minka independiente
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Invited Users */}
              {selectedUsers.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Usuarios invitados:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map(user => (
                      <div key={user.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {user.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isSubmitting ? 'Creando minka...' : 'Crear minka'}
              </button>
            </div>
          </Card>
        </div>
      </>
    );
  }
}