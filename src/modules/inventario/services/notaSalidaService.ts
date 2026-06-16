import { httpClient as api } from '@/core/api/http-client'

export interface DetalleNotaSalida {
  idStockSucursal?: number
  descripcion: string
  cantidad: number
  monto: number
}

export interface NotaSalidaRequest {
  idSucursal: number
  idEmpleado?: number
  tipoGasto: string
  descripcion?: string
  observaciones?: string
  detalles: DetalleNotaSalida[]
}

export const notaSalidaService = {
  listar: async (idSucursal: number, params?: any) => {
    return api.get<any>(`/api/inventario/notas-salida`, { params: { idSucursal, ...params } })
  },
  crear: async (data: NotaSalidaRequest) => {
    return api.post<any>('/api/inventario/notas-salida', data)
  },
  anular: async (id: number) => {
    return api.put<any>(`/api/inventario/notas-salida/${id}/anular`)
  }
}
