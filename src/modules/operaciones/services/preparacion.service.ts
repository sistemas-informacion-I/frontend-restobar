import { httpClient } from '../../../core/api/http-client'
import type { PreparacionQueue, MarcarListoResponse, EstacionPreparacion } from './types'

class PreparacionService {
  async getCola(estacion: EstacionPreparacion, idSucursal?: number): Promise<PreparacionQueue[]> {
    const params = new URLSearchParams({ estacion })
    if (idSucursal) params.append('idSucursal', idSucursal.toString())
    return httpClient.get<PreparacionQueue[]>(`/api/preparacion/cola?${params}`)
  }

  async getColaCompleta(idSucursal?: number): Promise<PreparacionQueue[]> {
    const params = new URLSearchParams()
    if (idSucursal) params.append('idSucursal', idSucursal.toString())
    const query = params.toString() ? `?${params}` : ''
    return httpClient.get<PreparacionQueue[]>(`/api/preparacion/cola/completa${query}`)
  }

  async tomarItem(idDetalleComanda: number): Promise<PreparacionQueue> {
    return httpClient.patch<PreparacionQueue>(`/api/preparacion/detalles/${idDetalleComanda}/tomar`, {})
  }

  async marcarListo(idDetalleComanda: number): Promise<MarcarListoResponse> {
    return httpClient.patch<MarcarListoResponse>(`/api/preparacion/detalles/${idDetalleComanda}/listo`, {})
  }
}

export const preparacionService = new PreparacionService()
