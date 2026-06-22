import { httpClient } from '@/core/api/http-client'

export type AlertTipo = 'STOCK_MINIMO' | 'VENCIMIENTO_PROXIMO'
export type AlertEstado = 'NO_LEIDA' | 'LEIDA' | 'RESUELTA'

export interface AlertaInventario {
  idAlerta: number
  idSucursal?: number
  nombreSucursal?: string
  idStock?: number
  idLote?: number
  idInventario?: number
  nombreInventario?: string
  numeroLote?: string
  fechaVencimiento?: string
  cantidadActual?: string
  cantidadMinima?: string
  tipo?: AlertTipo
  estado?: AlertEstado
  nombreTipo?: string
  nombreEstado?: string
}

export interface AlertaInventarioQuery {
  idSucursal?: number
  tipo?: string
  estado?: string
}

export const alertaInventarioService = {
  listarAlertas: (params: AlertaInventarioQuery = {}) =>
    httpClient.get<AlertaInventario[]>('/api/inventario/alertas', { params }),

  contarAlertasPendientes: (idSucursal?: number) =>
    httpClient.get<number>(`/api/inventario/alertas/pendientes/count${idSucursal ? `?idSucursal=${idSucursal}` : ''}`),

  marcarAlertaComoLeida: (idAlerta: number) =>
    httpClient.post<AlertaInventario>(`/api/inventario/alertas/${idAlerta}/leer`, undefined),
}
