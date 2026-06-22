import { useState } from 'react';
import { 
  FileBarChart, Play, Save, Bookmark, Loader2, Info, LayoutDashboard, Database 
} from 'lucide-react';
import { ReportFiltersBuilder } from '../../components/reportes/ReportFiltersBuilder';
import { ReportPreviewTable } from '../../components/reportes/ReportPreviewTable';
import { SaveTemplateModal } from '../../components/reportes/SaveTemplateModal';
import { AIReportAssistant } from '../../components/reportes/AIReportAssistant';
import { Select } from '@/shared/components/ui';
import { useReportes } from '../../hooks/useReportes';
import { FieldDefinition } from '../../types/report.types';
import { AIReportResponse } from '../../types/report.types';

export default function ReportesPage() {
  const { state, actions } = useReportes();
  const {
    catalog,
    templates,
    selectedReportType,
    selectedFields,
    filters,
    dateFrom,
    dateTo,
    activeTemplateId,
    result,
    loading,
    exporting,
    fetchingData,
    isSaveModalOpen,
    sortField,
    sortOrder,
    currentReportDef,
  } = state;

  const {
    handleSelectReportType,
    toggleFieldSelection,
    handleLoadTemplate,
      handleRunReport,
      handleSortChange,
      handleExport,
      handleSaveTemplate,
      setFilters,
      setDateFrom,
      setDateTo,
      setIsSaveModalOpen,
      setResult,
  } = actions;

  const [aiLoading, setAiLoading] = useState(false);

  const handleAIResult = (response: AIReportResponse) => {
    if (response.query) {
      handleSelectReportType(response.query.reportType);
      if (response.query.selectedFields?.length) {
        actions.setSelectedFields?.(response.query.selectedFields);
      }
      if (response.query.filters?.length) {
        setFilters(response.query.filters);
      }
      if (response.query.dateFrom) {
        setDateFrom(response.query.dateFrom.substring(0, 10));
      }
      if (response.query.dateTo) {
        setDateTo(response.query.dateTo.substring(0, 10));
      }
    }
    setResult(response.result);
  };

  if (fetchingData) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-wine-600 dark:text-wine-400 animate-spin mb-4" />
          <p className="text-wine-800 dark:text-wine-200 font-medium">Cargando diseñador de reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:flex-row gap-6 p-4 lg:p-6 overflow-hidden">
      {/* LEFT PANEL: Configuration */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {/* Report Type Selector */}
        <div className="bg-white dark:bg-wine-950/20 rounded-xl shadow-sm border border-slate-200 dark:border-wine-800/30 p-4">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
            <Database className="w-4 h-4 mr-2 text-wine-600 dark:text-wine-400" />
            Fuente de Datos
          </h2>
          <Select
            value={selectedReportType}
            onChange={(val) => handleSelectReportType(val)}
            options={catalog.map(c => ({ value: c.key, label: c.label }))}
            placeholder="Seleccione un reporte..."
          />
        </div>

        {/* Date Range (if applicable) */}
        {currentReportDef?.fields.some((f: FieldDefinition) => f.type === 'DATE') && (
          <div className="bg-white dark:bg-wine-950/20 rounded-xl shadow-sm border border-slate-200 dark:border-wine-800/30 p-4">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Rango de Fechas</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Desde</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 dark:border-wine-700/50 bg-white dark:bg-wine-900/10 text-slate-900 dark:text-slate-100 rounded text-sm focus:ring-wine-500 focus:border-wine-500 dark:focus:ring-wine-600"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Hasta</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 dark:border-wine-700/50 bg-white dark:bg-wine-900/10 text-slate-900 dark:text-slate-100 rounded text-sm focus:ring-wine-500 focus:border-wine-500 dark:focus:ring-wine-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Column Selector */}
        {currentReportDef && (
          <div className="bg-white dark:bg-wine-950/20 rounded-xl shadow-sm border border-slate-200 dark:border-wine-800/30 p-4 flex-1">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
              <LayoutDashboard className="w-4 h-4 mr-2 text-wine-600 dark:text-wine-400" />
              Columnas
            </h2>
            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              {currentReportDef.fields.map((field: FieldDefinition) => (
                <label key={field.key} className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.key)}
                    onChange={() => toggleFieldSelection(field.key)}
                    className="w-4 h-4 text-wine-600 rounded border-slate-300 dark:border-wine-700/50 bg-white dark:bg-wine-900/20 focus:ring-wine-500 transition-all"
                  />
                  <span className="ml-2 text-sm text-slate-700 dark:text-slate-300 group-hover:text-wine-700 dark:group-hover:text-wine-400 transition-colors">
                    {field.label}
                  </span>
                  {field.kind === 'MEASURE' && (
                    <span className="ml-auto text-[10px] bg-wine-100 text-wine-700 px-1.5 py-0.5 rounded font-medium">
                      Métrica
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Saved Templates */}
        {templates.length > 0 && (
          <div className="bg-white dark:bg-wine-950/20 rounded-xl shadow-sm border border-slate-200 dark:border-wine-800/30 p-4">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
              <Bookmark className="w-4 h-4 mr-2 text-wine-600 dark:text-wine-400" />
              Plantillas Guardadas
            </h2>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {templates.map(tpl => (
                <div 
                  key={tpl.id}
                  onClick={() => handleLoadTemplate(tpl)}
                  className={`p-2 rounded-lg border text-sm cursor-pointer transition-all ${
                    activeTemplateId === tpl.id 
                      ? 'bg-wine-50 dark:bg-wine-900/40 border-wine-300 dark:border-wine-700 shadow-sm' 
                      : 'bg-white dark:bg-transparent border-slate-200 dark:border-wine-800/30 hover:border-wine-200 dark:hover:border-wine-600/50 hover:bg-slate-50 dark:hover:bg-wine-900/20'
                  }`}
                >
                  <div className="font-medium text-slate-800 dark:text-slate-200">{tpl.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex justify-between">
                    <span>{catalog.find(c => c.key === tpl.reportType)?.label || tpl.reportType}</span>
                    {tpl.isShared && <span className="text-blue-600 dark:text-blue-400">Compartido</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL: Filters & Preview */}
      <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 gap-6">
          {/* Top actions & Filters */}
          <div className="bg-white dark:bg-wine-950/20 rounded-xl shadow-sm border border-slate-200 dark:border-wine-800/30 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h1 className="text-xl font-bold text-wine-900 dark:text-wine-100 flex items-center">
                <FileBarChart className="w-6 h-6 mr-2 text-wine-600 dark:text-wine-400" />
                Diseñador de Reportes
              </h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSaveModalOpen(true)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-wine-900/20 border border-slate-300 dark:border-wine-700/50 rounded-lg hover:bg-slate-50 dark:hover:bg-wine-900/40 hover:text-wine-700 dark:hover:text-wine-300 transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Plantilla
                </button>
                <button
                  onClick={() => handleRunReport(0)}
                  disabled={loading || selectedFields.length === 0}
                  className="flex items-center px-5 py-2 text-sm font-medium text-white bg-wine-600 border border-transparent rounded-lg hover:bg-wine-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                  Generar Reporte
                </button>
              </div>
            </div>

            <AIReportAssistant
              onResult={handleAIResult}
              loading={aiLoading}
              setLoading={setAiLoading}
            />

            <div className="border-t border-wine-200 dark:border-wine-700/30 pt-5">
              {currentReportDef ? (
                <ReportFiltersBuilder
                  fields={currentReportDef.fields}
                  filters={filters}
                  onChange={setFilters}
                />
              ) : (
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 p-4 bg-slate-50 dark:bg-wine-900/20 rounded-lg">
                  <Info className="w-5 h-5 mr-2 text-wine-500 dark:text-wine-400" />
                  Selecciona una fuente de datos en el panel izquierdo para comenzar.
                </div>
              )}
            </div>
          </div>

          {/* Preview Area */}
          <ReportPreviewTable
            result={result}
            loading={loading}
            onPageChange={handleRunReport}
            onSortChange={handleSortChange}
            currentSortField={sortField}
            currentSortOrder={sortOrder}
            onExport={handleExport}
            exporting={exporting}
          />
        </div>
      </div>

      <SaveTemplateModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveTemplate}
        saving={false}
        initialName={templates.find(t => t.id === activeTemplateId)?.name || currentReportDef?.label}
      />
    </div>
  );
}
