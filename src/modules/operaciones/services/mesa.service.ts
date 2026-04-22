import { httpClient } from '../../acceso/services/http-client'
import { Mesa, CreateMesaData, UpdateMesaData } from './types'

class MesaService {
  async getAll(): Promise<Mesa[]> {
    return httpClient.get<Mesa[]>('/api/mesas')
  }

  async getOne(id: number): Promise<Mesa> {
    return httpClient.get<Mesa>(`/api/mesas/${id}`)
  }

  async getBySector(idSector: number): Promise<Mesa[]> {
    return httpClient.get<Mesa[]>(`/api/mesas/sector/${idSector}`)
  }

  async create(data: CreateMesaData): Promise<Mesa> {
    return httpClient.post<Mesa>('/api/mesas', data)
  }

  async update(id: number, data: UpdateMesaData): Promise<Mesa> {
    return httpClient.put<Mesa>(`/api/mesas/${id}`, data)
  }

  async delete(id: number): Promise<void> {
    await httpClient.delete(`/api/mesas/${id}`)
  }
}

export const mesaService = new MesaService()