"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, FileText, Users, Globe, X, Fish, Heart, Code, Car } from 'lucide-react';
import Card from '@/components/ui/Card';
import FormField from '@/components/shared/FormField';
import SearchInput from '@/components/shared/SearchInput';
import MarkdownViewer from '@/components/shared/MarkdownViewer';
import { dataService } from '@/services/dataService';

// Icon mapping
const iconMap = {
  Fish,
  Users,
  Globe,
  Heart,
  Code,
  Car,
  // Add more as needed
};

export default function ValorarNuevaAccionScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const minkaId = searchParams?.get('minka') || 'pescadores';
  
  const [minka, setMinka] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [associatedMinka, setAssociatedMinka] = useState('');
  const [complement, setComplement] = useState(false);
  const [karmaValue, setKarmaValue] = useState('');
  const [availableMinkas, setAvailableMinkas] = useState([]);
  
  const [actionSearchResults, setActionSearchResults] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, [minkaId]);

  const loadInitialData = async () => {
    try {
      const [minkaData, availableMinkaData] = await Promise.all([
        dataService.getMinka(minkaId),
        dataService.getAvailableMinkas(minkaId)
      ]);
      
      setMinka(minkaData);
      setAvailableMinkas(availableMinkaData);
      
      // Set default associated minka to current minka
      setAssociatedMinka(minkaData.id);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrors({ load: 'Error al cargar los datos' });
    } finally {
      setIsLoading(false);
    }
  };

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

  // Handle form changes
  const handleKarmaChange = (value) => {
    setKarmaValue(value);
    if (errors.karma) {
      setErrors(prev => ({ ...prev, karma: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedAction) {
      newErrors.action = 'Debe seleccionar una acción para valorar';
    }

    if (!associatedMinka) {
      newErrors.associatedMinka = 'Debe seleccionar a quién aplica la valoración';
    }
    
    if (!karmaValue.trim()) {
      newErrors.karma = 'Debe ingresar un valor de karma';
    } else {
      const numValue = parseFloat(karmaValue);
      if (isNaN(numValue)) {
        newErrors.karma = 'El valor debe ser un número válido';
      } else if (Math.abs(numValue) > 1000) {
        newErrors.karma = 'El valor debe estar entre -1000 y 1000';
      }
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
      // Calculate total impact based on associated minka
      const targetMinka = availableMinkas.find(m => m.id === associatedMinka);
      let targetMembers = 1000; // Default for global
      
      if (targetMinka?.type === 'current') {
        targetMembers = minka.members;
      } else if (targetMinka?.type === 'sub') {
        // Get subminka member count (would need to fetch this)
        targetMembers = 50; // Placeholder
      }

      if (complement) {
        // For complement, it's the inverse (total - minka members)
        targetMembers = targetMembers > 100 ? targetMembers - 50 : targetMembers;
      }

      const valorationData = {
        minkaId: minka.id,
        actionId: selectedAction.id,
        associatedMinka: associatedMinka,
        complement: complement,
        karmaValue: parseFloat(karmaValue),
        totalImpact: Math.abs(parseFloat(karmaValue) * targetMembers)
      };
      
      const result = await dataService.submitKarmaValuation(valorationData);
      console.log('Valuation saved:', result);
      setShowSuccess(true);
      
      // Navigate back after success
      setTimeout(() => {
        router.push(`/minka/${minka.id}/valuations`);
      }, 2000);
      
    } catch (error) {
      console.error('Error saving valoration:', error);
      setErrors({ submit: 'Error al guardar la valoración. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate dynamic explanation values
  const karmaNum = parseFloat(karmaValue) || 0;
  const isPositive = karmaNum > 0;

  // Show loading state
  if (isLoading) {
    return (
      <div className="m-4">
        <Card className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </Card>
      </div>
    );
  }

  // Show error state
  if (errors.load || !minka) {
    return (
      <div className="m-4">
        <Card className="p-6 text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-4">
            {errors.load || 'No se pudo cargar la información de la minka'}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
        </Card>
      </div>
    );
  }

  // Success state
  if (showSuccess) {
    return (
      <div className="m-4">
        <Card className="p-6 text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">¡Valoración creada!</h2>
          <p className="text-gray-600 mb-4">
            <strong>{minka.name}</strong> ahora valora la acción <strong>"{selectedAction?.name}"</strong> en <strong>{karmaValue} karma</strong>.
          </p>
          <p className="text-sm text-gray-500">
            Esta valoración se aplicará cuando alguien realice esta acción.
          </p>
        </Card>
      </div>
    );
  }

  const MinkaIcon = iconMap[minka.icon] || iconMap.Users;

  return (
    <>
      {/* Title Card */}
      <div className="m-4">
        <Card>
          <div className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                <MinkaIcon size={24} className={minka.iconColor || 'text-blue-600'} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Valorar nueva acción</h1>
                <p className="text-gray-600 text-sm">para {minka.name}</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Definí cuánto karma debería pagar cada miembro de {minka.name} cuando alguien realice una acción específica.
            </p>
          </div>
        </Card>
      </div>

      {/* Form */}
      <div className="px-4 pb-6">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Action Selection */}
            <FormField
              label="Acción a valorar"
              required
              error={errors.action}
              description="Buscá y seleccioná la acción que querés que valora esta minka"
            >
              <SearchInput
                placeholder="Buscar acción por nombre..."
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

            {/* Action Preview */}
            {selectedAction && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Acción seleccionada:</h4>
                <div className="mb-2">
                  <div className="font-medium text-gray-800">{selectedAction.name}</div>
                  <div className="text-sm text-gray-600">{selectedAction.description}</div>
                </div>
              </div>
            )}

            {/* Associated Minka Selection */}
            <FormField
              label="¿A quién aplica?"
              required
              error={errors.associatedMinka}
              description="Seleccioná a qué grupo aplica esta valoración"
            >
              <div className="space-y-3">
                {availableMinkas.map((availableMinka) => {
                  const isSelected = associatedMinka === availableMinka.id;
                  let IconComponent = iconMap.Users;
                  let iconColor = 'text-blue-600';
                  
                  if (availableMinka.type === 'global') {
                    IconComponent = iconMap.Globe;
                    iconColor = 'text-green-600';
                  } else if (availableMinka.type === 'current') {
                    IconComponent = iconMap[minka.icon] || iconMap.Users;
                    iconColor = minka.iconColor || 'text-blue-600';
                  }
                  
                  return (
                    <label
                      key={availableMinka.id}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="associatedMinka"
                        value={availableMinka.id}
                        checked={isSelected}
                        onChange={(e) => setAssociatedMinka(e.target.value)}
                        className="sr-only"
                      />
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center mr-3">
                        <IconComponent size={18} className={iconColor} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{availableMinka.name}</div>
                        <div className="text-sm text-gray-500">
                          {availableMinka.type === 'global' && 'Aplica a todos los usuarios'}
                          {availableMinka.type === 'current' && `Aplica a miembros de ${minka.name}`}
                          {availableMinka.type === 'sub' && `Aplica a miembros de ${availableMinka.name}`}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </FormField>

            {/* Complement Option */}
            {associatedMinka && associatedMinka !== 'global' && (
              <FormField
                label="Complemento"
                description="¿Querés aplicar la valoración al complemento (los que NO son de esta minka)?"
              >
                <label className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={complement}
                    onChange={(e) => setComplement(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-800">
                      Aplicar a NO-{availableMinkas.find(m => m.id === associatedMinka)?.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      La valoración se aplicará a personas que NO sean de {availableMinkas.find(m => m.id === associatedMinka)?.name}
                    </div>
                  </div>
                </label>
              </FormField>
            )}

            {/* Karma Value Input */}
            <FormField
              label="Valor de karma"
              required
              error={errors.karma}
              description="¿Cuánto karma debería pagar cada miembro de la minka cuando ocurra esta acción?"
            >
              <input
                type="number"
                step="0.1"
                value={karmaValue}
                onChange={(e) => handleKarmaChange(e.target.value)}
                placeholder="Ej: 12.5, -5, 0.3"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.karma ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </FormField>

            {/* Dynamic Explanation */}
            {karmaValue && !isNaN(parseFloat(karmaValue)) && selectedAction && associatedMinka && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-3">Estás definiendo que:</h4>
                <div className="text-blue-700 text-sm space-y-2">
                  <p>
                    • Cuando alguien {complement ? `que NO sea` : `de`} <strong>
                      {availableMinkas.find(m => m.id === associatedMinka)?.name}
                    </strong> haga <strong>"{selectedAction.name}"</strong>
                  </p>
                  <p>
                    • Cada miembro de <strong>{minka.name}</strong> {isPositive ? 'premiará' : 'multará'} con <strong>₭{Math.abs(karmaNum)}</strong>
                  </p>
                  <p>
                    • El impacto total será aproximadamente <strong>₭{Math.abs(karmaNum * minka.members).toLocaleString()}</strong>
                  </p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-blue-300">
                  <p className="text-blue-800 font-medium">
                    En otras palabras, como miembro de {minka.name}, estarías dispuesto a pagar <strong>₭{Math.abs(karmaNum)}</strong> para que esta acción 
                    <strong> {isPositive ? 'se haga' : 'no se haga'}</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Confirmation */}
            {karmaValue && !isNaN(parseFloat(karmaValue)) && selectedAction && associatedMinka && (
              <div className="mb-6">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="confirm"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                  />
                  <label htmlFor="confirm" className="text-sm text-gray-700">
                    Confirmo que {minka.name} debe valorar esta acción con estos parámetros
                  </label>
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
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedAction || !associatedMinka || !karmaValue || isNaN(parseFloat(karmaValue))}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-white ${
                  isSubmitting || !selectedAction || !associatedMinka || !karmaValue || isNaN(parseFloat(karmaValue))
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Guardando valoración...' : 'Crear valoración'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}