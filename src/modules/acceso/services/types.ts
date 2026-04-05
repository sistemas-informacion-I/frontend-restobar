export interface Permission {
  id: string
  name: string
  description: string
  module: string
  action: string
  isActive?: boolean
  createdAt?: string
}

export interface Role {
  id: string
  name: string
  description: string
  accessLevel?: number
  isActive: boolean
  permissions: Permission[]
  createdAt?: string
}

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

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  ci: string
  nombre: string
  apellido: string
  telefono?: string
  sexo?: 'M' | 'F' | 'O'
  correo: string
  direccion?: string
  username: string
  password: string
  rol?: string
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

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
  authorities: string[]
}

export interface MessageResponse {
  message: string
}