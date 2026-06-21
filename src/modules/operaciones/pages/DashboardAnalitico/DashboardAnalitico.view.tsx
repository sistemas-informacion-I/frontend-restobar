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
      <div>
        <h1 className="text-2xl font-bold text-wine-900 dark:text-white">
          Dashboard Analítico
        </h1>
        <p className="mt-1 text-sm text-wine-500 dark:text-wine-400">
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
