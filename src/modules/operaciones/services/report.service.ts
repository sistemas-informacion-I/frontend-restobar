import axios, { AxiosInstance } from 'axios';
import {
  ReportTypeDefinition,
  ReportRunRequest,
  ReportResult,
  ReportTemplate,
  ReportTemplateRequest,
  AIReportResponse
} from '../types/report.types';

const REPORTS_API_URL = import.meta.env.VITE_REPORTS_API_URL || 'http://localhost:8001/api/reports';

class ReportService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: REPORTS_API_URL,
      timeout: 30000,
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('gaira_access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getCatalog(): Promise<ReportTypeDefinition[]> {
    const response = await this.api.get<ReportTypeDefinition[]>('/catalog');
    return response.data;
  }

  async runReport(request: ReportRunRequest): Promise<ReportResult> {
    const response = await this.api.post<ReportResult>('/run', request);
    return response.data;
  }

  async exportReport(request: ReportRunRequest, format: 'pdf' | 'excel' | 'html' | 'json'): Promise<Blob> {
    const response = await this.api.post('/export', request, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }

  async getTemplates(): Promise<ReportTemplate[]> {
    const response = await this.api.get<ReportTemplate[]>('/templates');
    return response.data;
  }

  async createTemplate(request: ReportTemplateRequest): Promise<ReportTemplate> {
    const response = await this.api.post<ReportTemplate>('/templates', request);
    return response.data;
  }

  async updateTemplate(id: number, request: Partial<ReportTemplateRequest>): Promise<ReportTemplate> {
    const response = await this.api.put<ReportTemplate>(`/templates/${id}`, request);
    return response.data;
  }

  async deleteTemplate(id: number): Promise<void> {
    await this.api.delete(`/templates/${id}`);
  }

  async runReportByPrompt(prompt: string): Promise<AIReportResponse> {
    const response = await this.api.post<AIReportResponse>('/prompt', { prompt });
    return response.data;
  }

  async runReportByAudio(audioBlob: Blob): Promise<AIReportResponse> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    const response = await this.api.post<AIReportResponse>('/audio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
}

export const reportService = new ReportService();
