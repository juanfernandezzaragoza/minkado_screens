"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Fish, Users, Globe } from 'lucide-react';
import Card from '@/components/ui/Card';
import FormField from '@/components/shared/FormField';
import MarkdownViewer from '@/components/shared/MarkdownViewer';
import { dataService } from '@/services/dataService';

export default function ValorarAccionScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionId = searchParams?.get('action');
  
  const [valorationData, setValorationData] = useState(null);
  const [karmaValue, setKarmaValue] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load valoration data on component mount
  useEffect(() => {
    if (actionId) {
      loadValorationData();
    }
  }, [actionId]);

  const loadValorationData = async () => {
    try {
      const data = await dataService.getValorationData(actionId);
      setValorationData(data);
    } catch (error) {
      console.error('Error loading valoration data:', error);
      setErrors({ load: 'Error al cargar los datos de la acción' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle karma input change
  const handleKarmaChange = (value) => {
    setKarmaValue(value);
    
    // Clear error when user starts typing
    if (errors.karma) {
      setErrors(prev => ({ ...prev, karma: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
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
      const submission = {
        accionId: valorationData.accion.id,
        minkaValorandoId: valorationData.minkaValorando.id,
        minkaAfectadaId: valorationData.minkaAfectada.id,
        karmaValue: parseFloat(karmaValue),
        userId: '1' // Current user Juan
      };
      
      const result = await dataService.submitKarmaValoration(submission);
      console.log('Valoration saved:', result);
      setShowSuccess(true);
      
      // Navigate back after success
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving valoration:', error);
      setErrors({ submit: 'Error al guardar la valoración. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="m-4">
        <Card className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información de la acción...</p>
        </Card>
      </div>
    );
  }

  // Show error state
  if (errors.load || !valorationData) {
    return (
      <div className="m-4">
        <Card className="p-6 text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-4">
            {errors.load || 'No se pudo cargar la información de la acción'}
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

  // Calculate dynamic explanation values
  const karmaNum = parseFloat(karmaValue) || 0;
  const totalImpact = Math.abs(karmaNum * valorationData.minkaAfectada.miembros);
  const isPositive = karmaNum > 0;
  const isGlobal = valorationData.minkaAfectada.id === 'global';
  const isSameMinka = valorationData.minkaValorando.id === valorationData.minkaAfectada.id;

  // Success state
  if (showSuccess) {
    return (
      <div className="m-4">
        <Card className="p-6 text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">¡Valoración enviada!</h2>
          <p className="text-gray-600 mb-4">
            Tu valoración de <strong>{karmaValue} karma</strong> para la acción <strong>"{valorationData.accion.nombre}"</strong> ha sido registrada.
          </p>
          <p className="text-sm text-gray-500">
            Esta valoración será aplicada cuando alguien realice esta acción.
          </p>
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
            <h1 className="text-xl font-bold text-gray-800 mb-3">Valorar acción</h1>
            <p className="text-gray-700 text-sm leading-relaxed">
              Definí cuánto karma debería recibir alguien por realizar esta acción.
            </p>
          </div>
        </Card>
      </div>

      {/* Action Details */}
      <div className="px-4 pb-4">
        <Card>
          <div className="p-4">
            <div className="flex items-center mb-3">
              <Fish size={18} className="text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-800">Acción a valorar</h3>
            </div>
            
            <div className="mb-4">
              <h4 className="font-bold text-gray-800 text-lg">{valorationData.accion.nombre}</h4>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <Users size={14} className="mr-1" />
                <span>Valorando desde: {valorationData.minkaValorando.nombre}</span>
                <span className="mx-2">•</span>
                {isGlobal ? (
                  <>
                    <Globe size={14} className="mr-1" />
                    <span>Afecta: Globalmente</span>
                  </>
                ) : (
                  <>
                    <Fish size={14} className="mr-1" />
                    <span>Afecta: {valorationData.minkaAfectada.nombre}</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
              <MarkdownViewer content={valorationData.accion.descripcion} />
            </div>
          </div>
        </Card>
      </div>

      {/* Valoration Form */}
      <div className="px-4 pb-6">
        <Card className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Question */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-4 text-lg">
                ¿Cuánto te afecta que alguien {!isSameMinka && !isGlobal && `de ${valorationData.minkaAfectada.nombre} `}
                haga la acción "{valorationData.accion.nombre}"?
              </h3>
            </div>

            {/* Karma Input */}
            <FormField
              label="Valor de karma"
              required
              error={errors.karma}
              description="Ingresá un número (puede tener decimales y ser negativo)"
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
            {karmaValue && !isNaN(parseFloat(karmaValue)) && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-3">Estás proponiendo que:</h4>
                <div className="text-blue-700 text-sm space-y-2">
                  <p>
                    • Cuando alguien <strong>{!isGlobal && `de ${valorationData.minkaAfectada.nombre} `}</strong>
                    haga <strong>{valorationData.accion.nombre}</strong>,
                  </p>
                  <p>
                    • Cada miembro de <strong>{valorationData.minkaValorando.nombre}</strong> contribuya <strong>₭{karmaNum}</strong>
                  </p>
                  <p>
                    • Para <strong>{isPositive ? 'recompensarlo' : 'multarlo'}</strong> en <strong>₭{totalImpact.toLocaleString()}</strong>
                  </p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-blue-300">
                  <p className="text-blue-800 font-medium">
                    En otras palabras, estarías dispuesto a pagar <strong>₭{Math.abs(karmaNum)}</strong> para que la acción 
                    <strong> {isPositive ? 'se haga' : 'no se haga'}</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Confirmation */}
            {karmaValue && !isNaN(parseFloat(karmaValue)) && (
              <div className="mb-6">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="confirm"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                  />
                  <label htmlFor="confirm" className="text-sm text-gray-700">
                    Estás de acuerdo con esta valoración
                  </label>
                </div>
              </div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
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
                disabled={isSubmitting || !karmaValue || isNaN(parseFloat(karmaValue))}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-white ${
                  isSubmitting || !karmaValue || isNaN(parseFloat(karmaValue))
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Enviando valoración...' : 'Enviar mi voto'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}