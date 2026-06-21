import { httpClient } from '@/core/api/http-client'

export type EstadoCaja = 'ABIERTA' | 'CERRADA'
export type TipoMovimiento = 'INGRESO' | 'EGRESO'
export type ConceptoMovimiento =
  | 'VENTA'
  | 'COMPRA'
  | 'NOTA_SALIDA'
  | 'INGRESO_EXTRA'
  | 'RETIRO'
  | 'AJUSTE'

export interface MovimientoCajaResponse {
  idMovimiento: number
  idCaja: number
  tipo: TipoMovimiento
  concepto: ConceptoMovimiento
  monto: number
  descripcion?: string
  idEmpleado?: number
  nombreEmpleado?: string
  referenciaId?: number
  fecha: string
}

export interface CajaResponse {
  idCaja: number
  idSucursal: number
  nombreSucursal: string
  estado: EstadoCaja
  montoInicial: number
  idEmpleadoApertura?: number
  empleadoApertura?: string
  fechaApertura: string
  observacionApertura?: string
  totalIngresos: number
  totalEgresos: number
  saldoEsperado: number
  cantidadMovimientos: number
  montoFinal?: number
  diferencia?: number
  idEmpleadoCierre?: number
  empleadoCierre?: string
  fechaCierre?: string
  observacionCierre?: string
  movimientos?: MovimientoCajaResponse[]
}

export interface ArqueoResponse {
  idCaja: number
  montoInicial: number
  totalIngresos: number
  totalEgresos: number
  saldoEsperado: number
  cantidadMovimientos: number
}

export interface AbrirCajaRequest {
  idSucursal?: number
  montoInicial: number
  observacion?: string
}

export interface MovimientoManualRequest {
  concepto: 'INGRESO_EXTRA' | 'RETIRO'
  monto: number
  descripcion?: string
}

export interface CerrarCajaRequest {
  montoFinal: number
  observacion?: string
}

export interface CajaFiltros {
  idSucursal?: number
  estado?: EstadoCaja
}

export const CajaService = {
  /** Caja abierta actual de la sucursal (404 si no hay). SU debe pasar idSucursal. */
  async getActual(idSucursal?: number): Promise<CajaResponse> {
    const query = idSucursal ? `?idSucursal=${idSucursal}` : ''
    return await httpClient.get<CajaResponse>(`/api/cajas/actual${query}`)
  },

  async getHistorial(filtros?: CajaFiltros): Promise<CajaResponse[]> {
    const params = new URLSearchParams()
    if (filtros?.idSucursal) params.append('idSucursal', String(filtros.idSucursal))
    if (filtros?.estado) params.append('estado', filtros.estado)
    const query = params.toString() ? `?${params.toString()}` : ''
    return await httpClient.get<CajaResponse[]>(`/api/cajas${query}`)
  },

  async getById(id: number): Promise<CajaResponse> {
    return await httpClient.get<CajaResponse>(`/api/cajas/${id}`)
  },

  async getMovimientos(id: number): Promise<MovimientoCajaResponse[]> {
    return await httpClient.get<MovimientoCajaResponse[]>(`/api/cajas/${id}/movimientos`)
  },

  async getArqueo(id: number): Promise<ArqueoResponse> {
    return await httpClient.get<ArqueoResponse>(`/api/cajas/${id}/arqueo`)
  },

  async abrir(data: AbrirCajaRequest): Promise<CajaResponse> {
    return await httpClient.post<CajaResponse>('/api/cajas/abrir', data)
  },

  async registrarMovimiento(id: number, data: MovimientoManualRequest): Promise<CajaResponse> {
    return await httpClient.post<CajaResponse>(`/api/cajas/${id}/movimientos`, data)
  },

  async cerrar(id: number, data: CerrarCajaRequest): Promise<CajaResponse> {
    return await httpClient.post<CajaResponse>(`/api/cajas/${id}/cerrar`, data)
  },
}
