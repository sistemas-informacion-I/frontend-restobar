import { httpClient } from '../../../core/api/http-client'
import type {
  Comanda,
  ProductoVenta,
  ClienteMock,
  VentaPresencialRequest,
  VentaPresencial,
  MetodoPagoResponse,
} from '../models/ventaPresencial.model'

const MOCK_COMANDAS: Comanda[] = [
  { idComanda: 1, numeroComanda: 'C-001', mesa: 'Mesa 5', cliente: 'Carlos Méndez', subtotal: 185.50, estado: 'LISTA', hora: '12:30' },
  { idComanda: 2, numeroComanda: 'C-002', mesa: 'Mesa 3', cliente: 'Ana López', subtotal: 92.00, estado: 'ENTREGADA', hora: '12:15' },
  { idComanda: 3, numeroComanda: 'C-003', mesa: 'Para llevar', cliente: 'Pedro Ramírez', subtotal: 210.00, estado: 'LISTA', hora: '12:45' },
  { idComanda: 4, numeroComanda: 'C-004', mesa: 'Mesa 8', cliente: 'María García', subtotal: 156.30, estado: 'LISTA', hora: '13:00' },
  { idComanda: 5, numeroComanda: 'C-005', mesa: 'Mesa 2', cliente: 'José Fernández', subtotal: 74.80, estado: 'ENTREGADA', hora: '11:50' },
  { idComanda: 6, numeroComanda: 'C-006', mesa: 'Mesa 1', cliente: 'Lucía Torres', subtotal: 320.00, estado: 'LISTA', hora: '13:15' },
  { idComanda: 7, numeroComanda: 'C-007', mesa: 'Para llevar', cliente: 'Roberto Paz', subtotal: 45.00, estado: 'LISTA', hora: '13:20' },
  { idComanda: 8, numeroComanda: 'C-008', mesa: 'Mesa 6', cliente: 'Sofía Rivas', subtotal: 198.00, estado: 'ENTREGADA', hora: '12:05' },
]

