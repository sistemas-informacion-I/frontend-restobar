import { httpClient } from '../../../core/api/http-client'
import type { Comanda, CreateComandaData, UpdateComandaData, UpdateDetalleComandaData, DetalleComanda } from './types'

class ComandaService {
  /**
   * Obtiene todas las comandas
   */
  async getAll(): Promise<Comanda[]> {
    return httpClient.get<Comanda[]>('/api/comandas')
  }

  /**
   * Obtiene una comanda por ID
   */
  async getOne(id: number): Promise<Comanda> {
    return httpClient.get<Comanda>(`/api/comandas/${id}`)
  }

  /**
   * Crea una nueva comanda
   */
  async create(data: CreateComandaData): Promise<Comanda> {
    return httpClient.post<Comanda>('/api/comandas', data)
  }

  /**
   * Actualiza una comanda existente
   */
  async update(id: number, data: UpdateComandaData): Promise<Comanda> {
    return httpClient.put<Comanda>(`/api/comandas/${id}`, data)
  }

  async updateDetalle(idComanda: number, idDetalle: number, data: UpdateDetalleComandaData): Promise<DetalleComanda> {
    return httpClient.put<DetalleComanda>(`/api/comandas/${idComanda}/detalles/${idDetalle}`, data)
  }

  async cancelarDetalle(idComanda: number, idDetalle: number): Promise<DetalleComanda> {
    return httpClient.patch<DetalleComanda>(`/api/comandas/${idComanda}/detalles/${idDetalle}/cancelar`, {})
  }

  async deleteDetalle(idComanda: number, idDetalle: number): Promise<void> {
    return httpClient.delete<void>(`/api/comandas/${idComanda}/detalles/${idDetalle}`)
  }

  /**
   * Cierra una comanda
   */
  async close(id: number): Promise<Comanda> {
    return httpClient.patch<Comanda>(`/api/comandas/${id}/cerrar`, {})
  }

  /**
   * Obtiene comandas por sucursal
   */
  async getBySucursal(idSucursal: number): Promise<Comanda[]> {
    return httpClient.get<Comanda[]>(`/api/comandas/sucursal/${idSucursal}`)
  }

  /**
   * Obtiene comandas por mesa
   */
  async getByMesa(idMesa: number): Promise<Comanda[]> {
    return httpClient.get<Comanda[]>(`/api/comandas/mesa/${idMesa}`)
  }

  /**
   * Obtiene comandas por estado
   */
  async getByEstado(estado: string): Promise<Comanda[]> {
    return httpClient.get<Comanda[]>(`/api/comandas/estado/${estado}`)
  }
}

export const comandaService = new ComandaService()
