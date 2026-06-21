import { httpClient } from '@/core/api'
import type {
  EntregaResponse,
  DisponibilidadResponse,
} from '../models/entrega.model'

export const entregaService = {

  async getPendientes(): Promise<EntregaResponse[]> {
    return httpClient.get<EntregaResponse[]>('/api/entregas')
  },

  async getById(id: number): Promise<EntregaResponse> {
    return httpClient.get<EntregaResponse>(`/api/entregas/${id}`)
  },

  async getByComanda(idComanda: number): Promise<EntregaResponse> {
    return httpClient.get<EntregaResponse>(`/api/entregas/comanda/${idComanda}`)
  },

  async getByEmpleado(idEmpleado: number): Promise<EntregaResponse[]> {
    return httpClient.get<EntregaResponse[]>(`/api/entregas/empleado/${idEmpleado}`)
  },

  async getMisEntregas(): Promise<EntregaResponse[]> {
    return httpClient.get<EntregaResponse[]>('/api/entregas/mis-entregas')
  },

  async verificarDisponibilidad(idEntrega: number, latitud?: number, longitud?: number): Promise<DisponibilidadResponse> {
    const params = new URLSearchParams()
    if (latitud != null) params.set('latitud', String(latitud))
    if (longitud != null) params.set('longitud', String(longitud))
    const qs = params.toString()
    return httpClient.get<DisponibilidadResponse>(`/api/entregas/${idEntrega}/disponibilidad${qs ? '?' + qs : ''}`)
  },

  async aceptar(idEntrega: number, latitud?: number, longitud?: number): Promise<EntregaResponse> {
    const params = new URLSearchParams()
    if (latitud != null) params.set('latitud', String(latitud))
    if (longitud != null) params.set('longitud', String(longitud))
    const qs = params.toString()
    return httpClient.patch<EntregaResponse>(`/api/entregas/${idEntrega}/aceptar${qs ? '?' + qs : ''}`)
  },

  async iniciarViaje(idEntrega: number): Promise<EntregaResponse> {
    return httpClient.patch<EntregaResponse>(`/api/entregas/${idEntrega}/iniciar`)
  },

  async reportarUbicacion(latitud: number, longitud: number): Promise<void> {
    await httpClient.post('/api/entregas/ubicacion', { latitud, longitud })
  },

  async marcarEntregado(idEntrega: number): Promise<EntregaResponse> {
    return httpClient.patch<EntregaResponse>(`/api/entregas/${idEntrega}/entregado`)
  },

  async cancelar(idEntrega: number, motivo?: string): Promise<EntregaResponse> {
    const params = motivo ? `?motivo=${encodeURIComponent(motivo)}` : ''
    return httpClient.patch<EntregaResponse>(`/api/entregas/${idEntrega}/cancelar${params}`)
  },
}
