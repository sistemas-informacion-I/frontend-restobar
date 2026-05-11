import { httpClient } from '@/core/api';

export interface ProductoFinal {
  idProductoFinal: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  idCategoria: number;
  nombreCategoria?: string;
  tiempoPreparacion?: number;
  imagenUrl?: string;
  activo: boolean;
}

export interface ProductoFinalRequest {
  codigo: string;
  nombre: string;
  descripcion?: string;
  idCategoria: number;
  tiempoPreparacion?: number;
  imagenUrl?: string;
}

export const productosFinalesService = {
  async getAll(filters?: { idCategoria?: number; activo?: boolean }): Promise<ProductoFinal[]> {
    const params = new URLSearchParams();
    if (filters?.idCategoria !== undefined) {
      params.append('idCategoria', String(filters.idCategoria));
    }
    if (filters?.activo !== undefined) {
      params.append('activo', String(filters.activo));
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return httpClient.get(`/api/productos${query}`);
  },

  async create(data: ProductoFinalRequest): Promise<ProductoFinal> {
    return httpClient.post('/api/productos', data);
  },

  async update(id: number, data: Partial<ProductoFinalRequest>): Promise<ProductoFinal> {
    return httpClient.put(`/api/productos/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return httpClient.delete(`/api/productos/${id}`);
  },

  async uploadImagen(id: number, file: File): Promise<ProductoFinal> {
    const formData = new FormData();
    formData.append('file', file);
    return httpClient.post(`/api/productos/${id}/imagen`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Endpoints para ProductoSucursal
  async obtenerPorSucursal(idSucursal: number): Promise<any[]> {
    return httpClient.get(`/api/productos/sucursal/${idSucursal}`);
  },

  async asignarASucursal(idProducto: number, idSucursal: number, data: { precio: number; disponible: boolean; activo?: boolean }): Promise<any> {
    return httpClient.post(`/api/productos/${idProducto}/asignar-sucursal`, { idSucursal, ...data });
  },

  async actualizarAsignacion(idProducto: number, idSucursal: number, data: { precio?: number; disponible?: boolean; activo?: boolean }): Promise<any> {
    return httpClient.put(`/api/productos/${idProducto}/sucursal/${idSucursal}`, data);
  },

  async obtenerPorProductoYSucursal(idProducto: number, idSucursal: number): Promise<any> {
    return httpClient.get(`/api/productos/${idProducto}/sucursal/${idSucursal}`);
  }
};