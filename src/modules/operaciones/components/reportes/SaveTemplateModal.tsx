import React, { useState } from 'react';
import { X, Save } from 'lucide-react';


interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string, isShared: boolean) => Promise<void>;
  saving: boolean;
  initialName?: string;
}

export const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  saving,
  initialName = ''
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      setError('El nombre de la plantilla es requerido');
      return;
    }
    try {
      await onSave(name, description, isShared);
      setName('');
      setDescription('');
      setIsShared(false);
      setError('');
    } catch {
      // Error is handled in the parent component
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-wine-950 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-transparent dark:border-wine-800/30">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-wine-800/30 bg-wine-50/50 dark:bg-wine-900/40">
          <h3 className="text-lg font-semibold text-wine-900 dark:text-wine-100 flex items-center">
            <Save className="w-5 h-5 mr-2 text-wine-600 dark:text-wine-400" />
            Guardar Plantilla
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-wine-800/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nombre de la plantilla <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ej: Ventas de este mes"
              className="w-full px-3 py-2 border border-slate-300 dark:border-wine-700/50 bg-white dark:bg-wine-900/20 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-500 dark:focus:ring-wine-600 focus:border-wine-500 transition-shadow"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles sobre qué incluye este reporte..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 dark:border-wine-700/50 bg-white dark:bg-wine-900/20 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-500 dark:focus:ring-wine-600 focus:border-wine-500 transition-shadow resize-none"
            />
          </div>

          <div className="flex items-center">
            <input
              id="isShared"
              type="checkbox"
              checked={isShared}
              onChange={(e) => setIsShared(e.target.checked)}
              className="w-4 h-4 text-wine-600 border-slate-300 dark:border-wine-700/50 bg-white dark:bg-wine-900/20 rounded focus:ring-wine-500 dark:focus:ring-wine-600"
            />
            <label htmlFor="isShared" className="ml-2 block text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              Compartir con otros usuarios
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end p-4 border-t border-slate-100 dark:border-wine-800/30 bg-slate-50 dark:bg-wine-950/50 gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-wine-900/40 border border-slate-300 dark:border-wine-700/50 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-wine-600 hover:bg-wine-700 border border-transparent rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : (
              'Guardar Plantilla'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
