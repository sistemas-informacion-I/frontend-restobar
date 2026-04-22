import { httpClient } from '../../acceso/services/http-client'
import { CreateSectorData, UpdateSectorData } from '../../acceso/services/types'

interface SectorApiResponse {
  idSector: number
  nombre: string
  descripcion?: string
  tipoSector: string
  activo: boolean
  idSucursal: number
  nombreSucursal?: string
}

class SectorService {
  async getAll(): Promise<SectorApiResponse[]> {
    return httpClient.get<SectorApiResponse[]>('/api/sectores')
  }

  async getOne(id: number): Promise<SectorApiResponse> {
    return httpClient.get<SectorApiResponse>(`/api/sectores/${id}`)
  }

  async getBySucursal(idSucursal: number): Promise<SectorApiResponse[]> {
    return httpClient.get<SectorApiResponse[]>(`/api/sectores/sucursal/${idSucursal}`)
  }

  async create(data: CreateSectorData): Promise<SectorApiResponse> {
    return httpClient.post<SectorApiResponse>('/api/sectores', data)
  }

  async update(id: number, data: UpdateSectorData): Promise<SectorApiResponse> {
    return httpClient.put<SectorApiResponse>(`/api/sectores/${id}`, data)
  }

  async delete(id: number): Promise<void> {
    await httpClient.delete(`/api/sectores/${id}`)
  }
}

export const sectorService = new SectorService()