import useSWR from 'swr'
import { dashboardService } from '../services/dashboard.service'
import type {
  DashboardFilters,
  KpiDTO,
  SalesPoint,
  CategorySales,
  MonthComparison,
  ProductRanking,
  EmployeeRanking,
} from '../types/dashboard.types'
import {
  mockKpi,
  mockSalesEvolution,
  mockSalesByCategory,
  mockMonthComparison,
  mockTopProducts,
  mockEmployeeRanking,
} from '../types/dashboard.mock'

const USE_MOCK = true

function swrKey(prefix: string, filters?: DashboardFilters): string {
  const params = new URLSearchParams()
  if (filters?.fechaInicio) params.set('fechaInicio', filters.fechaInicio)
  if (filters?.fechaFin) params.set('fechaFin', filters.fechaFin)
  if (filters?.idSucursal) params.set('idSucursal', String(filters.idSucursal))
  const qs = params.toString()
  return qs ? `${prefix}?${qs}` : prefix
}

function delay<T>(data: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), 400))
}

export function useDashboardKpi(filters?: DashboardFilters) {
  const key = swrKey('/api/dashboard/kpi', filters)
  const fetcher = USE_MOCK ? () => delay(mockKpi) : () => dashboardService.getKpi(filters)
  return useSWR<KpiDTO>(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
}

export function useDashboardSalesEvolution(filters?: DashboardFilters) {
  const key = swrKey('/api/dashboard/sales-evolution', filters)
  const fetcher = USE_MOCK ? () => delay(mockSalesEvolution) : () => dashboardService.getSalesEvolution(filters)
  return useSWR<SalesPoint[]>(key, fetcher, {
    revalidateOnFocus: false,
  })
}

export function useDashboardSalesByCategory(filters?: DashboardFilters) {
  const key = swrKey('/api/dashboard/sales-by-category', filters)
  const fetcher = USE_MOCK ? () => delay(mockSalesByCategory) : () => dashboardService.getSalesByCategory(filters)
  return useSWR<CategorySales[]>(key, fetcher, {
    revalidateOnFocus: false,
  })
}

export function useDashboardMonthComparison(filters?: DashboardFilters) {
  const key = swrKey('/api/dashboard/month-comparison', filters)
  const fetcher = USE_MOCK ? () => delay(mockMonthComparison) : () => dashboardService.getMonthComparison(filters)
  return useSWR<MonthComparison>(key, fetcher, {
    revalidateOnFocus: false,
  })
}

export function useDashboardTopProducts(
  filters?: DashboardFilters & { limit?: number }
) {
  const key = swrKey('/api/dashboard/top-products', filters)
  const fetcher = USE_MOCK ? () => delay(mockTopProducts) : () => dashboardService.getTopProducts(filters)
  return useSWR<ProductRanking[]>(key, fetcher, {
    revalidateOnFocus: false,
  })
}

export function useDashboardEmployeeRanking(filters?: DashboardFilters) {
  const key = swrKey('/api/dashboard/employee-ranking', filters)
  const fetcher = USE_MOCK ? () => delay(mockEmployeeRanking) : () => dashboardService.getEmployeeRanking(filters)
  return useSWR<EmployeeRanking[]>(key, fetcher, {
    revalidateOnFocus: false,
  })
}
