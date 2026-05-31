import { httpClient } from '../../../core/api/http-client'
import type {
  Comanda,
  DetalleComandaItem,
  ProductoVenta,
  ClienteMock,
  VentaPresencialRequest,
  VentaPresencialConfirmResponse,
  MetodoPagoResponse,
} from '../models/ventaPresencial.model'
import { comandaService } from '../../operaciones/services/comanda.service'
import type { Comanda as OperacionesComanda } from '../../operaciones/services/types'

function mapComanda(c: OperacionesComanda): Comanda {
  const items = c.items || []
  const subtotal = items.reduce(
    (sum, i) => sum + (i.precioUnitario || 0) * (i.cantidad || 0),
    0
  )
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
    subtotal,
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
    return httpClient.get<ClienteMock[]>(
      `/api/clientes?buscar=${encodeURIComponent(termino)}`
    )
  },

  async obtenerTodosClientes(): Promise<ClienteMock[]> {
    return httpClient.get<ClienteMock[]>('/api/clientes')
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
