"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, User, FileText, Eye } from 'lucide-react';
import Card from '@/components/ui/Card';
import FormField from '@/components/shared/FormField';
import SearchInput from '@/components/shared/SearchInput';
import MarkdownEditor from '@/components/shared/MarkdownEditor';
import MarkdownViewer from '@/components/shared/MarkdownViewer';
import { dataService } from '@/services/dataService';

export default function ReportarActoScreen() {
  const router = useRouter();
  const [selectedActor, setSelectedActor] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [evidencia, setEvidencia] = useState('');
  const [fechaHora, setFechaHora] = useState('');
  
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [actionSearchResults, setActionSearchResults] = useState([]);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showActionDetails, setShowActionDetails] = useState(false);

  // Handle user search
  const handleUserSearch = async (query) => {
    try {
      const results = await dataService.searchUsers(query);
      setUserSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
      setUserSearchResults([]);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedActor(user);
    setUserSearchResults([]);
    
    // Clear error when user is selected
    if (errors.actor) {
      setErrors(prev => ({ ...prev, actor: '' }));
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

  const handleActionSelect = async (action) => {
    try {
      // Get action with full details for display
      const actionWithDetails = await dataService.getActionWithDetails(action.id);
      setSelectedAction(actionWithDetails);
      setActionSearchResults([]);
      setShowActionDetails(true);
      
      // Clear error when action is selected
      if (errors.action) {
        setErrors(prev => ({ ...prev, action: '' }));
      }
    } catch (error) {
      console.error('Error fetching action details:', error);
      setSelectedAction(action);
      setActionSearchResults([]);
      setShowActionDetails(true);
    }
  };

  // Handle evidence change
  const handleEvidenciaChange = (value) => {
    setEvidencia(value || '');
    
    // Clear error when user starts typing
    if (errors.evidencia) {
      setErrors(prev => ({ ...prev, evidencia: '' }));
    }
  };

  // Handle date/time change
  const handleFechaHoraChange = (value) => {
    setFechaHora(value);
    
    // Clear error when user selects date
    if (errors.fechaHora) {
      setErrors(prev => ({ ...prev, fechaHora: '' }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!selectedActor) {
      newErrors.actor = 'Debe seleccionar el actor que realizó la acción';
    }

    if (!selectedAction) {
      newErrors.action = 'Debe seleccionar la acción reportada';
    }

    if (!fechaHora) {
      newErrors.fechaHora = 'Debe especificar cuándo ocurrió la acción';
    }

    if (!evidencia.trim()) {
      newErrors.evidencia = 'Debe proporcionar evidencia de la acción';
    } else if (evidencia.length < 50) {
      newErrors.evidencia = 'La evidencia debe tener al menos 50 caracteres';
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
      const reportData = {
        actionId: selectedAction.id,
        actorId: selectedActor.id,
        reporterId: '1', // Current user (Juan)
        evidencia: evidencia,
        fechaHoraActo: fechaHora
      };
      
      const savedReport = await dataService.createReport(reportData);
      console.log('Report saved:', savedReport);
      
      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setSelectedActor(null);
        setSelectedAction(null);
        setEvidencia('');
        setFechaHora('');
        setShowActionDetails(false);
        setShowSuccess(false);
        router.push('/'); // Navigate back to home
      }, 3000);
      
    } catch (error) {
      console.error('Error saving report:', error);
      setErrors({ submit: 'Error al guardar el reporte. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultEvidencia = `# Evidencia del acto reportado

## Fecha y hora
[Especificar cuándo ocurrió la acción]

## Ubicación
[Dónde sucedió la acción]

## Evidencia presentada
- **Fotografías**: [Descripción de las fotos]
- **Documentos**: [Documentos que respaldan el reporte]
- **Testigos**: [Personas que presenciaron la acción]

## Descripción detallada
[Descripción completa de lo que ocurrió]

## Observaciones adicionales
[Cualquier información adicional relevante]`;

  // Render success state
  if (showSuccess) {
    return (
      <div className="m-4">
        <Card className="p-6 text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">¡Reporte enviado exitosamente!</h2>
          <p className="text-gray-600 mb-4">
            Se ha reportado que <strong>{selectedActor?.name}</strong> realizó la acción <strong>"{selectedAction?.name}"</strong>.
          </p>
          <p className="text-sm text-gray-500">
            El reporte será enviado para validación por la comunidad.
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
            <h1 className="text-xl font-bold text-gray-800 mb-3">Reportar acto</h1>
            <p className="text-gray-700 text-sm leading-relaxed">
              Reportá que alguien realizó una acción específica y proporcioná la evidencia correspondiente.
            </p>
          </div>
        </Card>
      </div>

      {/* Form */}
      <div className="px-4 pb-6">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Actor Selection */}
            <FormField
              label="Actor"
              required
              error={errors.actor}
              description="Buscá y seleccioná la persona que realizó la acción"
            >
              <SearchInput
                placeholder="Buscar usuario por nombre o username..."
                onSearch={handleUserSearch}
                suggestions={userSearchResults}
                onSelect={handleUserSelect}
                value={selectedActor ? `${selectedActor.name} (@${selectedActor.username})` : ''}
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

            {/* Action Selection */}
            <FormField
              label="Acción reportada"
              required
              error={errors.action}
              description="Buscá y seleccioná la acción que fue realizada"
            >
              <SearchInput
                placeholder="Buscar acción por nombre..."
                onSearch={handleActionSearch}
                suggestions={actionSearchResults}
                onSelect={handleActionSelect}
                value={selectedAction ? selectedAction.name : ''}
                renderSuggestion={(action) => {
                  
                  
                  return (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <FileText size={16} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{action.name}</div>
                        <div className="text-sm text-gray-500">{action.description}</div>
                      </div>
                      
                    </div>
                  );
                }}
              />
            </FormField>

            {/* Date and Time Selection */}
            <FormField
              label="Fecha y hora del acto"
              required
              error={errors.fechaHora}
              description="¿Cuándo ocurrió la acción reportada?"
            >
              <input
                type="datetime-local"
                value={fechaHora}
                onChange={(e) => handleFechaHoraChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.fechaHora ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </FormField>

            {/* Action Details Display */}
            {selectedAction && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-800">Acción seleccionada</h3>
                  <button
                    type="button"
                    onClick={() => setShowActionDetails(!showActionDetails)}
                    className="flex items-center text-blue-600 text-sm hover:text-blue-700"
                  >
                    <Eye size={16} className="mr-1" />
                    {showActionDetails ? 'Ocultar' : 'Ver'} detalles
                  </button>
                </div>
                
                <div className="mb-2">
                  <div className="font-medium text-gray-800">{selectedAction.name}</div>
                  <div className="text-sm text-gray-600 mb-2">{selectedAction.description}</div>
                </div>

                {showActionDetails && selectedAction.detalles && (
                  <div className="mt-4 border-t border-blue-200 pt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Descripción completa:</h4>
                    <div className="bg-white rounded p-3 max-h-60 overflow-y-auto">
                      <MarkdownViewer content={selectedAction.detalles} />
                    </div>
                  </div>
                )}

                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Atención:</strong> Leé cuidadosamente la descripción de la acción antes de escribir tu evidencia. 
                    Asegurate de que la evidencia demuestre claramente que la acción descrita efectivamente ocurrió.
                  </p>
                </div>
              </div>
            )}

            {/* Evidence Section */}
            {selectedAction && (
              <FormField
                label="Evidencia"
                required
                error={errors.evidencia}
                description="Proporcioná evidencia detallada de que la acción reportada efectivamente ocurrió"
              >
                <div className={`border rounded-lg ${errors.evidencia ? 'border-red-500' : 'border-gray-300'}`}>
                  <MarkdownEditor
                    value={evidencia || defaultEvidencia}
                    onChange={handleEvidenciaChange}
                    placeholder="Describí la evidencia que tenés..."
                    height={300}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Incluí fotos, documentos, testigos, ubicación, fecha/hora y cualquier detalle relevante
                </p>
              </FormField>
            )}

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
                disabled={isSubmitting || !selectedActor || !selectedAction}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-white ${
                  isSubmitting || !selectedActor || !selectedAction
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Enviando reporte...' : 'Reportar acto'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}