import { httpClient } from '@/core/api/http-client'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type UnidadMedida = 'KG' | 'GRAMO' | 'LITRO' | 'ML' | 'UNIDAD'
export type EstadoLote = 'DISPONIBLE' | 'VENCIDO' | 'AGOTADO' | 'DAÑADO'

export interface InventarioItem {
  idInventario: number
  codigo: string
  nombre: string
  descripcion?: string
  unidadMedida: UnidadMedida
  marca?: string
  esRehutilizable: boolean
  activo: boolean
  fechaCreacion: string
}

export interface InventarioItemWithStock extends InventarioItem {
  idStock?: number
  stockActual: number
  stockMinimo: number
  stockItem?: StockSucursal
}

export interface InventarioRequest {
  codigo: string
  nombre: string
  descripcion?: string
  unidadMedida: UnidadMedida
  marca?: string
  esRehutilizable?: boolean
  activo?: boolean
}

export interface StockSucursal {
  idStock: number
  idInventario: number
  nombreInventario: string
  idSucursal: number
  nombreSucursal: string
  cantidad: number
  cantidadMinima: number
  cantidadMaxima?: number
  precioUnitario: number
  precioPromedio: number
  ubicacionAlmacen?: string
  activo: boolean
}

export interface StockInicialRequest {
  idInventario: number
  idSucursal: number
  cantidadMinima?: number
  cantidadMaxima?: number
  ubicacionAlmacen?: string
}

export interface Lote {
  idLote: number
  idStock: number
  numeroLote?: string
  cantidad: number
  fechaIngreso: string
  fechaVencimiento?: string
  precioCompra: number
  estado: EstadoLote
}

export interface LoteRequest {
  idStock: number
  numeroLote?: string
  cantidad: number
  fechaIngreso?: string
  fechaVencimiento?: string
  precioCompra: number
  estado?: EstadoLote
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const inventarioService = {
  // Insumos
  listarInsumos: () =>
    httpClient.get<InventarioItem[]>('/api/inventario'),

  crearInsumo: (data: InventarioRequest) =>
    httpClient.post<InventarioItem>('/api/inventario', data),

  actualizarInsumo: (id: number, data: InventarioRequest) =>
    httpClient.put<InventarioItem>(`/api/inventario/${id}`, data),

  eliminarInsumo: (id: number) =>
    httpClient.delete(`/api/inventario/${id}`),

  // Stock
  listarStockPorSucursal: (idSucursal: number) =>
    httpClient.get<StockSucursal[]>(`/api/inventario/stock/sucursal/${idSucursal}`),

  establecerStockInicial: (data: StockInicialRequest) =>
    httpClient.post<StockSucursal>('/api/inventario/stock/inicial', data),

  // Lotes
  listarLotes: (idStock: number, page: number = 0, size: number = 10) =>
    httpClient.get<Page<Lote>>(`/api/inventario/lotes/stock/${idStock}?page=${page}&size=${size}`),

  agregarLote: (data: LoteRequest) =>
    httpClient.post<Lote>('/api/inventario/lotes', data),

  actualizarEstadoLote: (idLote: number, estado: EstadoLote) =>
    httpClient.post<Lote>(`/api/inventario/lotes/${idLote}/estado`, estado),
}
