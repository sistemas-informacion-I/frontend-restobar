import { Permission } from './permission.model'

export interface Role {
  id: string
  name: string
  description: string
  accessLevel?: number
  isActive: boolean
  permissions: Permission[]
  createdAt?: string
}

export interface CreateRoleData {
  nombre: string
  descripcion?: string
  nivelAcceso?: number
  activo?: boolean
  permisos?: number[]
}

export interface UpdateRoleData {
  nombre?: string
  descripcion?: string
  nivelAcceso?: number
  activo?: boolean
  permisos?: number[]
}

export interface AssignRoleData {
  idRol: number
}

export interface AssignPermissionData {
  idPermiso: number
}
