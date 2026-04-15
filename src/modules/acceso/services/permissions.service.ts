import { httpClient } from './http-client'
import { Permission } from '../models'

interface PermisoApiResponse {
  idPermiso: number
  nombre: string
  modulo: string
  accion: string
  descripcion?: string
  activo?: boolean
  fechaCreacion?: string
}

const mapPermiso = (permiso: PermisoApiResponse): Permission => ({
  id: String(permiso.idPermiso),
  name: permiso.nombre,
  description: permiso.descripcion || permiso.nombre,
  module: permiso.modulo,
  action: permiso.accion,
  isActive: permiso.activo ?? true,
  createdAt: permiso.fechaCreacion,
})

class PermissionsService {
  async getAll(): Promise<Permission[]> {
    const response = await httpClient.get<PermisoApiResponse[]>('/api/permisos')
    return response.map(mapPermiso)
  }
}

// Export singleton instance
export const permissionsService = new PermissionsService()