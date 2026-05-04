import { httpClient } from './http-client'

export interface Proveedor {
  idProveedor: number
  empresa: string
  nit?: string
  nombreContacto: string
  telefono: string
  correo?: string
  direccion?: string
  categoriaProductos?: string
  activo: boolean
  creadoPor?: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateProveedorData {
  empresa: string
  nit?: string
  nombreContacto: string
  telefono: string
  correo?: string
  direccion?: string
  categoriaProductos?: string
  activo?: boolean
}

export const ProveedoresService = {
  async getAll(empresa?: string, nit?: string, categoria?: string): Promise<Proveedor[]> {
    const params = new URLSearchParams()
    if (empresa) params.append('empresa', empresa)
    if (nit) params.append('nit', nit)
    if (categoria) params.append('categoria', categoria)
    const query = params.toString() ? `?${params.toString()}` : ''
    return await httpClient.get<Proveedor[]>(`/api/proveedores${query}`)
  },

  async getById(id: number): Promise<Proveedor> {
    return await httpClient.get<Proveedor>(`/api/proveedores/${id}`)
  },

  async create(proveedor: CreateProveedorData): Promise<Proveedor> {
    return await httpClient.post<Proveedor>('/api/proveedores', proveedor)
  },

  async update(id: number, proveedor: Partial<CreateProveedorData>): Promise<Proveedor> {
    return await httpClient.put<Proveedor>(`/api/proveedores/${id}`, proveedor)
  },

  async desactivar(id: number): Promise<Proveedor> {
    return await httpClient.patch<Proveedor>(`/api/proveedores/${id}/desactivar`, {})
  }
}
