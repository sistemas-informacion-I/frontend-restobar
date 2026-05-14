import { httpClient } from '@/core/api'
import type { UnidadMedida } from '@/modules/inventario/services/inventario.service'

export interface IngredienteReceta {
  idIngredienteReceta?: number
  idInventario: number
  nombreInventario?: string
  cantidad: number
  unidadMedida: UnidadMedida
  notas?: string
}

export interface Receta {
  idReceta: number
  idProductoFinal: number
  nombreProductoFinal: string
  idSucursalReferencia: number
  nombreSucursalReferencia: string
  nombre: string
  descripcion?: string
  tiempoPreparacion?: number
  instrucciones?: string
  versionEtiqueta?: string
  fechaVigenciaInicio?: string
  fechaVigenciaFin?: string
  costoTotal?: number
  activo: boolean
  ingredientes: IngredienteReceta[]
}

export interface RecetaUpsertData {
  idProductoFinal: number
  idSucursalReferencia: number
  nombre: string
  descripcion?: string
  tiempoPreparacion?: number
  instrucciones?: string
  versionEtiqueta?: string
  fechaVigenciaInicio?: string
  fechaVigenciaFin?: string
  ingredientes: Array<{
    idInventario: number
    cantidad: number
    unidadMedida: UnidadMedida
    notas?: string
  }>
  activo?: boolean
}

export interface RecetaDuplicarData {
  nombre: string
  versionEtiqueta?: string
  idSucursalReferencia: number
  fechaVigenciaInicio?: string
  fechaVigenciaFin?: string
}

export interface RecetaCostoResponse {
  idReceta: number
  idSucursal: number
  nombreSucursal: string
  costoTotal: number
}

export interface RecetasFilter {
  nombre?: string
  activo?: boolean
  idProductoFinal?: number
}

const toQuery = (filters?: RecetasFilter) => {
  if (!filters) return ''
  const params = new URLSearchParams()

  if (filters.nombre) params.append('nombre', filters.nombre)
  if (filters.activo !== undefined) params.append('activo', String(filters.activo))
  if (filters.idProductoFinal !== undefined) params.append('idProductoFinal', String(filters.idProductoFinal))

  const query = params.toString()
  return query ? `?${query}` : ''
}

export const recetasService = {
  async getAll(filters?: RecetasFilter): Promise<Receta[]> {
    return httpClient.get<Receta[]>(`/api/recetas${toQuery(filters)}`)
  },

  async getById(id: number): Promise<Receta> {
    return httpClient.get<Receta>(`/api/recetas/${id}`)
  },

  async create(data: RecetaUpsertData): Promise<Receta> {
    return httpClient.post<Receta>('/api/recetas', data)
  },

  async update(id: number, data: RecetaUpsertData): Promise<Receta> {
    return httpClient.put<Receta>(`/api/recetas/${id}`, data)
  },

  async desactivar(id: number): Promise<Receta> {
    return httpClient.patch<Receta>(`/api/recetas/${id}/desactivar`, {})
  },

  async duplicar(id: number, data: RecetaDuplicarData): Promise<Receta> {
    return httpClient.post<Receta>(`/api/recetas/${id}/duplicar`, data)
  },

  async recalcularCosto(id: number, idSucursal: number): Promise<RecetaCostoResponse> {
    return httpClient.post<RecetaCostoResponse>(`/api/recetas/${id}/recalcular-costo?idSucursal=${idSucursal}`, {})
  },

  async delete(id: number): Promise<void> {
    return httpClient.delete(`/api/recetas/${id}`)
  },
}
