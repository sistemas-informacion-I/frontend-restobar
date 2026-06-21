export interface EntregaResponse {
  idEntrega: number
  idComanda: number
  numeroComanda: string
  idEmpleado: number | null
  nombreEmpleado: string | null
  direccionEntrega: string
  latitud: number
  longitud: number
  latitudActual: number | null
  longitudActual: number | null
  distanciaKm: number
  tiempoEstimadoMin: number
  costoEnvio: number
  estado: EntregaEstado
  fechaAsignacion: string | null
  fechaEntrega: string | null
  observaciones: string | null
  idSucursal: number
  nombreSucursal: string
  direccionSucursal: string
  sucursalLatitud: number | null
  sucursalLongitud: number | null
  nombreCliente: string | null
  telefonoCliente: string | null
}

export type EntregaEstado = 'PENDIENTE' | 'ASIGNADO' | 'EN_CAMINO' | 'ENTREGADO' | 'CANCELADO'

export interface DisponibilidadResponse {
  disponible: boolean
  motivo: string
  distanciaKm?: number
}

export interface NuevaEntregaNotificacion {
  idEntrega: number
  numeroComanda: string
  direccionEntrega: string
  distanciaKm: number
  tiempoEstimadoMin: number
  costoEnvio: number
  sucursalLatitud: number
  sucursalLongitud: number
  nombreSucursal: string
}

export interface UbicacionUpdate {
  idEntrega: number
  latitud: number
  longitud: number
  timestamp: string
}