const MOCK_PRODUCTOS: Record<number, ProductoVenta[]> = {
  1: [
    { idProducto: 1, nombre: 'Lomo Saltado', cantidad: 2, precioUnitario: 45.00, subtotal: 90.00, observaciones: 'Sin cebolla' },
    { idProducto: 2, nombre: 'Coca Cola 500ml', cantidad: 3, precioUnitario: 8.50, subtotal: 25.50 },
    { idProducto: 3, nombre: 'Arroz Chaufa', cantidad: 1, precioUnitario: 38.00, subtotal: 38.00 },
    { idProducto: 4, nombre: 'Inka Cola 500ml', cantidad: 2, precioUnitario: 8.50, subtotal: 17.00, observaciones: 'Bien fría' },
    { idProducto: 5, nombre: 'Tequeños (6 und)', cantidad: 1, precioUnitario: 15.00, subtotal: 15.00 },
  ],
  2: [
    { idProducto: 6, nombre: 'Ceviche Mixto', cantidad: 1, precioUnitario: 42.00, subtotal: 42.00 },
    { idProducto: 7, nombre: 'Chicha Morada', cantidad: 2, precioUnitario: 7.00, subtotal: 14.00 },
    { idProducto: 8, nombre: 'Papa a la Huancaina', cantidad: 1, precioUnitario: 18.00, subtotal: 18.00 },
    { idProducto: 9, nombre: 'Arroz con Mariscos', cantidad: 1, precioUnitario: 18.00, subtotal: 18.00 },
  ],
  3: [
    { idProducto: 10, nombre: 'Pollo a la Brasa 1/4', cantidad: 2, precioUnitario: 32.00, subtotal: 64.00 },
    { idProducto: 11, nombre: 'Papas Fritas Grandes', cantidad: 2, precioUnitario: 12.00, subtotal: 24.00, observaciones: 'Extra crocantes' },
    { idProducto: 12, nombre: 'Ensalada Clásica', cantidad: 2, precioUnitario: 10.00, subtotal: 20.00 },
    { idProducto: 2, nombre: 'Coca Cola 500ml', cantidad: 4, precioUnitario: 8.50, subtotal: 34.00 },
    { idProducto: 7, nombre: 'Chicha Morada', cantidad: 4, precioUnitario: 7.00, subtotal: 28.00 },
    { idProducto: 13, nombre: 'Crema Volteada', cantidad: 4, precioUnitario: 10.00, subtotal: 40.00 },
  ],
  4: [
    { idProducto: 14, nombre: 'Tallarines Verdes', cantidad: 2, precioUnitario: 35.00, subtotal: 70.00, observaciones: 'Con filete de pollo' },
    { idProducto: 15, nombre: 'Jarra de Limonada', cantidad: 1, precioUnitario: 18.00, subtotal: 18.00 },
    { idProducto: 16, nombre: 'Alitas BBQ (8 und)', cantidad: 1, precioUnitario: 28.00, subtotal: 28.00 },
    { idProducto: 2, nombre: 'Coca Cola 500ml', cantidad: 2, precioUnitario: 8.50, subtotal: 17.00 },
    { idProducto: 17, nombre: 'Brownie con Helado', cantidad: 1, precioUnitario: 15.00, subtotal: 15.00, observaciones: 'Helado de vainilla' },
    { idProducto: 18, nombre: 'Café Americano', cantidad: 1, precioUnitario: 8.30, subtotal: 8.30 },
  ],
  5: [
    { idProducto: 19, nombre: 'Sándwich Club', cantidad: 2, precioUnitario: 22.00, subtotal: 44.00 },
    { idProducto: 15, nombre: 'Jarra de Limonada', cantidad: 1, precioUnitario: 18.00, subtotal: 18.00 },
    { idProducto: 20, nombre: 'Porción de Torta de Chocolate', cantidad: 2, precioUnitario: 6.40, subtotal: 12.80 },
  ],
  6: [
    { idProducto: 21, nombre: 'Parrilla para 2', cantidad: 1, precioUnitario: 120.00, subtotal: 120.00 },
    { idProducto: 22, nombre: 'Vino Tinto Santa Rita', cantidad: 1, precioUnitario: 85.00, subtotal: 85.00 },
    { idProducto: 23, nombre: 'Papas Rústicas', cantidad: 2, precioUnitario: 15.00, subtotal: 30.00 },
    { idProducto: 24, nombre: 'Botella de Agua 625ml', cantidad: 2, precioUnitario: 6.00, subtotal: 12.00 },
    { idProducto: 25, nombre: 'Flan Casero', cantidad: 2, precioUnitario: 12.00, subtotal: 24.00 },
    { idProducto: 26, nombre: 'Pisco Sour', cantidad: 2, precioUnitario: 24.50, subtotal: 49.00 },
  ],
  7: [
    { idProducto: 27, nombre: 'Empanada de Carne', cantidad: 3, precioUnitario: 8.00, subtotal: 24.00 },
    { idProducto: 7, nombre: 'Chicha Morada', cantidad: 3, precioUnitario: 7.00, subtotal: 21.00 },
  ],
  8: [
    { idProducto: 28, nombre: 'Lomo de Res con Puré', cantidad: 2, precioUnitario: 55.00, subtotal: 110.00, observaciones: 'Término medio' },
    { idProducto: 22, nombre: 'Vino Tinto Santa Rita', cantidad: 1, precioUnitario: 85.00, subtotal: 85.00 },
    { idProducto: 4, nombre: 'Inka Cola 500ml', cantidad: 1, precioUnitario: 8.50, subtotal: 8.50, observaciones: 'Sin hielo' },
  ],
}

const MOCK_CLIENTES: ClienteMock[] = [
  { idCliente: 1, nombre: 'Carlos Méndez', nit: '1234567890', email: 'carlos@email.com', telefono: '77712345' },
  { idCliente: 2, nombre: 'Ana López', nit: '9876543210', email: 'ana@email.com', telefono: '76543210' },
  { idCliente: 3, nombre: 'Pedro Ramírez', nit: '4567891230', email: 'pedro@email.com', telefono: '71122334' },
  { idCliente: 4, nombre: 'María García', nit: '3216549870', email: 'maria@email.com', telefono: '72233445' },
  { idCliente: 5, nombre: 'José Fernández', email: 'jose@email.com', telefono: '73344556' },
  { idCliente: 6, nombre: 'Lucía Torres', nit: '6549873210', email: 'lucia@email.com', telefono: '74455667' },
  { idCliente: 7, nombre: 'Roberto Paz', email: 'roberto@email.com', telefono: '75566778' },
  { idCliente: 8, nombre: 'Sofía Rivas', nit: '7891234560', email: 'sofia@email.com', telefono: '76677889' },
  { idCliente: 9, nombre: 'Miguel Ángel Ruiz', nit: '1593572580', email: 'miguel@email.com', telefono: '77788990' },
  { idCliente: 10, nombre: 'Carmen Villalobos', email: 'carmen@email.com', telefono: '78899001' },
]

function simulateDelay<T>(data: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms))
}

