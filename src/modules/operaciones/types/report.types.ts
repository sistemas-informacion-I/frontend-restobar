export interface FieldDefinition {
  key: string;
  label: string;
  kind: 'PLAIN' | 'DIMENSION' | 'MEASURE';
  type: 'STRING' | 'NUMBER' | 'DATE' | 'BOOLEAN';
}

export interface ReportTypeDefinition {
  key: string;
  label: string;
  category: 'QBE' | 'ANALYTICAL' | 'MANAGERIAL';
  requiredAuthority: string;
  fields: FieldDefinition[];
  isAggregated?: boolean;
}

export interface ReportFilter {
  field: string;
  operator: string;
  value?: any;
}

export interface ReportRunRequest {
  reportType: string;
  selectedFields: string[];
  filters: ReportFilter[];
  sortField?: string;
  sortOrder: 'asc' | 'desc';
  dateFrom?: string | null;
  dateTo?: string | null;
  limit: number;
  offset: number;
  translatedTitle?: string;
  translatedCategory?: string;
  translatedLabels?: Record<string, string>;
}

export interface ReportResult {
  reportType: string;
  reportLabel: string;
  category: string;
  columns: string[];
  columnLabels: Record<string, string>;
  rows: any[];
  total: number;
  offset: number;
  limit: number;
  generatedAt: string;
  appliedFilters: string[];
}

export interface ReportTemplate {
  id: number;
  name: string;
  description?: string;
  department?: string;
  reportType: string;
  selectedFields: string[];
  filters: ReportFilter[];
  sortField?: string;
  sortOrder: 'asc' | 'desc';
  isShared: boolean;
  ownerId: number;
  ownerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReportTemplateRequest {
  name: string;
  description?: string;
  department?: string;
  reportType: string;
  selectedFields: string[];
  filters: ReportFilter[];
  sortField?: string;
  sortOrder: 'asc' | 'desc';
  isShared: boolean;
}
