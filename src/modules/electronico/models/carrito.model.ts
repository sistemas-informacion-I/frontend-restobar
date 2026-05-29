export interface ItemCarritoResponse {
  idItemCarrito: number
  idProductoFinal: number
  nombreProducto: string
  cantidad: number
  precioUnitario: number
  subtotal: number
  notasEspeciales?: string
  fechaAgregado: string
  disponible: boolean
}

export interface CarritoResponse {
  idCarrito: number | null
  idSucursal: number
  estado: 'ACTIVO' | 'ABANDONADO' | 'CONVERTIDO'
  items: ItemCarritoResponse[]
  total: number
  fechaActualizacion: string
}

export interface AgregarItemRequest {
  idProductoFinal: number
  cantidad: number
  notasEspeciales?: string
}

export interface ActualizarItemRequest {
  cantidad: number
}

export interface CheckoutResponse {
  idNotaVenta: number
}
