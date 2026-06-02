import React from 'react';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, FileDown } from 'lucide-react';
import { ReportResult } from '../../types/report.types';

interface ReportPreviewTableProps {
  result: ReportResult | null;
  loading: boolean;
  onPageChange: (offset: number) => void;
  onSortChange: (field: string) => void;
  currentSortField?: string;
  currentSortOrder: 'asc' | 'desc';
  onExport: (format: 'pdf' | 'excel' | 'json' | 'html') => void;
  exporting: boolean;
}

export const ReportPreviewTable: React.FC<ReportPreviewTableProps> = ({
  result,
  loading,
  onPageChange,
  onSortChange,
  currentSortField,
  currentSortOrder,
  onExport,
  exporting
}) => {
  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-wine-200 border-t-wine-600 rounded-full animate-spin"></div>
        <p className="text-sm text-wine-600 font-medium animate-pulse">Ejecutando reporte...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-wine-200 dark:border-wine-800/50 rounded-xl bg-wine-50/50 dark:bg-wine-950/20 backdrop-blur-sm">
        <div className="w-16 h-16 mb-4 rounded-full bg-wine-100 dark:bg-wine-900/40 flex items-center justify-center">
          <FileDown className="w-8 h-8 text-wine-500 dark:text-wine-400" />
        </div>
        <p className="text-wine-700 dark:text-wine-300 font-medium text-lg mb-1">Crea tu primer reporte</p>
        <p className="text-wine-500/80 dark:text-wine-400/80 text-sm">Configura y ejecuta el reporte para ver la vista previa</p>
      </div>
    );
  }

  if (result.rows.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-wine-200 dark:border-wine-800/50 rounded-xl bg-wine-50/50 dark:bg-wine-950/20 backdrop-blur-sm">
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-wine-900/40 flex items-center justify-center">
          <FileDown className="w-8 h-8 text-slate-400 dark:text-wine-500/50" />
        </div>
        <p className="text-wine-700 dark:text-wine-300 font-medium text-lg mb-1">Sin resultados</p>
        <p className="text-wine-500/80 dark:text-wine-400/80 text-sm">No se encontraron datos con los filtros seleccionados.</p>
      </div>
    );
  }

  const { columns, columnLabels, rows, total, limit, offset } = result;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4 w-full max-w-full min-w-0">
      {/* Header and Export actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-wine-900 dark:text-wine-100">{result.reportLabel}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Mostrando {offset + 1} a {Math.min(offset + limit, total)} de {total} registros
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onExport('pdf')}
            disabled={exporting}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800/50 rounded-lg transition-colors disabled:opacity-50"
          >
            <FileDown className="w-4 h-4 mr-1.5" />
            PDF
          </button>
          <button
            onClick={() => onExport('excel')}
            disabled={exporting}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/50 rounded-lg transition-colors disabled:opacity-50"
          >
            <FileDown className="w-4 h-4 mr-1.5" />
            Excel
          </button>
          <button
            onClick={() => onExport('json')}
            disabled={exporting}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800/50 rounded-lg transition-colors disabled:opacity-50"
          >
            <FileDown className="w-4 h-4 mr-1.5" />
            JSON
          </button>
          <button
            onClick={() => onExport('html')}
            disabled={exporting}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 border border-orange-200 dark:border-orange-800/50 rounded-lg transition-colors disabled:opacity-50"
          >
            <FileDown className="w-4 h-4 mr-1.5" />
            HTML
          </button>
        </div>
      </div>

      {/* Applied Filters Info */}
      {result.appliedFilters && result.appliedFilters.length > 0 && (
        <div className="bg-slate-50 dark:bg-wine-900/20 p-3 rounded-lg border border-slate-200 dark:border-wine-800/30 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Filtros aplicados: </span>
          <span className="text-slate-600 dark:text-slate-400">{result.appliedFilters.join(' • ')}</span>
        </div>
      )}

      {/* Table container */}
      <div className="bg-white dark:bg-wine-950/20 rounded-xl shadow-sm border border-slate-200 dark:border-wine-800/30 overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto w-full max-w-full">
          <table className="w-full min-w-max text-left border-collapse">
            <thead>
              <tr className="bg-wine-900 text-white">
                {columns.map((col) => (
                  <th
                    key={col}
                    onClick={() => onSortChange(col)}
                    className="p-3 text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-wine-800 transition-colors select-none group min-w-[120px] lg:min-w-[150px]"
                  >
                    <div className="flex items-center justify-between">
                      {columnLabels[col] || col}
                      <span className="ml-2 text-wine-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        {currentSortField === col ? (
                          currentSortOrder === 'asc' ? <ArrowUp className="w-4 h-4 opacity-100" /> : <ArrowDown className="w-4 h-4 opacity-100" />
                        ) : (
                          <ArrowDown className="w-4 h-4" />
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-wine-800/30">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-wine-50/30 dark:hover:bg-wine-900/40 transition-colors">
                  {columns.map((col) => {
                    const val = row[col];
                    return (
                      <td key={col} className="p-3 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {val !== null && val !== undefined ? val : <span className="text-slate-400 dark:text-slate-500 italic">null</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-wine-800/30 bg-slate-50 dark:bg-wine-900/20">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Página {currentPage} de {totalPages || 1}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(0, offset - limit))}
              disabled={currentPage <= 1}
              className="p-1 rounded bg-white dark:bg-wine-900/40 border border-slate-300 dark:border-wine-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-wine-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => onPageChange(offset + limit)}
              disabled={currentPage >= totalPages}
              className="p-1 rounded bg-white dark:bg-wine-900/40 border border-slate-300 dark:border-wine-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-wine-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
