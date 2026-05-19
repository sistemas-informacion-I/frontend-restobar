export interface CatalogoProducto {
  idProductoFinal: number
  codigo: string
  nombre: string
  descripcion?: string
  imagenUrl?: string
  tiempoPreparacion?: number
  idCategoria?: number
  nombreCategoria?: string
  precio: number
  disponible: boolean
  hayStock: boolean
}

export interface CatalogoUpdateRequest {
  precio: number
  disponible: boolean
}
