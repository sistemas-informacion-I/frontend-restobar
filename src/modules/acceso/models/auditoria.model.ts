export interface AuditLog {
  idLog: number
  tabla: string
  operacion: string
  idRegistro?: string
  datosAnteriores?: Record<string, unknown>
  datosNuevos?: Record<string, unknown>
  idUsuario?: number
  username?: string
  idSucursal?: number
  ipOrigen?: string
  userAgent?: string
  fechaOperacion: string
}

export interface AuditPage {
  content: AuditLog[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface AuditFilters {
  tabla?: string
  operacion?: string
  idUsuario?: number
  desde?: string
  hasta?: string
  page: number
  size: number
}
