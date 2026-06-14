import { httpClient } from '../../../core/api/http-client'

export interface Categoria {
  idCategoria: number
  nombre: string
  descripcion?: string
  idCategoriaPadre?: number
  nombreCategoriaPadre?: string
  nivel: number
  activo: boolean
}

export interface CreateCategoriaData {
  nombre: string
  descripcion?: string
  idCategoriaPadre?: number | null
}

export const CategoriasService = {
  async getAll(nombre?: string): Promise<Categoria[]> {
    const params = new URLSearchParams()
    if (nombre) params.append('nombre', nombre)
    const query = params.toString() ? `?${params.toString()}` : ''
    return await httpClient.get<Categoria[]>(`/api/categorias${query}`)
  },

  async getById(id: number): Promise<Categoria> {
    return await httpClient.get<Categoria>(`/api/categorias/${id}`)
  },

  async getRoots(): Promise<Categoria[]> {
    return await httpClient.get<Categoria[]>('/api/categorias/raices')
  },

  async getChildren(id: number): Promise<Categoria[]> {
    return await httpClient.get<Categoria[]>(`/api/categorias/${id}/hijos`)
  },

  async create(categoria: CreateCategoriaData): Promise<Categoria> {
    return await httpClient.post<Categoria>('/api/categorias', categoria)
  },

  async update(id: number, categoria: CreateCategoriaData): Promise<Categoria> {
    return await httpClient.put<Categoria>(`/api/categorias/${id}`, categoria)
  },

  async desactivar(id: number): Promise<Categoria> {
    return await httpClient.patch<Categoria>(`/api/categorias/${id}/desactivar`, {})
  },

  async activar(id: number): Promise<Categoria> {
    return await httpClient.patch<Categoria>(`/api/categorias/${id}/activar`, {})
  },
}
