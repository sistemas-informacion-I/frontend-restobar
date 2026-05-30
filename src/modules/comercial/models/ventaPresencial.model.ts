export type EstadoComanda = 'LISTA' | 'ENTREGADA'
export type EstadoVenta = 'PAGADO' | 'PENDIENTE' | 'ANULADA'

export interface Comanda {
  idComanda: number
  numeroComanda: string
  mesa: string
  cliente: string
  subtotal: number
  estado: EstadoComanda
  hora: string
  sucursal?: string
}

export interface ProductoVenta {
  idProducto: number
  nombre: string
  cantidad: number
  precioUnitario: number
  subtotal: number
  observaciones?: string
}

export interface ClienteVenta {
  idCliente?: number
  nombre: string
  nit?: string
  esAnonimo: boolean
}

export interface AjustesVenta {
  descuentoPorcentual: number
  descuentoFijo: number
  propinaPorcentual: number
  propinaFija: number
}

export type MetodoPagoType = 'EFECTIVO' | 'TARJETA' | 'QR'

export interface MetodoPago {
  tipo: MetodoPagoType
  monto: number
}

export interface ResumenFinanciero {
  subtotal: number
  descuento: number
  impuesto: number
  propina: number
  total: number
}

export interface VentaPresencial {
  idVenta?: number
  comanda: Comanda
  productos: ProductoVenta[]
  cliente: ClienteVenta
  ajustes: AjustesVenta
  metodoPago?: MetodoPago
  resumen: ResumenFinanciero
  estado: EstadoVenta
}

export interface VentaPresencialRequest {
  idComanda: number
  productos: {
    idProducto: number
    cantidad: number
    observaciones?: string
  }[]
  idCliente?: number
  nombreCliente?: string
  nit?: string
  descuentoPorcentual: number
  descuentoFijo: number
  propinaPorcentual: number
  propinaFija: number
  metodoPago: MetodoPagoType
  montoPagado: number
}

export interface ClienteMock {
  idCliente: number
  nombre: string
  nit?: string
  email?: string
  telefono?: string
}
