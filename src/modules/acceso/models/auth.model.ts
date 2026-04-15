import { User } from './user.model'

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

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
  authorities: string[]
}
