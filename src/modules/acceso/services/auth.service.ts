import { httpClient } from './http-client'
import { LoginData, RegisterData, AuthResponse, User, Permission } from './types'

interface AuthApiResponse {
  accessToken: string
  refreshToken: string
  usuario?: {
    idUsuario: number
    ci: string
    nombre: string
    apellido: string
    telefono?: string
    sexo?: 'M' | 'F' | 'O'
    correo?: string
    direccion?: string
    username?: string
    estadoAcceso?: string
    intentosFallidos?: number
    fechaRegistro?: string
    activo?: boolean
    roles?: any[]
  }
  username?: string
  authorities?: string[]
}

interface MeApiResponse {
  idUsuario: number
  username: string
  email?: string
  authorities?: string[]
  roles?: any[]
}

const ACCESS_TOKEN_KEY = 'gaira_access_token'
const REFRESH_TOKEN_KEY = 'gaira_refresh_token'

const mapAuthoritiesToPermissions = (authorities: string[] = []): Permission[] => {
  return authorities.map((authority) => {
    const [module = 'general', action = 'read'] = authority.split(':')
    return {
      id: authority,
      name: authority,
      description: authority,
      module,
      action,
      isActive: true,
    }
  })
}

const mapAuthUser = (response: AuthApiResponse): User => {
  const authorities = response.authorities || []
  const permissions = mapAuthoritiesToPermissions(authorities)
  const apiUser = response.usuario

  if (!apiUser) {
    const username = response.username || ''
    return {
      id: username,
      firstName: username,
      lastName: '',
      name: username,
      email: username,
      username,
      isActive: true,
      roles: [],
      permissions,
      authorities,
    }
  }

  const firstName = apiUser.nombre || response.username || ''
  const lastName = apiUser.apellido || ''

  return {
    id: String(apiUser.idUsuario),
    ci: apiUser.ci,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    email: apiUser.correo || response.username || '',
    username: apiUser.username || response.username,
    phone: apiUser.telefono,
    gender: apiUser.sexo,
    address: apiUser.direccion,
    isActive: apiUser.activo ?? true,
    estadoAcceso: apiUser.estadoAcceso,
    intentosFallidos: apiUser.intentosFallidos,
    roles: apiUser.roles ? apiUser.roles.map((r: any) => ({
      id: String(r.idRol),
      name: r.nombre,
      description: r.descripcion || '',
      isActive: r.activo ?? true,
      permissions: [],
    })) : [],
    permissions,
    authorities,
    createdAt: apiUser.fechaRegistro,
  }
}

class AuthService {
  private persistTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }

  private clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }

  private getRefreshToken(): string {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || ''
  }

  async login(data: LoginData): Promise<User> {
    const response = await httpClient.post<AuthApiResponse>('/auth/login', data)
    this.persistTokens(response.accessToken, response.refreshToken)
    return mapAuthUser(response)
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await httpClient.post<AuthApiResponse>('/auth/register', data)
    this.persistTokens(response.accessToken, response.refreshToken)
    return {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      user: mapAuthUser(response),
      authorities: response.authorities || [],
    }
  }

  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken()
    if (refreshToken) {
      await httpClient.post('/auth/logout', { refreshToken })
    }
    this.clearTokens()
  }

  async getProfile(): Promise<User> {
    const response = await httpClient.get<any>('/auth/me')
    const usuario = response.usuario
    const authorities = response.authorities || []
    const permissions = mapAuthoritiesToPermissions(authorities)

    const firstName = usuario.nombre || usuario.username || ''
    const lastName = usuario.apellido || ''

    return {
      id: String(usuario.idUsuario),
      ci: usuario.ci,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email: usuario.correo || usuario.username || '',
      username: usuario.username,
      phone: usuario.telefono,
      gender: usuario.sexo,
      address: usuario.direccion,
      isActive: usuario.activo ?? true,
      estadoAcceso: usuario.estadoAcceso,
      intentosFallidos: usuario.intentosFallidos,
      roles: usuario.roles ? usuario.roles.map((r: any) => ({
        id: String(r.idRol),
        name: r.nombre,
        description: r.descripcion || '',
        accessLevel: r.nivelAcceso,
        isActive: r.activo ?? true,
        permissions: r.permisos ? r.permisos.map((p: any) => ({
          id: String(p.idPermiso),
          name: p.nombre,
          description: p.descripcion || '',
          module: p.modulo,
          action: p.accion,
          isActive: p.activo ?? true,
        })) : [],
      })) : [],
      permissions,
      authorities,
      createdAt: usuario.fechaRegistro,
    }
  }

  async getPermissions(): Promise<Permission[]> {
    const me = await httpClient.get<MeApiResponse>('/auth/me')
    return mapAuthoritiesToPermissions(me.authorities || [])
  }

  async refreshToken(): Promise<User> {
    const refreshToken = this.getRefreshToken()
    const response = await httpClient.post<AuthApiResponse>('/auth/refresh', { refreshToken })
    this.persistTokens(response.accessToken, response.refreshToken)
    return mapAuthUser(response)
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await httpClient.put<any>('/auth/profile', data)
    const usuario = response.usuario
    const authorities = response.authorities || []
    const permissions = mapAuthoritiesToPermissions(authorities)

    const firstName = usuario.nombre || usuario.username || ''
    const lastName = usuario.apellido || ''

    return {
      id: String(usuario.idUsuario),
      ci: usuario.ci,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email: usuario.correo || usuario.username || '',
      username: usuario.username,
      phone: usuario.telefono,
      gender: usuario.sexo,
      address: usuario.direccion,
      isActive: usuario.activo ?? true,
      estadoAcceso: usuario.estadoAcceso,
      intentosFallidos: usuario.intentosFallidos,
      roles: usuario.roles ? usuario.roles.map((r: any) => ({
        id: String(r.idRol),
        name: r.nombre,
        description: r.descripcion || '',
        accessLevel: r.nivelAcceso,
        isActive: r.activo ?? true,
        permissions: r.permisos ? r.permisos.map((p: any) => ({
          id: String(p.idPermiso),
          name: p.nombre,
          description: p.descripcion || '',
          module: p.modulo,
          action: p.accion,
          isActive: p.activo ?? true,
        })) : [],
      })) : [],
      permissions,
      authorities,
      createdAt: usuario.fechaRegistro,
    }
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    await httpClient.post('/auth/change-password', data)
  }
}

// Types for profile update
export interface UpdateProfileData {
  nombre?: string
  apellido?: string
  telefono?: string
  correo?: string
  direccion?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

// Export singleton instance
export const authService = new AuthService()