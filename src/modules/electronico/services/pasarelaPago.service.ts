import { httpClient } from '../../../core/api/http-client'

export type EstadoTransaccionOnline = 'PENDIENTE' | 'PROCESANDO' | 'APROBADA' | 'RECHAZADA' | 'REEMBOLSADA' | 'CANCELADA'

export interface MetodoPagoOnline {
  idMetodoPago: number
  nombre: string
  descripcion?: string | null
  comisionPorcentaje?: number | null
  comisionFija?: number | null
  activo: boolean
}

export interface TransaccionOnlineResumen {
  idTransaccion: number
  idNotaVenta?: number | null
  numeroTransaccion: string
  monto: number
  moneda: string
  estado: EstadoTransaccionOnline
  fechaInicio: string
  fechaCompletado?: string | null
  codigoAutorizacion?: string | null
  codigoError?: string | null
  datosAdicionales?: Record<string, any> | null
}

export interface NotaVentaDetail {
  idNotaVenta: number
  numeroComanda: string | null
  idComanda: number | null
  fechaEmision: string
  fechaPago: string | null
  subtotal: number
  impuesto: number
  total: number
  estado: string
  nitCliente: string | null
  observaciones: string | null
  nombreMetodoPago: string | null
  customerName: string | null
  customerEmail: string | null
  customerPhone: string | null
  shippingAddress: string | null
  shippingCity: string | null
  shippingState: string | null
  shippingZip: string | null
  shippingNotes: string | null
  invoiceNumber: string | null
  detalles: DetalleNotaVenta[]
}

export interface DetalleNotaVenta {
  idDetalle: number
  idProductoFinal: number
  nombreProducto: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface ComandaContext {
  comanda?: {
    idComanda: number
    numeroComanda: string
    total: number
  }
  notaVenta?: {
    idNotaVenta: number
    total: number
  }
  metodosOnline?: MetodoPagoOnline[]
  metodosPago?: MetodoPagoOnline[]
  transaccionActual?: TransaccionOnlineResumen | null
}

export interface IniciarPagoRequest {
  idComanda: number
  idMetodoPago: number
  nitCliente?: string | null
  observaciones?: string | null
  propina?: number
  descuento?: number
  moneda: string
  sandbox?: boolean
}

export interface ConfirmarPagoRequest {
  estado: 'APROBADA' | 'RECHAZADA'
  codigoAutorizacion?: string | null
  codigoError?: string | null
  datosAdicionales?: Record<string, any>
}

export interface CreatePaypalOrderResponse {
  approvalUrl: string
  orderId: string
  message?: string
}

export const PasarelaPagoService = {
  async getMetodosOnline(): Promise<MetodoPagoOnline[]> {
    return await httpClient.get<MetodoPagoOnline[]>('/api/pasarela-pagos/metodos?soloOnline=true')
  },

  async getNotaVenta(idNotaVenta: number): Promise<NotaVentaDetail> {
    return await httpClient.get<NotaVentaDetail>(`/api/notas-venta/mis-pedidos/${idNotaVenta}`)
  },

  async getTransaccion(idTransaccion: number): Promise<TransaccionOnlineResumen> {
    return await httpClient.get<TransaccionOnlineResumen>(`/api/pasarela-pagos/transacciones/${idTransaccion}`)
  },

  async getContext(idComanda: number): Promise<ComandaContext> {
    return await httpClient.get<ComandaContext>(`/api/pasarela-pago/comandas/${idComanda}`)
  },

  async getTransacciones(idComanda: number): Promise<TransaccionOnlineResumen[]> {
    return await httpClient.get<TransaccionOnlineResumen[]>(`/api/pasarela-pago/comandas/${idComanda}/transacciones`)
  },

  async iniciar(request: IniciarPagoRequest): Promise<TransaccionOnlineResumen> {
    return await httpClient.post<TransaccionOnlineResumen>('/api/pasarela-pago/iniciar', request)
  },

  async confirmar(idTransaccion: number, request: ConfirmarPagoRequest): Promise<TransaccionOnlineResumen> {
    return await httpClient.post<TransaccionOnlineResumen>(`/api/pasarela-pagos/transacciones/${idTransaccion}/confirmar`, request)
  },

  async getMisPedidos(): Promise<NotaVentaDetail[]> {
    return await httpClient.get<NotaVentaDetail[]>('/api/notas-venta/mis-pedidos')
  },

  async createPaypalOrder(request: {
    idNotaVenta: number
    idMetodoPago: number
    monto: number
    referencia: string
    customerName: string
    customerEmail: string
    customerPhone: string
    nitCliente: string
    shippingAddress: string
    shippingCity: string
    shippingZip: string
    shippingNotes: string
    items: { name: string; quantity: number; unitAmount: number }[]
    returnUrl: string
    cancelUrl: string
  }): Promise<CreatePaypalOrderResponse> {
    return await httpClient.post<CreatePaypalOrderResponse>('/api/paypal/create', {
      ...request,
      moneda: 'USD',
    })
  },
}