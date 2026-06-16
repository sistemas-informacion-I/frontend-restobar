export type EstadoReserva = 'PENDIENTE' | 'CONFIRMADA' | 'EN_CURSO' | 'CANCELADA' | 'NO_ASISTIO'
export type EstadoPlanoMesa = 'DISPONIBLE' | 'SELECCIONADO' | 'OCUPADO_RESERVADO' | 'NO_DISPONIBLE'

export interface MesaReservaResponse {
  idMesa: number
  idSector: number | null
  numeroMesa: string
  capacidadPersonas: number
  disponibilidad: string
}

export interface DisponibilidadMesaResponse {
  idMesa: number
  idSector: number | null
  numeroMesa: string
  capacidadPersonas: number
  estadoPlano: EstadoPlanoMesa
  disponible: boolean
  motivo?: string | null
}

export interface ReservaResponse {
  idReserva: number
  idSucursal: number
  idCliente?: number | null
  idEmpleadoConfirmacion?: number | null
  idEmpleadoCheckIn?: number | null
  idComanda?: number | null
  clienteNombre: string
  clienteTelefono?: string | null
  clienteCorreo?: string | null
  fechaReserva: string
  horaInicio: string
  horaFin: string
  cantidadPersonas: number
  estado: EstadoReserva
  fechaCreacion: string
  fechaConfirmacion?: string | null
  fechaCheckIn?: string | null
  fechaCancelacion?: string | null
  motivoCancelacion?: string | null
  observaciones?: string | null
  mesas: MesaReservaResponse[]
}

export interface CrearReservaRequest {
  idSucursal: number
  fechaReserva: string
  horaInicio: string
  horaFin?: string
  cantidadPersonas: number
  idsMesa: number[]
  clienteNombre?: string
  clienteTelefono?: string
  clienteCorreo?: string
  observaciones?: string
}

export interface ActualizarEstadoReservaRequest {
  idEmpleado?: number
  motivo?: string
}

export interface SucursalReservaOption {
  idSucursal: number
  nombre: string
  activo: boolean
}
