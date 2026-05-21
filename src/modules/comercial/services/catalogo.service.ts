import { httpClient } from '@/core/api'
import { CatalogoProducto, CatalogoUpdateRequest } from '../models/catalogo.model'

export const catalogoService = {
  // Vista cliente: catálogo público con filtros
  async getCatalogo(
    idSucursal: number,
    filters?: { busqueda?: string; idCategoria?: number }
  ): Promise<CatalogoProducto[]> {
    const params = new URLSearchParams()
    if (filters?.busqueda) params.append('busqueda', filters.busqueda)
    if (filters?.idCategoria) params.append('idCategoria', String(filters.idCategoria))
    const query = params.toString() ? `?${params.toString()}` : ''
    return httpClient.get(`/api/catalogo/sucursal/${idSucursal}${query}`)
  },

  // Vista admin: todos los productos de la sucursal
  async getCatalogoAdmin(idSucursal: number): Promise<CatalogoProducto[]> {
    return httpClient.get(`/api/catalogo/admin/sucursal/${idSucursal}`)
  },

  // Admin: actualizar precio y disponibilidad
  async actualizarDisponibilidad(
    idSucursal: number,
    idProducto: number,
    data: CatalogoUpdateRequest
  ): Promise<CatalogoProducto> {
    return httpClient.patch(
      `/api/catalogo/admin/sucursal/${idSucursal}/producto/${idProducto}`,
      data
    )
  },
}
