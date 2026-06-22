import { httpClient } from '../../../core/api/http-client'
import type {
  DashboardFilters,
  KpiDTO,
  SalesPoint,
  CategorySales,
  MonthComparison,
  ProductRanking,
  EmployeeRanking,
} from '../types/dashboard.types'

function buildParams(filters?: DashboardFilters): Record<string, string | number> {
  const params: Record<string, string | number> = {}
  if (filters?.fechaInicio) params.fechaInicio = filters.fechaInicio
  if (filters?.fechaFin) params.fechaFin = filters.fechaFin
  if (filters?.idSucursal) params.idSucursal = filters.idSucursal
  return params
}

class DashboardService {
  async getKpi(filters?: DashboardFilters): Promise<KpiDTO> {
    return httpClient.get<KpiDTO>('/api/dashboard/kpi', { params: buildParams(filters) })
  }

  async getSalesEvolution(filters?: DashboardFilters): Promise<SalesPoint[]> {
    return httpClient.get<SalesPoint[]>('/api/dashboard/sales-evolution', {
      params: buildParams(filters),
    })
  }

  async getSalesByCategory(filters?: DashboardFilters): Promise<CategorySales[]> {
    return httpClient.get<CategorySales[]>('/api/dashboard/sales-by-category', {
      params: buildParams(filters),
    })
  }

  async getMonthComparison(filters?: DashboardFilters): Promise<MonthComparison> {
    return httpClient.get<MonthComparison>('/api/dashboard/month-comparison', {
      params: buildParams(filters),
    })
  }

  async getTopProducts(
    filters?: DashboardFilters & { limit?: number }
  ): Promise<ProductRanking[]> {
    const params = buildParams(filters)
    if (filters?.limit) params.limit = filters.limit
    return httpClient.get<ProductRanking[]>('/api/dashboard/top-products', { params })
  }

  async getEmployeeRanking(filters?: DashboardFilters): Promise<EmployeeRanking[]> {
    return httpClient.get<EmployeeRanking[]>('/api/dashboard/employee-ranking', {
      params: buildParams(filters),
    })
  }
}

export const dashboardService = new DashboardService()
