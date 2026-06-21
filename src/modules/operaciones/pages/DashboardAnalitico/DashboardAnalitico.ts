import { useState, useMemo } from 'react'
import { useAuth } from '../../../acceso/context/AuthContext'
import { useSucursales } from '../../hooks/useSucursales'
import {
  useDashboardKpi,
  useDashboardSalesEvolution,
  useDashboardSalesByCategory,
  useDashboardMonthComparison,
  useDashboardTopProducts,
  useDashboardEmployeeRanking,
} from '../../hooks/useDashboard'
import { DashboardAnaliticoView } from './DashboardAnalitico.view'

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

function thirtyDaysAgoISO() {
  const d = new Date()
  d.setDate(d.getDate() - 30)
  return d.toISOString().split('T')[0]
}

export function DashboardAnalitico() {
  const { user } = useAuth()
  const isSuperUser = user?.tipoUsuario === 'S'

  const { sucursales } = useSucursales()

  const [fechaInicio, setFechaInicio] = useState(thirtyDaysAgoISO)
  const [fechaFin, setFechaFin] = useState(todayISO)
  const [idSucursal, setIdSucursal] = useState<number | undefined>(undefined)

  const filters = useMemo(
    () => ({
      fechaInicio,
      fechaFin,
      ...(isSuperUser && idSucursal ? { idSucursal } : {}),
    }),
    [fechaInicio, fechaFin, idSucursal, isSuperUser]
  )

  const kpiQuery = useDashboardKpi(filters)
  const salesEvolutionQuery = useDashboardSalesEvolution(filters)
  const salesByCategoryQuery = useDashboardSalesByCategory(filters)
  const monthComparisonQuery = useDashboardMonthComparison(filters)
  const topProductsQuery = useDashboardTopProducts({ ...filters, limit: 5 })
  const employeeRankingQuery = useDashboardEmployeeRanking(filters)

  return DashboardAnaliticoView({
    kpis: kpiQuery.data,
    kpiLoading: kpiQuery.isLoading,
    salesEvolution: salesEvolutionQuery.data,
    salesEvolutionLoading: salesEvolutionQuery.isLoading,
    salesByCategory: salesByCategoryQuery.data,
    salesByCategoryLoading: salesByCategoryQuery.isLoading,
    monthComparison: monthComparisonQuery.data,
    monthComparisonLoading: monthComparisonQuery.isLoading,
    topProducts: topProductsQuery.data,
    topProductsLoading: topProductsQuery.isLoading,
    employeeRanking: employeeRankingQuery.data,
    employeeRankingLoading: employeeRankingQuery.isLoading,
    fechaInicio,
    fechaFin,
    idSucursal,
    sucursales: sucursales.map((s: any) => ({
      idSucursal: s.idSucursal,
      nombre: s.nombre,
    })),
    showSucursalFilter: isSuperUser,
    onFechaInicioChange: setFechaInicio,
    onFechaFinChange: setFechaFin,
    onSucursalChange: setIdSucursal,
  })
}
