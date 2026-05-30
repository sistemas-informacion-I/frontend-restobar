import { httpClient } from '../../../core/api/http-client'

export interface MetodoPago {
  idMetodoPago: number
  nombre: string
  descripcion?: string | null
  comisionPorcentaje?: number | null
  comisionFija: number
  activo: boolean
}

export interface MetodoPagoUpdateData {
  descripcion?: string | null
  comisionPorcentaje?: number | null
  comisionFija?: number
  activo?: boolean
}

export const MetodosPagoService = {
  async getAll(): Promise<MetodoPago[]> {
    return await httpClient.get<MetodoPago[]>('/api/metodos-pago')
  },

  async update(id: number, data: MetodoPagoUpdateData): Promise<MetodoPago> {
    return await httpClient.patch<MetodoPago>(`/api/metodos-pago/${id}`, data)
  },
}