import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { reportService } from '../services/report.service';
import { 
  ReportTypeDefinition, ReportResult, ReportTemplate, ReportFilter, FieldDefinition 
} from '../types/report.types';

export const useReportes = () => {
  const [catalog, setCatalog] = useState<ReportTypeDefinition[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const [activeTemplateId, setActiveTemplateId] = useState<number | null>(null);
  const [result, setResult] = useState<ReportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  
  // Sorting & Pagination
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const limit = 50;

  const handleSelectReportType = (key: string, catData: ReportTypeDefinition[] = catalog) => {
    setSelectedReportType(key);
    setActiveTemplateId(null);
    setResult(null);
    setFilters([]);
    setDateFrom('');
    setDateTo('');
    
    const def = catData.find(r => r.key === key);
    if (def) {
      const initialFields = def.fields
        .filter((f: FieldDefinition) => f.kind !== 'MEASURE')
        .map((f: FieldDefinition) => f.key);
      
      setSelectedFields(initialFields.length > 0 ? initialFields : def.fields.map((f: FieldDefinition) => f.key));
      
      const firstSortable = def.fields.find((f: FieldDefinition) => f.kind !== 'MEASURE')?.key;
      setSortField(firstSortable);
      setSortOrder('asc');
    }
  };

  const loadInitialData = async () => {
    try {
      setFetchingData(true);
      const [catalogData, templatesData] = await Promise.all([
        reportService.getCatalog(),
        reportService.getTemplates()
      ]);
      setCatalog(catalogData);
      setTemplates(templatesData);
      
      if (catalogData.length > 0) {
        handleSelectReportType(catalogData[0].key, catalogData);
      }
    } catch (error) {
      toast.error('Error al cargar datos del reporteador');
      console.error(error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentReportDef = useMemo(() => {
    return catalog.find(r => r.key === selectedReportType);
  }, [catalog, selectedReportType]);

  const toggleFieldSelection = (key: string) => {
    setSelectedFields(prev => {
      if (prev.includes(key)) {
        if (prev.length === 1) return prev; // Don't allow 0 fields
        return prev.filter(f => f !== key);
      }
      return [...prev, key];
    });
  };

  const handleLoadTemplate = (template: ReportTemplate) => {
    setSelectedReportType(template.reportType);
    setSelectedFields(template.selectedFields);
    setFilters(template.filters);
    setSortField(template.sortField);
    setSortOrder(template.sortOrder || 'asc');
    setActiveTemplateId(template.id);
    setResult(null);
    toast.success(`Plantilla "${template.name}" cargada`);
  };

  const handleRunReport = async (newOffset = 0) => {
    if (!currentReportDef || selectedFields.length === 0) return;
    
    try {
      setLoading(true);
      
      const response = await reportService.runReport({
        reportType: selectedReportType,
        selectedFields,
        filters,
        sortField,
        sortOrder,
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
        limit,
        offset: newOffset
      });
      
      setResult(response);
    } catch (error) {
      toast.error('Error al ejecutar el reporte');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (field: string) => {
    let newOrder: 'asc' | 'desc' = 'asc';
    if (sortField === field && sortOrder === 'asc') {
      newOrder = 'desc';
    }
    setSortField(field);
    setSortOrder(newOrder);
    if (result) {
      handleRunReport(0);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'json' | 'html') => {
    if (!currentReportDef) return;
    
    try {
      setExporting(true);
      const blob = await reportService.exportReport({
        reportType: selectedReportType,
        selectedFields,
        filters,
        sortField,
        sortOrder,
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
        limit: 5000,
        offset: 0
      }, format);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const ext = format === 'excel' ? 'xlsx' : format;
      link.setAttribute('download', `Reporte_${currentReportDef.label}_${Date.now()}.${ext}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Reporte exportado como ${format.toUpperCase()}`);
    } catch (error) {
      toast.error(`Error al exportar reporte en formato ${format}`);
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  const handleSaveTemplate = async (name: string, description: string, isShared: boolean) => {
    try {
      if (activeTemplateId) {
        await reportService.updateTemplate(activeTemplateId, {
          name,
          description,
          selectedFields,
          filters,
          sortField,
          sortOrder,
          isShared
        });
        toast.success('Plantilla actualizada');
      } else {
        const newTpl = await reportService.createTemplate({
          reportType: selectedReportType,
          name,
          description,
          selectedFields,
          filters,
          sortField,
          sortOrder,
          isShared
        });
        setActiveTemplateId(newTpl.id);
        toast.success('Nueva plantilla guardada');
      }
      
      const updatedTemplates = await reportService.getTemplates();
      setTemplates(updatedTemplates);
      setIsSaveModalOpen(false);
    } catch (error) {
      toast.error('Error al guardar la plantilla');
      throw error;
    }
  };

  return {
    state: {
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
    },
    actions: {
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
      setSelectedFields,
    }
  };
};
