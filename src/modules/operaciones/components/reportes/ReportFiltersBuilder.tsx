import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FieldDefinition, ReportFilter } from '../../types/report.types';

interface ReportFiltersBuilderProps {
  fields: FieldDefinition[];
  filters: ReportFilter[];
  onChange: (filters: ReportFilter[]) => void;
}

const OPERATORS_BY_TYPE: Record<string, { value: string; label: string }[]> = {
  STRING: [
    { value: 'LIKE', label: 'Contiene' },
    { value: 'EQ', label: 'Es igual a' },
    { value: 'NE', label: 'Es diferente de' },
    { value: 'IS_NULL', label: 'Está vacío' },
    { value: 'IS_NOT_NULL', label: 'No está vacío' }
  ],
  NUMBER: [
    { value: 'EQ', label: 'Igual a' },
    { value: 'GT', label: 'Mayor que' },
    { value: 'LT', label: 'Menor que' },
    { value: 'GTE', label: 'Mayor o igual' },
    { value: 'LTE', label: 'Menor o igual' },
    { value: 'NE', label: 'Diferente de' }
  ],
  DATE: [
    { value: 'EQ', label: 'Igual a' },
    { value: 'GT', label: 'Después de' },
    { value: 'LT', label: 'Antes de' },
    { value: 'GTE', label: 'Desde' },
    { value: 'LTE', label: 'Hasta' }
  ],
  BOOLEAN: [
    { value: 'EQ', label: 'Es' },
    { value: 'NE', label: 'No es' }
  ]
};

export const ReportFiltersBuilder: React.FC<ReportFiltersBuilderProps> = ({ fields, filters, onChange }) => {
  const handleAddFilter = () => {
    if (fields.length === 0) return;
    const defaultField = fields[0];
    const defaultOperator = OPERATORS_BY_TYPE[defaultField.type]?.[0]?.value || 'EQ';
    onChange([...filters, { field: defaultField.key, operator: defaultOperator, value: '' }]);
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    onChange(newFilters);
  };

  const handleFilterChange = (index: number, key: keyof ReportFilter, value: any) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [key]: value };

    // Reset operator/value if field changes
    if (key === 'field') {
      const fieldDef = fields.find(f => f.key === value);
      if (fieldDef) {
        newFilters[index].operator = OPERATORS_BY_TYPE[fieldDef.type]?.[0]?.value || 'EQ';
        newFilters[index].value = '';
      }
    }

    onChange(newFilters);
  };

  const renderValueInput = (filter: ReportFilter, index: number) => {
    const fieldDef = fields.find(f => f.key === filter.field);
    if (!fieldDef) return null;

    if (filter.operator === 'IS_NULL' || filter.operator === 'IS_NOT_NULL') {
      return null;
    }

    if (fieldDef.type === 'BOOLEAN') {
      return (
        <select
          value={filter.value || ''}
          onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
          className="w-full px-3 py-2 bg-white/50 dark:bg-wine-950/40 border border-wine-200 dark:border-wine-700/50 rounded-lg text-sm dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-wine-500 dark:focus:ring-wine-600"
        >
          <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">Seleccionar...</option>
          <option value="true" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">Sí / Activo</option>
          <option value="false" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">No / Inactivo</option>
        </select>
      );
    }

    if (fieldDef.type === 'DATE') {
      return (
        <input
          type="date"
          value={filter.value || ''}
          onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
          className="w-full px-3 py-2 bg-white/50 dark:bg-wine-950/40 border border-wine-200 dark:border-wine-700/50 rounded-lg text-sm dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-wine-500 dark:focus:ring-wine-600"
        />
      );
    }

    return (
      <input
        type={fieldDef.type === 'NUMBER' ? 'number' : 'text'}
        value={filter.value || ''}
        onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
        placeholder="Valor..."
        className="w-full px-3 py-2 bg-white/50 dark:bg-wine-950/40 border border-wine-200 dark:border-wine-700/50 rounded-lg text-sm dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-wine-500 dark:focus:ring-wine-600 placeholder-slate-400 dark:placeholder-slate-500"
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-wine-900 dark:text-wine-100">Filtros Dinámicos</h3>
        <button
          onClick={handleAddFilter}
          className="flex items-center text-xs font-medium text-wine-600 dark:text-wine-400 hover:text-wine-800 dark:hover:text-wine-300 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          Agregar filtro
        </button>
      </div>

      {filters.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 italic">No hay filtros aplicados.</p>
      ) : (
        <div className="space-y-3">
          {filters.map((filter, index) => {
            const fieldDef = fields.find(f => f.key === filter.field);
            const operators = fieldDef ? OPERATORS_BY_TYPE[fieldDef.type] || [] : [];

            return (
              <div key={index} className="flex items-start gap-2 bg-wine-50/50 dark:bg-wine-900/20 p-2 rounded-lg border border-wine-100 dark:border-wine-800/30">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <select
                    value={filter.field}
                    onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
                    className="px-3 py-2 bg-white/50 dark:bg-wine-950/40 border border-wine-200 dark:border-wine-700/50 rounded-lg text-sm dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-wine-500 dark:focus:ring-wine-600"
                  >
                    {fields.map(f => (
                      <option key={f.key} value={f.key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">{f.label}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filter.operator}
                    onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                    className="px-3 py-2 bg-white/50 dark:bg-wine-950/40 border border-wine-200 dark:border-wine-700/50 rounded-lg text-sm dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-wine-500 dark:focus:ring-wine-600"
                  >
                    {operators.map(op => (
                      <option key={op.value} value={op.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">{op.label}</option>
                    ))}
                  </select>

                  <div>
                    {renderValueInput(filter, index)}
                  </div>
                </div>
                
                <button
                  onClick={() => handleRemoveFilter(index)}
                  className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Eliminar filtro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
