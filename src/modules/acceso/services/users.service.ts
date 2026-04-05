import { httpClient } from './http-client'
import { User, CreateUserData, UpdateUserData } from './types'

interface UsuarioApiResponse {
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

const mapUsuario = (usuario: UsuarioApiResponse): User => {
  const firstName = usuario.nombre || ''
  const lastName = usuario.apellido || ''
  return {
    id: String(usuario.idUsuario),
    ci: usuario.ci,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    email: usuario.correo || '',
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
      permissions: [],
      createdAt: r.fechaCreacion,
    })) : [],
    createdAt: usuario.fechaRegistro,
  }
}

class UsersService {
  async getAll(): Promise<User[]> {
    const response = await httpClient.get<UsuarioApiResponse[]>('/api/usuarios')
    return response.map(mapUsuario)
  }

  async getOne(id: string): Promise<User> {
    const response = await httpClient.get<UsuarioApiResponse>(`/api/usuarios/${id}`)
    return mapUsuario(response)
  }

  async create(data: CreateUserData): Promise<User> {
    const response = await httpClient.post<UsuarioApiResponse>('/api/usuarios', data)
    return mapUsuario(response)
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const response = await httpClient.put<UsuarioApiResponse>(`/api/usuarios/${id}`, data)
    return mapUsuario(response)
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/api/usuarios/${id}`)
  }
}

// Export singleton instance
export const usersService = new UsersService()