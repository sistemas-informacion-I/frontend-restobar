import { BarChart3 } from 'lucide-react'
import { FiltrosSucursal, TarjetasKpi, GraficoVentas, GraficoCategorias, ComparativaMensual, TablaProductosTop, TablaEmpleados } from './components'
import type { KpiDTO, SalesPoint, CategorySales, MonthComparison, ProductRanking, EmployeeRanking } from '../../types/dashboard.types'

export interface DashboardAnaliticoViewProps {
  kpis: KpiDTO | undefined
  kpiLoading: boolean
  salesEvolution: SalesPoint[] | undefined
  salesEvolutionLoading: boolean
  salesByCategory: CategorySales[] | undefined
  salesByCategoryLoading: boolean
  monthComparison: MonthComparison | undefined
  monthComparisonLoading: boolean
  topProducts: ProductRanking[] | undefined
  topProductsLoading: boolean
  employeeRanking: EmployeeRanking[] | undefined
  employeeRankingLoading: boolean
  fechaInicio: string
  fechaFin: string
  idSucursal: number | undefined
  sucursales: { idSucursal: number; nombre: string }[]
  showSucursalFilter: boolean
  onFechaInicioChange: (val: string) => void
  onFechaFinChange: (val: string) => void
  onSucursalChange: (val: number | undefined) => void
}

export function DashboardAnaliticoView(props: DashboardAnaliticoViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wine-600/10 text-wine-600 dark:bg-wine-500/10 dark:text-wine-400">
            <BarChart3 size={28} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-4xl">
            Dashboard Analítico
          </h1>
        </div>
        <p className="ml-1 text-sm font-bold uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-300/40">
          Indicadores clave y evolución del negocio
        </p>
      </div>

      <FiltrosSucursal
        fechaInicio={props.fechaInicio}
        fechaFin={props.fechaFin}
        idSucursal={props.idSucursal}
        sucursales={props.sucursales}
        showSucursalFilter={props.showSucursalFilter}
        onFechaInicioChange={props.onFechaInicioChange}
        onFechaFinChange={props.onFechaFinChange}
        onSucursalChange={props.onSucursalChange}
      />

      <TarjetasKpi kpis={props.kpis} isLoading={props.kpiLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GraficoVentas
            data={props.salesEvolution}
            isLoading={props.salesEvolutionLoading}
          />
        </div>
        <GraficoCategorias
          data={props.salesByCategory}
          isLoading={props.salesByCategoryLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ComparativaMensual
          data={props.monthComparison}
          isLoading={props.monthComparisonLoading}
        />
        <TablaProductosTop
          data={props.topProducts}
          isLoading={props.topProductsLoading}
        />
        <TablaEmpleados
          data={props.employeeRanking}
          isLoading={props.employeeRankingLoading}
        />
      </div>
    </div>
  )
}