export const VentaPresencialService = {
  async getMetodosPago(): Promise<MetodoPagoResponse[]> {
    if (import.meta.env.VITE_USE_MOCK !== 'false') {
      return simulateDelay([
        { idMetodoPago: 1, nombre: 'Efectivo', descripcion: 'Pago en efectivo en punto de venta', comisionPorcentaje: 0, comisionFija: 0, activo: true },
        { idMetodoPago: 2, nombre: 'Tarjeta Débito', descripcion: 'Pago con tarjeta de débito Visa/Mastercard', comisionPorcentaje: 2.5, comisionFija: 0.50, activo: true },
        { idMetodoPago: 3, nombre: 'QR Pago Móvil', descripcion: 'Pago mediante código QR (BCP, etc.)', comisionPorcentaje: 1.5, comisionFija: 0, activo: true },
        { idMetodoPago: 4, nombre: 'PayPal', descripcion: 'Pago a través de PayPal', comisionPorcentaje: 3.5, comisionFija: 0.30, activo: true },
      ])
    }
    return httpClient.get<MetodoPagoResponse[]>('/api/metodos-pago')
  },
  async getComandas(filtro?: string): Promise<Comanda[]> {
    if (import.meta.env.VITE_USE_MOCK !== 'false') {
      let result = MOCK_COMANDAS
      if (filtro) {
        const q = filtro.toLowerCase()
        result = result.filter(
          (c) =>
            c.numeroComanda.toLowerCase().includes(q) ||
            c.mesa.toLowerCase().includes(q) ||
            c.cliente.toLowerCase().includes(q)
        )
      }
      return simulateDelay(result)
    }
    const params = filtro ? `?filtro=${encodeURIComponent(filtro)}` : ''
    return httpClient.get<Comanda[]>(`/api/comandas${params}`)
  },

  async getProductosByComanda(idComanda: number): Promise<ProductoVenta[]> {
    if (import.meta.env.VITE_USE_MOCK !== 'false') {
      return simulateDelay(MOCK_PRODUCTOS[idComanda] || [])
    }
    return httpClient.get<ProductoVenta[]>(`/api/comandas/${idComanda}/productos`)
  },

  async buscarClientes(termino: string): Promise<ClienteMock[]> {
    if (import.meta.env.VITE_USE_MOCK !== 'false') {
      const q = termino.toLowerCase()
      const result = MOCK_CLIENTES.filter(
        (c) =>
          c.nombre.toLowerCase().includes(q) ||
          (c.nit && c.nit.includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q))
      )
      return simulateDelay(result, 300)
    }
    return httpClient.get<ClienteMock[]>(`/api/clientes?buscar=${encodeURIComponent(termino)}`)
  },

  async obtenerTodosClientes(): Promise<ClienteMock[]> {
    if (import.meta.env.VITE_USE_MOCK !== 'false') {
      return simulateDelay(MOCK_CLIENTES, 400)
    }
    return httpClient.get<ClienteMock[]>('/api/clientes')
  },

  async confirmarVenta(data: VentaPresencialRequest): Promise<VentaPresencial> {
    if (import.meta.env.VITE_USE_MOCK !== 'false') {
      await new Promise((r) => setTimeout(r, 1500))
      const comanda = MOCK_COMANDAS.find((c) => c.idComanda === data.idComanda)
      if (!comanda) throw new Error('Comanda no encontrada')
      return {
        idVenta: Date.now(),
        estado: 'PAGADO',
        comanda,
        productos: (MOCK_PRODUCTOS[data.idComanda] || []).map((p) => ({
          ...p,
          cantidad: p.cantidad,
        })),
        cliente: data.idCliente
          ? { idCliente: data.idCliente, nombre: data.nombreCliente || '', nit: data.nit, esAnonimo: false }
          : { nombre: data.nombreCliente || 'Anónimo', esAnonimo: true },
        ajustes: {
          descuentoPorcentual: data.descuentoPorcentual,
          descuentoFijo: data.descuentoFijo,
          propinaPorcentual: data.propinaPorcentual,
          propinaFija: data.propinaFija,
        },
        metodoPago: { tipo: data.metodoPago, monto: data.montoPagado },
        resumen: {
          subtotal: comanda.subtotal,
          descuento: data.descuentoFijo + (comanda.subtotal * data.descuentoPorcentual) / 100,
          impuesto: (comanda.subtotal - (data.descuentoFijo + (comanda.subtotal * data.descuentoPorcentual) / 100)) * 0.18,
          propina: data.propinaFija + (comanda.subtotal * data.propinaPorcentual) / 100,
          total: comanda.subtotal - data.descuentoFijo - (comanda.subtotal * data.descuentoPorcentual) / 100 + data.propinaFija + (comanda.subtotal * data.propinaPorcentual) / 100,
        },
      }
    }
    return httpClient.post<VentaPresencial>('/api/notas-venta', data)
  },
}
