import { httpClient } from '../../acceso/services/http-client'
import { CreateSucursalData, UpdateSucursalData } from '../../acceso/services/types'

interface SucursalApiResponse {
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
}

interface SectorApiResponse {
  idSector: number
  nombre: string
  descripcion?: string
  tipoSector: string
  activo: boolean
  idSucursal: number
  nombreSucursal?: string
}

class SucursalService {
  async getAll(): Promise<SucursalApiResponse[]> {
    return httpClient.get<SucursalApiResponse[]>('/api/sucursal')
  }

  async getOne(id: number): Promise<SucursalApiResponse> {
    return httpClient.get<SucursalApiResponse>(`/api/sucursal/${id}`)
  }

  async create(data: CreateSucursalData): Promise<SucursalApiResponse> {
    return httpClient.post<SucursalApiResponse>('/api/sucursal', data)
  }

  async update(id: number, data: UpdateSucursalData): Promise<SucursalApiResponse> {
    return httpClient.put<SucursalApiResponse>(`/api/sucursal/${id}`, data)
  }

  async delete(id: number): Promise<void> {
    await httpClient.delete(`/api/sucursal/${id}`)
  }

  async getSectoresBySucursal(idSucursal: number): Promise<SectorApiResponse[]> {
    return httpClient.get<SectorApiResponse[]>(`/api/sectores/sucursal/${idSucursal}`)
  }
}

export const sucursalService = new SucursalService()