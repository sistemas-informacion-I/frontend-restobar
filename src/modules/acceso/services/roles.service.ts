import { httpClient } from './http-client'
import { Role, CreateRoleData, UpdateRoleData } from './types'

interface RolApiResponse {
  idRol: number
  nombre: string
  descripcion?: string
  nivelAcceso?: number
  activo?: boolean
  fechaCreacion?: string
  permisos?: any[]
}

const mapRol = (rol: RolApiResponse): Role => ({
  id: String(rol.idRol),
  name: rol.nombre,
  description: rol.descripcion || '',
  accessLevel: rol.nivelAcceso,
  isActive: rol.activo ?? true,
  permissions: rol.permisos ? rol.permisos.map((p: any) => ({
    id: String(p.idPermiso),
    name: p.nombre,
    description: p.descripcion || '',
    module: p.modulo,
    action: p.accion,
    isActive: p.activo ?? true,
    createdAt: p.fechaCreacion,
  })) : [],
  createdAt: rol.fechaCreacion,
})

class RolesService {
  async getAll(): Promise<Role[]> {
    const response = await httpClient.get<RolApiResponse[]>('/api/roles')
    return response.map(mapRol)
  }

  async getOne(id: string): Promise<Role> {
    const response = await httpClient.get<RolApiResponse>(`/api/roles/${id}`)
    return mapRol(response)
  }

  async create(data: CreateRoleData): Promise<Role> {
    const response = await httpClient.post<RolApiResponse>('/api/roles', data)
    return mapRol(response)
  }

  async update(id: string, data: UpdateRoleData): Promise<Role> {
    const response = await httpClient.put<RolApiResponse>(`/api/roles/${id}`, data)
    return mapRol(response)
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/api/roles/${id}`)
  }
}

// Export singleton instance
export const rolesService = new RolesService()