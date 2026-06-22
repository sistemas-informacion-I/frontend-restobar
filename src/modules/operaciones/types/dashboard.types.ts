export interface DashboardFilters {
  fechaInicio?: string
  fechaFin?: string
  idSucursal?: number
}

export interface KpiDTO {
  ventasDelDia: number
  numeroTransacciones: number
  ticketPromedio: number
  totalGanancia: number
  margenGanancia: number
  comandasActivas: number
  reservasDelDia: number
  alertasStockCritico: number
}

export interface SalesPoint {
  fecha: string
  total: number
  count: number
}

export interface CategorySales {
  categoria: string
  total: number
  porcentaje: number
}

export interface MonthComparison {
  mesActual: number
  mesAnterior: number
  variacion: number
  periodoActual: string
  periodoAnterior: string
}

export interface ProductRanking {
  idProducto: number
  nombre: string
  cantidadVendida: number
  totalGenerado: number
}

export interface EmployeeRanking {
  idEmpleado: number
  nombre: string
  apellido: string
  totalVentas: number
  numeroVentas: number
}
