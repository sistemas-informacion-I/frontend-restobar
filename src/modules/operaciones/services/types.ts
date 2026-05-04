
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