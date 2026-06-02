
export interface Sucursal {
  idSucursal: number
  nombre: string
  direccion: string
  telefono?: string
  correo?: string
  horarioApertura?: string
  horarioCierre?: string
  ciudad?: string
  departamento?: string
  estadoOperativo?: string
  activo: boolean
  idResponsable?: number
  nombreResponsable?: string
  empleados?: {
    idUsuario: number
    nombreCompleto: string
    rol: string
  }[]
}

export interface CreateSucursalData {
  nombre: string
  direccion: string
  telefono?: string
  correo?: string
  horarioApertura?: string
  horarioCierre?: string
  ciudad?: string
  departamento?: string
  estadoOperativo?: string
  idUsuarioResponsable?: number
}

export interface UpdateSucursalData {
  nombre?: string
  direccion?: string
  telefono?: string
  correo?: string
  horarioApertura?: string
  horarioCierre?: string
  ciudad?: string
  departamento?: string
  estadoOperativo?: string
  idUsuarioResponsable?: number
}

export interface Sector {
  idSector: number
  nombre: string
  descripcion?: string
  tipoSector: string
  activo: boolean
  idSucursal: number
  nombreSucursal?: string
}

export interface CreateSectorData {
  nombre: string
  descripcion?: string
  tipoSector: string
  idSucursal: number
}

export interface UpdateSectorData {
  nombre?: string
  descripcion?: string
  tipoSector?: string
}

export interface Mesa {
  idMesa: number
  numeroMesa: string
  capacidadPersonas: number
  disponibilidad: string
  activo: boolean
  idSector: number
  nombreSector?: string
}

export interface CreateMesaData {
  numeroMesa: string
  capacidadPersonas: number
  idSector: number
}

export interface UpdateMesaData {
  numeroMesa?: string
  capacidadPersonas?: number
  disponibilidad?: string
  idSector?: number
}

export interface Cliente {
  idCliente: number
  nombreCompleto?: string
  razonSocial?: string
  nit?: string
  correo?: string
  telefono?: string
}

// ============ COMANDA TYPES ============
export interface Comanda {
  idComanda: number
  numeroComanda: string
  idSucursal: number
  nombreSucursal?: string
  idCliente?: number
  clienteNombre?: string
  idEmpleado?: number
  empleadoNombre?: string
  idReserva?: number
  idMesa?: number
  mesaNombre?: string
  idSector?: number
  nombreSector?: string
  idCarrito?: number
  tipoServicio: 'MESA' | 'PARA_LLEVAR' | 'ONLINE'
  fechaApertura: string
  fechaCierre?: string
  numeroPersonas?: number
  estado: 'PENDIENTE_PAGO' | 'ABIERTA' | 'EN_PREPARACION' | 'LISTA' | 'ENTREGADA' | 'CERRADA' | 'CANCELADA'
  observaciones?: string
  items?: DetalleComanda[]
}

export interface DetalleComanda {
  idDetalleComanda: number
  idProductoFinal: number
  nombreProducto: string
  precioUnitario: number
  cantidad: number
  notas?: string
  estado: 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'CANCELADO'
  estacionPreparacion: 'COCINA' | 'BARRA'
  fechaAceptacion?: string
  empleadoAsignado?: string
}

export interface CreateComandaData {
  idSucursal: number
  idCliente?: number
  idReserva?: number
  idMesa?: number
  tipoServicio: 'MESA' | 'PARA_LLEVAR' | 'ONLINE'
  numeroPersonas?: number
  observaciones?: string
  items: CreateDetalleComandaItem[]
}

export interface UpdateComandaData {
  estado?: string
  observaciones?: string
  numeroPersonas?: number
  idCliente?: number
  items?: CreateDetalleComandaItem[]
}

export interface UpdateDetalleComandaData {
  cantidad?: number
  notas?: string
}

export interface CreateDetalleComandaItem {
  idProductoFinal: number
  cantidad: number
  notas?: string
}

// ============ PREPARACION (KDS) TYPES ============
export interface PreparacionQueueItem {
  idDetalleComanda: number
  idComanda: number
  numeroComanda: string
  mesaNombre: string
  tipoServicio: string
  nombreProducto: string
  cantidad: number
  notas?: string
  estado: 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO'
  estacionPreparacion: 'COCINA' | 'BARRA'
  fechaCreacion: string
  fechaAceptacion?: string
  empleadoAsignado?: string
  tiempoTranscurrido?: number
}

export interface PreparacionQueue {
  idComanda: number
  numeroComanda: string
  mesaNombre: string
  tipoServicio: string
  estadoComanda: string
  totalItems: number
  itemsPendientes: number
  itemsEnPreparacion: number
  itemsListos: number
  items: PreparacionQueueItem[]
}

export interface MarcarListoResponse {
  idDetalleComanda: number
  idComanda: number
  estado: string
  estadoComanda: string
  exitoso: boolean
  mensaje: string
  descuentoInventario: {
    exitoso: boolean
    mensaje: string
    ingredientesDescontados: number
    ingredientesConError: number
  }
}

export type EstacionPreparacion = 'COCINA' | 'BARRA'