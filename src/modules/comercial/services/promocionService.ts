import { httpClient } from '../../../core/api/http-client'
import type { Promocion, PromocionDashboard, PromocionRequest } from '../models/Promocion'

const toOptionalNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  return undefined
}

const toOptionalBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'true') return true
    if (normalized === 'false') return false
  }
  return undefined
}

const parseDateValue = (value: unknown): Date | null => {
  if (typeof value !== 'string' || !value.trim()) return null

  const normalized = value.trim()

  // Soporta formatos ISO (yyyy-MM-dd o yyyy-MM-ddTHH:mm:ss)
  const isoMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    const [, year, month, day] = isoMatch
    return new Date(Number(year), Number(month) - 1, Number(day))
  }

  // Soporta formato dd/MM/yyyy
  const slashMatch = normalized.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (slashMatch) {
    const [, day, month, year] = slashMatch
    return new Date(Number(year), Number(month) - 1, Number(day))
  }

  const parsed = new Date(normalized)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const normalizeEstado = (estado: unknown, fechaFin: unknown): string => {
  const estadoNormalizado = typeof estado === 'string' ? estado : ''
  if (estadoNormalizado !== 'ACTIVA') return estadoNormalizado

  const fin = parseDateValue(fechaFin)
  if (!fin) return estadoNormalizado

  const hoy = new Date()
  const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  return fin < hoySinHora ? 'FINALIZADA' : estadoNormalizado
}

const normalizeProductos = (productos: unknown) => {
  if (!Array.isArray(productos)) return []

  return productos.map((producto: any) => ({
    idProductoFinal: Number(producto?.idProductoFinal ?? producto?.idProducto ?? 0) || undefined,
    nombre: producto?.nombre ?? producto?.nombreProducto ?? undefined,
    codigo: producto?.codigo ?? producto?.codigoProducto ?? undefined,
    nombreCategoria: producto?.nombreCategoria ?? producto?.categoria ?? undefined,
    precio:
      producto?.precio != null && Number.isFinite(Number(producto?.precio))
        ? Number(producto?.precio)
        : undefined,
    estado: typeof producto?.estado === 'string' ? producto.estado : undefined,
  }))
}

const normalizePromocion = (promocion: any): Promocion => ({
  id: promocion.idPromocion ?? promocion.id ?? 0,
  idPromocion: promocion.idPromocion,
  nombre: promocion.nombre ?? '',
  descripcion: promocion.descripcion ?? '',
  tipo: promocion.tipo ?? 'PORCENTAJE',
  valorDescuento: Number(promocion.valorDescuento ?? 0),
  compraMinima: promocion.compraMinima != null ? Number(promocion.compraMinima) : undefined,
  fechaInicio: promocion.fechaInicio ?? '',
  fechaFin: promocion.fechaFin ?? '',
  estado: normalizeEstado(promocion.estado, promocion.fechaFin),
  activo: Boolean(promocion.activo),
  idSucursal: Number(promocion.idSucursal ?? 0),
  nombreSucursal: promocion.nombreSucursal ?? promocion.sucursal?.nombre ?? undefined,
  productos: normalizeProductos(promocion.productos),
  editable: toOptionalBoolean(promocion.editable),
  aplicable: toOptionalBoolean(promocion.aplicable),
  diasRestantes: toOptionalNumber(promocion.diasRestantes),
  diasTranscurridos: toOptionalNumber(promocion.diasTranscurridos),
})

const normalizeDashboard = (dashboard: any): PromocionDashboard => ({
  cantidadPromocionesActivas: Number(dashboard.cantidadPromocionesActivas ?? 0),
  cantidadPromocionesProgramadas: Number(dashboard.cantidadPromocionesProgramadas ?? 0),
  cantidadPromocionesInactivas: Number(dashboard.cantidadPromocionesInactivas ?? 0),
  cantidadPromocionesFinalizadas: Number(dashboard.cantidadPromocionesFinalizadas ?? 0),
})

export const promocionService = {
  async getAll(params?: { nombre?: string; idSucursal?: number; estado?: string; tipo?: string; fechaInicio?: string; fechaFin?: string }): Promise<Promocion[]> {
    const query = new URLSearchParams()
    if (params?.nombre) query.append('nombre', params.nombre)
    if (params?.idSucursal) query.append('idSucursal', String(params.idSucursal))
    if (params?.estado) query.append('estado', params.estado)
    if (params?.tipo) query.append('tipo', params.tipo)
    if (params?.fechaInicio) query.append('fechaInicio', params.fechaInicio)
    if (params?.fechaFin) query.append('fechaFin', params.fechaFin)

    const suffix = query.toString() ? `?${query.toString()}` : ''
    const data = await httpClient.get<any>(`/api/promociones${suffix}`)
    const promociones = Array.isArray(data)
      ? data
      : Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data?.data)
      ? data.data
      : []
    return promociones.map(normalizePromocion)
  },

  async getById(id: number): Promise<Promocion> {
    const data = await httpClient.get<any>(`/api/promociones/${id}`)
    return normalizePromocion(data)
  },

  async getDashboard(): Promise<PromocionDashboard> {
    const data = await httpClient.get<any>('/api/promociones/dashboard')
    return normalizeDashboard(data)
  },

  async getActives(): Promise<Promocion[]> {
    const data = await httpClient.get<any[]>('/api/promociones/activas')
    return data.map(normalizePromocion)
  },

  async create(data: PromocionRequest): Promise<Promocion> {
    const payload = await httpClient.post<any>('/api/promociones', data)
    return normalizePromocion(payload)
  },

  async update(id: number, data: PromocionRequest): Promise<Promocion> {
    const payload = await httpClient.put<any>(`/api/promociones/${id}`, data)
    return normalizePromocion(payload)
  },

  async delete(id: number): Promise<Promocion> {
    const payload = await httpClient.delete<any>(`/api/promociones/${id}`)
    return normalizePromocion(payload)
  },

  async activate(id: number): Promise<Promocion> {
    const payload = await httpClient.patch<any>(`/api/promociones/${id}/activar`, {})
    return normalizePromocion(payload)
  },

  async deactivate(id: number): Promise<Promocion> {
    const payload = await httpClient.patch<any>(`/api/promociones/${id}/desactivar`, {})
    return normalizePromocion(payload)
  },
}
