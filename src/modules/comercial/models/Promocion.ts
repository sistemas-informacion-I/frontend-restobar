export interface Promocion {
  id: number
  idPromocion?: number
  nombre: string
  descripcion?: string
  tipo: string
  valorDescuento: number
  compraMinima?: number
  fechaInicio: string
  fechaFin: string
  estado: string
  activo: boolean
  idSucursal: number
  nombreSucursal?: string
  editable?: boolean
  aplicable?: boolean
  diasRestantes?: number
  diasTranscurridos?: number
  productos?: Array<{
    idProductoFinal?: number
    nombre?: string
    codigo?: string
    nombreCategoria?: string
    precio?: number
    estado?: string
  }>
}

export interface PromocionDashboard {
  cantidadPromocionesActivas: number
  cantidadPromocionesProgramadas: number
  cantidadPromocionesInactivas: number
  cantidadPromocionesFinalizadas: number
}

export interface PromocionRequest {
  nombre: string
  descripcion?: string | null
  tipo: string
  valorDescuento: number
  compraMinima?: number | null
  fechaInicio: string
  fechaFin: string
  estado: string
  activo: boolean
  idSucursal: number
  idProductos: number[]
}
