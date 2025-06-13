"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import FormField from '@/components/shared/FormField';
import MarkdownEditor from '@/components/shared/MarkdownEditor';
import { dataService } from '@/services/dataService';

export default function DescribirAccionScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    resumen: '',
    detalles: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre de la acción es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.resumen.trim()) {
      newErrors.resumen = 'El resumen es requerido';
    } else if (formData.resumen.length < 10) {
      newErrors.resumen = 'El resumen debe tener al menos 10 caracteres';
    }

    if (!formData.detalles.trim()) {
      newErrors.detalles = 'Los detalles son requeridos';
    } else if (formData.detalles.length < 50) {
      newErrors.detalles = 'Los detalles deben tener al menos 50 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const savedAction = await dataService.saveAction(formData);
      console.log('Action saved:', savedAction);
      
      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({ nombre: '', resumen: '', detalles: '' });
        setShowSuccess(false);
        router.push('/'); // Navigate back to home
      }, 2000);
      
    } catch (error) {
      console.error('Error saving action:', error);
      setErrors({ submit: 'Error al guardar la acción. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultMarkdown = `# Descripción de la acción

## ¿En qué consiste?
Describí aquí los detalles de la acción...

## Requisitos o condiciones
- Requisito 1
- Requisito 2
- Requisito 3

## Evidencia requerida
Para demostrar que esta acción sucedió, se necesita:
- Tipo de evidencia 1 (ej: foto, documento, testigo)
- Tipo de evidencia 2
- Tipo de evidencia 3

## Consideraciones adicionales
Información adicional relevante...`;

  if (showSuccess) {
    return (
      <div className="m-4">
        <Card className="p-6 text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">¡Acción creada exitosamente!</h2>
          <p className="text-gray-600">
            La acción "{formData.nombre}" ha sido guardada y estará disponible para reportes.
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
            <h1 className="text-xl font-bold text-gray-800 mb-3">Describir acción</h1>
            <p className="text-gray-700 text-sm leading-relaxed">
              Creá una nueva acción que podrá ser reportada y validada por la comunidad.
            </p>
          </div>
        </Card>
      </div>

      {/* Form */}
      <div className="px-4 pb-6">
        <Card className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Action Name */}
            <FormField
              label="Nombre de la acción"
              required
              error={errors.nombre}
            >
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Ejemplo: Pescar trucha bebé"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </FormField>

            {/* Action Summary */}
            <FormField
              label="Resumen de la acción"
              required
              error={errors.resumen}
              description="Describí brevemente en qué consiste la acción"
            >
              <textarea
                value={formData.resumen}
                onChange={(e) => handleInputChange('resumen', e.target.value)}
                placeholder="Ejemplo: Romper la sustentabilidad pescando truchas de menos de 5 cm de largo"
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.resumen ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </FormField>

            {/* Details Description */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Detallá la acción
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Describí de qué se trata la acción lo más precisamente que puedas, y qué evidencia hace falta para demostrar que la acción sucedió.
              </p>
            </div>

            {/* Markdown Editor */}
            <FormField
              label="Detalles"
              required
              error={errors.detalles}
            >
              <div className={`border rounded-lg ${errors.detalles ? 'border-red-500' : 'border-gray-300'}`}>
                <MarkdownEditor
                  value={formData.detalles || defaultMarkdown}
                  onChange={(value) => handleInputChange('detalles', value || '')}
                  placeholder="Describí los detalles de la acción usando markdown..."
                  height={300}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Podés usar markdown para formatear el texto (títulos, listas, negritas, etc.)
              </p>
            </FormField>

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
                disabled={isSubmitting}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-white ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Guardando...' : 'Crear acción'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}