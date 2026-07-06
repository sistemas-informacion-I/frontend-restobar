export type EstadoComanda = 'PENDIENTE_PAGO' | 'ABIERTA' | 'EN_PREPARACION' | 'LISTA' | 'ENTREGADA' | 'CERRADA' | 'CANCELADA'
export type EstadoVenta = 'PAGADA' | 'PENDIENTE' | 'ANULADA' | 'PENDIENTE_PAYPAL' | 'EMITIDA'

export interface Comanda {
  idComanda: number
  numeroComanda: string
  mesa: string
  cliente: string
  nombrePromocion?: string
  subtotal: number
  subtotalOriginal?: number
  subtotalConPromociones?: number
  descuentoPromociones?: number
  descuentoManual?: number
  impuesto?: number
  propina?: number
  promocionesAplicadas?: PromocionAplicadaVenta[]
  estado: string
  hora: string
  sucursal?: string
  idSucursal?: number
  idCliente?: number
  items?: DetalleComandaItem[]
}

export interface DetalleComandaItem {
  idDetalleComanda: number
  idProductoFinal: number
  nombreProducto: string
  precioUnitario: number
  cantidad: number
  notas?: string
  estado: string
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

export interface MetodoPagoResponse {
  idMetodoPago: number
  nombre: string
  descripcion: string | null
  comisionPorcentaje: number | null
  comisionFija: number | null
  activo: boolean
}

export interface ResumenFinanciero {
  subtotalOriginal: number
  subtotalConPromociones: number
  descuentoPromociones: number
  descuentoManual: number
  impuesto: number
  propina: number
  total: number
}

export interface PromocionAplicadaVenta {
  id: number
  nombre: string
  tipo: string
  valorDescuento: number
  montoDescuento: number
}

export interface VentaPresencial {
  idVenta?: number
  comanda: Comanda
  productos: ProductoVenta[]
  cliente: ClienteVenta
  ajustes: AjustesVenta
  metodoPago?: { id: number; nombre: string; monto: number }
  resumen: ResumenFinanciero
  estado: EstadoVenta
}

export interface VentaPresencialRequest {
  idComanda: number
  idCliente?: number
  nombreCliente?: string
  nit?: string
  descuentoPorcentual: number
  descuentoFijo: number
  propinaPorcentual: number
  propinaFija: number
  idMetodoPago: number
}

export interface VentaPresencialConfirmResponse {
  idNotaVenta: number
  estado: string
  total: number
  subtotal: number
  subtotalOriginal?: number
  subtotalConPromociones?: number
  descuentoPromociones?: number
  descuentoManual?: number
  impuesto: number
  descuento: number
  propina: number
  promocionesAplicadas?: PromocionAplicadaVenta[]
  paypalApprovalUrl?: string
  paypalOrderId?: string
  idTransaccion?: number
}

export interface ClienteMock {
  idCliente: number
  nombre: string
  nit?: string
  email?: string
  telefono?: string
}
