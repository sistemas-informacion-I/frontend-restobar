import { Role } from './role.model'
import { Permission } from './permission.model'

export interface User {
  id: string
  ci?: string
  firstName: string
  lastName: string
  name: string
  email: string
  username?: string
  phone?: string
  gender?: 'M' | 'F' | 'O'
  address?: string
  isActive: boolean
  estadoAcceso?: string
  intentosFallidos?: number
  roles: Role[]
  permissions?: Permission[]
  authorities?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserData {
  ci: string
  nombre: string
  apellido: string
  telefono?: string
  sexo?: 'M' | 'F' | 'O'
  correo?: string
  direccion?: string
  username?: string
  password?: string
  activo?: boolean
  roles?: number[]
}

export interface UpdateUserData {
  ci?: string
  nombre?: string
  apellido?: string
  telefono?: string
  sexo?: 'M' | 'F' | 'O'
  correo?: string
  direccion?: string
  activo?: boolean
  estadoAcceso?: string
  roles?: number[]
}

export interface MessageResponse {
  message: string
}
