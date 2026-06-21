import { httpClient } from '@/core/api'
import {
  ActualizarEstadoReservaRequest,
  CrearReservaRequest,
  DisponibilidadMesaResponse,
  ReservaResponse,
  SucursalReservaOption,
} from '../models/reserva.model'

export const reservaService = {
  async getSucursales(): Promise<SucursalReservaOption[]> {
    return httpClient.get<SucursalReservaOption[]>('/api/sucursal')
  },

  async disponibilidad(params: {
    idSucursal: number
    fechaReserva: string
    horaInicio: string
    horaFin?: string
  }): Promise<DisponibilidadMesaResponse[]> {
    const query = new URLSearchParams({
      idSucursal: String(params.idSucursal),
      fechaReserva: params.fechaReserva,
      horaInicio: params.horaInicio,
    })
    if (params.horaFin) query.set('horaFin', params.horaFin)
    return httpClient.get<DisponibilidadMesaResponse[]>(`/reservas/disponibilidad?${query.toString()}`)
  },

  async crear(data: CrearReservaRequest): Promise<ReservaResponse> {
    return httpClient.post<ReservaResponse>('/reservas', data)
  },

  async listar(params: {
    idSucursal: number
    fechaReserva: string
    estado?: string
  }): Promise<ReservaResponse[]> {
    const query = new URLSearchParams({
      idSucursal: String(params.idSucursal),
      fechaReserva: params.fechaReserva,
    })
    if (params.estado) query.set('estado', params.estado)
    return httpClient.get<ReservaResponse[]>(`/reservas?${query.toString()}`)
  },

  async confirmar(idReserva: number, data: ActualizarEstadoReservaRequest = {}): Promise<ReservaResponse> {
    return httpClient.patch<ReservaResponse>(`/reservas/${idReserva}/confirmar`, data)
  },

  async checkIn(idReserva: number, data: ActualizarEstadoReservaRequest = {}): Promise<ReservaResponse> {
    return httpClient.patch<ReservaResponse>(`/reservas/${idReserva}/check-in`, data)
  },

  async cancelar(idReserva: number, data: ActualizarEstadoReservaRequest = {}): Promise<ReservaResponse> {
    return httpClient.patch<ReservaResponse>(`/reservas/${idReserva}/cancelar`, data)
  },

  async noAsistio(idReserva: number, data: ActualizarEstadoReservaRequest = {}): Promise<ReservaResponse> {
    return httpClient.patch<ReservaResponse>(`/reservas/${idReserva}/no-asistio`, data)
  },

  async historialCliente(): Promise<ReservaResponse[]> {
    return httpClient.get<ReservaResponse[]>('/reservas/cliente/historial')
  },
}
