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

function swrKey(prefix: string, filters?: DashboardFilters): string {
  const params = new URLSearchParams()
  if (filters?.fechaInicio) params.set('fechaInicio', filters.fechaInicio)
  if (filters?.fechaFin) params.set('fechaFin', filters.fechaFin)
  if (filters?.idSucursal) params.set('idSucursal', String(filters.idSucursal))
  const qs = params.toString()
  return qs ? `${prefix}?${qs}` : prefix
}

export function useDashboardKpi(filters?: DashboardFilters) {
  const key = swrKey('/api/dashboard/kpi', filters)
  return useSWR<KpiDTO>(key, () => dashboardService.getKpi(filters), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
}

export function useDashboardSalesEvolution(filters?: DashboardFilters) {
  const key = swrKey('/api/dashboard/sales-evolution', filters)
  return useSWR<SalesPoint[]>(key, () => dashboardService.getSalesEvolution(filters), {
    revalidateOnFocus: false,
  })
}

export function useDashboardSalesByCategory(filters?: DashboardFilters) {
  const key = swrKey('/api/dashboard/sales-by-category', filters)
  return useSWR<CategorySales[]>(key, () => dashboardService.getSalesByCategory(filters), {
    revalidateOnFocus: false,
  })
}

export function useDashboardMonthComparison(filters?: DashboardFilters) {
  const key = swrKey('/api/dashboard/month-comparison', filters)
  return useSWR<MonthComparison>(key, () => dashboardService.getMonthComparison(filters), {
    revalidateOnFocus: false,
  })
}

export function useDashboardTopProducts(
  filters?: DashboardFilters & { limit?: number }
) {
  const key = swrKey('/api/dashboard/top-products', filters)
  return useSWR<ProductRanking[]>(key, () => dashboardService.getTopProducts(filters), {
    revalidateOnFocus: false,
  })
}

export function useDashboardEmployeeRanking(filters?: DashboardFilters) {
  const key = swrKey('/api/dashboard/employee-ranking', filters)
  return useSWR<EmployeeRanking[]>(key, () => dashboardService.getEmployeeRanking(filters), {
    revalidateOnFocus: false,
  })
}
