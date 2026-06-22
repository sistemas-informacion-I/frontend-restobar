import type {
  KpiDTO,
  SalesPoint,
  CategorySales,
  MonthComparison,
  ProductRanking,
  EmployeeRanking,
} from './dashboard.types'

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

export const mockKpi: KpiDTO = {
  ventasDelDia: 4580.5,
  numeroTransacciones: 23,
  ticketPromedio: 199.15,
  totalGanancia: 1832.2,
  margenGanancia: 40,
  comandasActivas: 12,
  reservasDelDia: 5,
  alertasStockCritico: 2,
}

export const mockSalesEvolution: SalesPoint[] = Array.from({ length: 30 }, (_, i) => ({
  fecha: daysAgo(29 - i),
  total: Math.round((2000 + Math.random() * 6000) * 100) / 100,
  count: Math.floor(8 + Math.random() * 25),
}))

export const mockSalesByCategory: CategorySales[] = [
  { categoria: 'Bebidas', total: 49875.0, porcentaje: 35 },
  { categoria: 'Platos Fuertes', total: 39900.0, porcentaje: 28 },
  { categoria: 'Entradas', total: 25650.0, porcentaje: 18 },
  { categoria: 'Postres', total: 17100.0, porcentaje: 12 },
  { categoria: 'Otros', total: 9975.0, porcentaje: 7 },
]

export const mockMonthComparison: MonthComparison = {
  mesActual: 142500.0,
  mesAnterior: 125300.0,
  variacion: 13.7,
  periodoActual: 'Jun 2026',
  periodoAnterior: 'May 2026',
}

export const mockTopProducts: ProductRanking[] = [
  { idProducto: 1, nombre: 'Lomo Saltado', cantidadVendida: 89, totalGenerado: 7120.0 },
  { idProducto: 2, nombre: 'Pique Macho', cantidadVendida: 72, totalGenerado: 6480.0 },
  { idProducto: 3, nombre: 'Mojito Clásico', cantidadVendida: 65, totalGenerado: 2600.0 },
  { idProducto: 4, nombre: 'Salteñas (6 unid.)', cantidadVendida: 58, totalGenerado: 2900.0 },
  { idProducto: 5, nombre: 'Brownie con Helado', cantidadVendida: 47, totalGenerado: 1175.0 },
]

export const mockEmployeeRanking: EmployeeRanking[] = [
  { idEmpleado: 1, nombre: 'Carlos', apellido: 'Mendoza', totalVentas: 28450.0, numeroVentas: 142 },
  { idEmpleado: 2, nombre: 'María', apellido: 'López', totalVentas: 26120.0, numeroVentas: 135 },
  { idEmpleado: 3, nombre: 'José', apellido: 'Fernández', totalVentas: 22380.0, numeroVentas: 118 },
  { idEmpleado: 4, nombre: 'Ana', apellido: 'García', totalVentas: 19750.0, numeroVentas: 98 },
  { idEmpleado: 5, nombre: 'Pedro', apellido: 'Rojas', totalVentas: 15920.0, numeroVentas: 85 },
]
