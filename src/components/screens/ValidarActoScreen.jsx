"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, AlertTriangle, User, FileText, Calendar, MapPin } from 'lucide-react';
import Card from '@/components/ui/Card';
import MarkdownViewer from '@/components/shared/MarkdownViewer';
import { dataService } from '@/services/dataService';

export default function ValidarActoScreen() {
  const router = useRouter();
  const [pendingReports, setPendingReports] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  const [currentActor, setCurrentActor] = useState(null);
  const [currentAction, setCurrentAction] = useState(null);
  const [decision, setDecision] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load pending reports on component mount
  useEffect(() => {
    loadPendingReports();
  }, []);

  const loadPendingReports = async () => {
    try {
      const reports = await dataService.getPendingReports();
      setPendingReports(reports);
      
      if (reports.length > 0) {
        loadReport(reports[0], 0);
      }
    } catch (error) {
      console.error('Error loading pending reports:', error);
    }
  };

  // Load a specific report with its related data
  const loadReport = async (report, index) => {
    try {
      const [actor, action] = await Promise.all([
        dataService.getUserById(report.actorId),
        dataService.getActionById(report.actionId)
      ]);
      
      setCurrentReport(report);
      setCurrentActor(actor);
      setCurrentAction(action);
      setCurrentIndex(index);
      setDecision(null);
    } catch (error) {
      console.error('Error loading report details:', error);
    }
  };

  // Handle validation decision
  const handleValidation = async (isValid) => {
    if (!currentReport) return;

    setIsSubmitting(true);
    
    try {
      // Validate the report
      await dataService.validateReport(currentReport.id, isValid, '1'); // Current user Juan as validator
      
      setDecision(isValid);
      setShowSuccess(true);
      
      // Move to next report after showing success
      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < pendingReports.length) {
          loadReport(pendingReports[nextIndex], nextIndex);
          setShowSuccess(false);
        } else {
          // No more reports to validate
          router.push('/');
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error validating report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show success state
  if (showSuccess && decision !== null) {
    return (
      <div className="m-4">
        <Card className="p-6 text-center">
          {decision ? (
            <>
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">¡Validación confirmada!</h2>
              <p className="text-gray-600 mb-4">
                Has confirmado que <strong>{currentActor?.name}</strong> efectivamente realizó la acción <strong>"{currentAction?.name}"</strong>.
              </p>
            </>
          ) : (
            <>
              <XCircle size={48} className="text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Reporte rechazado</h2>
              <p className="text-gray-600 mb-4">
                Has determinado que la evidencia no es suficiente para confirmar que <strong>{currentActor?.name}</strong> realizó la acción <strong>"{currentAction?.name}"</strong>.
              </p>
            </>
          )}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 font-medium">
              +₭50 ganados por tu validación
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Show empty state if no pending reports
  if (pendingReports.length === 0) {
    return (
      <div className="m-4">
        <Card className="p-6 text-center">
          <CheckCircle size={48} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">¡Todo al día!</h2>
          <p className="text-gray-600">
            No hay reportes pendientes de validación en este momento.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </Card>
      </div>
    );
  }

  // Show loading state
  if (!currentReport || !currentActor || !currentAction) {
    return (
      <div className="m-4">
        <Card className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reporte...</p>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Title and Progress */}
      <div className="m-4">
        <Card>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold text-gray-800">Validar acto</h1>
              <div className="text-sm text-gray-500">
                {currentIndex + 1} de {pendingReports.length}
              </div>
            </div>
            
            {/* Summary */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <AlertTriangle size={20} className="text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-yellow-800 font-medium mb-1">
                    Se reportó que <strong>{currentActor.name}</strong> realizó la acción <strong>"{currentAction.name}"</strong>
                  </p>
                  <p className="text-yellow-700 text-sm">
                    Hay <strong>₭50</strong> en juego si respondés correctamente.
                  </p>
                </div>
              </div>
            </div>

            {/* Report Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <User size={16} className="text-gray-500 mr-2" />
                <span className="text-gray-600">Actor:</span>
                <span className="font-medium text-gray-800 ml-2">{currentActor.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="text-gray-500 mr-2" />
                <span className="text-gray-600">Fecha del acto:</span>
                <span className="font-medium text-gray-800 ml-2">
                  {formatDate(currentReport.fechaHoraActo)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Description */}
      <div className="px-4 pb-4">
        <Card>
          <div className="p-4">
            <div className="flex items-center mb-3">
              <FileText size={18} className="text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-800">Descripción de la acción</h3>
              <div className="ml-auto text-sm font-medium text-blue-600">
                Acción: {currentAction.name}
              </div>
            </div>
            
            <div className="mb-3">
              <h4 className="font-medium text-gray-800">{currentAction.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{currentAction.description}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
              <MarkdownViewer content={currentAction.fullDescription || `# ${currentAction.name}\n\n${currentAction.description}`} />
            </div>
          </div>
        </Card>
      </div>

      {/* Evidence */}
      <div className="px-4 pb-4">
        <Card>
          <div className="p-4">
            <div className="flex items-center mb-3">
              <MapPin size={18} className="text-green-600 mr-2" />
              <h3 className="font-medium text-gray-800">Evidencia presentada</h3>
            </div>
            
            <div className="text-xs text-gray-500 mb-3">
              Reportado el {formatDate(currentReport.createdAt)}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto">
              <MarkdownViewer content={currentReport.evidencia} />
            </div>
          </div>
        </Card>
      </div>

      {/* Validation Question */}
      <div className="px-4 pb-6">
        <Card>
          <div className="p-6">
            <h3 className="font-medium text-gray-800 mb-4 text-center">
              Dada la evidencia, ¿dirías que la acción fue reportada correctamente?
            </h3>
            
            <div className="flex gap-4">
              <button
                onClick={() => handleValidation(false)}
                disabled={isSubmitting}
                className={`flex-1 py-4 px-4 rounded-lg font-medium border-2 transition-all ${
                  isSubmitting 
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                    : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300'
                }`}
              >
                <div className="flex items-center justify-center">
                  <XCircle size={20} className="mr-2" />
                  {isSubmitting && decision === false ? 'Enviando...' : 'No, la evidencia no es suficiente'}
                </div>
              </button>
              
              <button
                onClick={() => handleValidation(true)}
                disabled={isSubmitting}
                className={`flex-1 py-4 px-4 rounded-lg font-medium border-2 transition-all ${
                  isSubmitting 
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                    : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300'
                }`}
              >
                <div className="flex items-center justify-center">
                  <CheckCircle size={20} className="mr-2" />
                  {isSubmitting && decision === true ? 'Enviando...' : 'Sí, la acción ocurrió'}
                </div>
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Tu decisión será registrada y recompensada con ₭50
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}