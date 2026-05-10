import { httpClient } from '@/core/api/http-client'

export type EstadoPago = 'PENDIENTE' | 'PAGADO' | 'PARCIAL' | 'VENCIDO'

export interface DetalleCompraRequest {
  idStock: number
  cantidad: number
  precioUnitario: number
}

export interface CompraRequest {
  idProveedor: number
  idEmpleado: number
  nroFactura: string
  fechaCompra: string
  fechaEntregaProgramada?: string
  fechaLimitePago?: string
  observaciones?: string
  descuento?: number
  detalles: DetalleCompraRequest[]
}

export interface DetalleCompraResponse {
  idDetalleCompra: number
  idStock: number
  nombreProducto: string
  cantidad: number
  precioUnitario: number
  subTotal: number
}

export interface CompraResponse {
  idCompra: number
  idProveedor: number
  nombreProveedor: string
  idEmpleado: number
  nombreEmpleado: string
  nroFactura: string
  fechaCompra: string
  fechaEntregaProgramada?: string
  fechaEntregaReal?: string
  subTotal: number
  descuento: number
  impuesto: number
  total: number
  estadoPago: EstadoPago
  fechaLimitePago?: string
  fechaPago?: string
  observaciones?: string
  createdAt?: string
  updatedAt?: string
  detalles: DetalleCompraResponse[]
}

export interface CompraFiltros {
  nroFactura?: string
  idProveedor?: number
  estadoPago?: EstadoPago
  fechaDesde?: string
  fechaHasta?: string
}

export const ComprasService = {
  async getAll(filtros?: CompraFiltros): Promise<CompraResponse[]> {
    const params = new URLSearchParams()
    if (filtros?.nroFactura) params.append('nroFactura', filtros.nroFactura)
    if (filtros?.idProveedor) params.append('idProveedor', String(filtros.idProveedor))
    if (filtros?.estadoPago) params.append('estadoPago', filtros.estadoPago)
    if (filtros?.fechaDesde) params.append('fechaDesde', filtros.fechaDesde)
    if (filtros?.fechaHasta) params.append('fechaHasta', filtros.fechaHasta)
    const query = params.toString() ? `?${params.toString()}` : ''
    return await httpClient.get<CompraResponse[]>(`/api/compras${query}`)
  },

  async getById(id: number): Promise<CompraResponse> {
    return await httpClient.get<CompraResponse>(`/api/compras/${id}`)
  },

  async create(data: CompraRequest): Promise<CompraResponse> {
    return await httpClient.post<CompraResponse>('/api/compras', data)
  },

  async update(id: number, data: CompraRequest): Promise<CompraResponse> {
    return await httpClient.put<CompraResponse>(`/api/compras/${id}`, data)
  },

  async delete(id: number): Promise<void> {
    await httpClient.delete(`/api/compras/${id}`)
  },

  async cambiarEstadoPago(id: number, estadoPago: EstadoPago): Promise<CompraResponse> {
    return await httpClient.patch<CompraResponse>(
      `/api/compras/${id}/estado-pago?estadoPago=${estadoPago}`,
      {}
    )
  },
}
