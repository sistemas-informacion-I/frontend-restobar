import { httpClient } from '../../../core/api/http-client'
import type {
  Comanda,
  DetalleComandaItem,
  ProductoVenta,
  ClienteMock,
  VentaPresencialRequest,
  VentaPresencialConfirmResponse,
  MetodoPagoResponse,
  PromocionAplicadaVenta,
} from '../models/ventaPresencial.model'
import { comandaService } from '../../operaciones/services/comanda.service'
import type { Comanda as OperacionesComanda } from '../../operaciones/services/types'

function mapComanda(c: OperacionesComanda): Comanda {
  const subtotalItems = (c.items || []).reduce(
    (sum, i) => sum + (i.precioUnitario || 0) * (i.cantidad || 0),
    0
  )
  const subtotalOriginal = c.subtotalOriginal ?? 0
  const subtotalConPromociones = c.subtotalConPromociones ?? subtotalOriginal
  const descuentoPromociones = c.descuentoPromociones ?? 0
  const descuentoManual = c.descuentoManual ?? 0
  const impuesto = c.impuesto ?? 0
  const propina = c.propina ?? 0
  const total = c.total ?? (subtotalConPromociones > 0
    ? subtotalConPromociones - descuentoManual + impuesto + propina
    : subtotalItems)
  const hora = c.fechaApertura
    ? new Date(c.fechaApertura).toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''
  return {
    idComanda: c.idComanda,
    numeroComanda: c.numeroComanda,
    mesa: c.mesaNombre || 'Para llevar',
    cliente: c.clienteNombre || 'Anónimo',
    nombrePromocion: c.nombrePromocion,
    subtotal: total,
    subtotalOriginal: subtotalOriginal > 0 ? subtotalOriginal : subtotalItems,
    subtotalConPromociones: subtotalConPromociones > 0 ? subtotalConPromociones : subtotalItems,
    descuentoPromociones,
    descuentoManual,
    impuesto,
    propina,
    promocionesAplicadas: mapPromociones(c.promocionesAplicadas),
    estado: c.estado,
    hora,
    sucursal: undefined,
    idSucursal: c.idSucursal,
    idCliente: c.idCliente,
    items: c.items?.map((i) => ({
      idDetalleComanda: i.idDetalleComanda,
      idProductoFinal: i.idProductoFinal,
      nombreProducto: i.nombreProducto,
      precioUnitario: i.precioUnitario,
      cantidad: i.cantidad,
      notas: i.notas,
      estado: i.estado,
    })),
  }
}

function mapPromociones(promociones?: OperacionesComanda['promocionesAplicadas']): PromocionAplicadaVenta[] {
  if (!Array.isArray(promociones)) return []
  return promociones.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    tipo: p.tipo,
    valorDescuento: p.valorDescuento,
    montoDescuento: p.montoDescuento,
  }))
}

// Respuesta cruda de /api/clientes (ClienteResponse del backend)
interface RawCliente {
  idCliente: number
  nombreCompleto?: string
  razonSocial?: string
  nit?: string
  correo?: string
  telefono?: string
}

function mapCliente(c: RawCliente): ClienteMock {
  return {
    idCliente: c.idCliente,
    nombre: c.nombreCompleto || c.razonSocial || `Cliente #${c.idCliente}`,
    nit: c.nit,
    email: c.correo,
    telefono: c.telefono,
  }
}

function mapDetalleToProducto(d: DetalleComandaItem): ProductoVenta {
  return {
    idProducto: d.idProductoFinal,
    nombre: d.nombreProducto,
    cantidad: d.cantidad,
    precioUnitario: d.precioUnitario,
    subtotal: d.precioUnitario * d.cantidad,
    observaciones: d.notas,
  }
}

export const VentaPresencialService = {
  async getMetodosPago(): Promise<MetodoPagoResponse[]> {
    return httpClient.get<MetodoPagoResponse[]>('/api/metodos-pago')
  },

  async getComandas(filtro?: string): Promise<Comanda[]> {
    const comandas = await comandaService.getAll()
    const activas = comandas.filter((c) => {
      const est = c.estado
      return est === 'ABIERTA' || est === 'LISTA' || est === 'ENTREGADA'
    })
    if (filtro) {
      const q = filtro.toLowerCase()
      return activas
        .filter(
          (c) =>
            c.numeroComanda.toLowerCase().includes(q) ||
            (c.mesaNombre || '').toLowerCase().includes(q) ||
            (c.clienteNombre || '').toLowerCase().includes(q)
        )
        .map(mapComanda)
    }
    return activas.map(mapComanda)
  },

  async getProductosByComanda(idComanda: number): Promise<ProductoVenta[]> {
    const comanda = await comandaService.getOne(idComanda)
    return (comanda.items || []).map(mapDetalleToProducto)
  },

  async buscarClientes(termino: string): Promise<ClienteMock[]> {
    const data = await httpClient.get<RawCliente[]>(
      `/api/clientes?buscar=${encodeURIComponent(termino)}`
    )
    return data.map(mapCliente)
  },

  async obtenerTodosClientes(): Promise<ClienteMock[]> {
    const data = await httpClient.get<RawCliente[]>('/api/clientes')
    return data.map(mapCliente)
  },

  async confirmarVenta(
    data: VentaPresencialRequest
  ): Promise<VentaPresencialConfirmResponse> {
    return httpClient.post<VentaPresencialConfirmResponse>(
      '/api/notas-venta/presencial',
      data
    )
  },
}
