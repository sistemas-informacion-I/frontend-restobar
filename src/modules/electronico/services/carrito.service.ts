import { httpClient } from '@/core/api'
import {
  CarritoResponse,
  AgregarItemRequest,
  ActualizarItemRequest,
  CheckoutResponse,
} from '../models/carrito.model'

// Clave de sesión temporal para clientes anónimos.
// Se genera una vez por sesión de navegación y se persiste en sessionStorage.
const SESSION_ID_KEY = 'gaira_session_id'

export function getOrCreateSessionId(): string {
  let sid = sessionStorage.getItem(SESSION_ID_KEY)
  if (!sid) {
    sid = crypto.randomUUID()
    sessionStorage.setItem(SESSION_ID_KEY, sid)
  }
  return sid
}

// Solo un cliente autenticado opera el carrito por su id; cualquier otro caso
// (anónimo, o usuario autenticado que NO es cliente: SU/empleado) usa X-Session-Id.
function carritoHeaders(esCliente: boolean): Record<string, string> {
  if (esCliente) return {}
  return { 'X-Session-Id': getOrCreateSessionId() }
}

export const carritoService = {
  async getCarrito(idSucursal: number, esCliente: boolean): Promise<CarritoResponse> {
    return httpClient.get(`/carrito?idSucursal=${idSucursal}`, {
      headers: carritoHeaders(esCliente),
    })
  },

  async agregarItem(
    idSucursal: number,
    body: AgregarItemRequest,
    esCliente: boolean
  ): Promise<CarritoResponse> {
    return httpClient.post(`/carrito/items?idSucursal=${idSucursal}`, body, {
      headers: carritoHeaders(esCliente),
    })
  },

  async actualizarItem(
    idSucursal: number,
    idProductoFinal: number,
    body: ActualizarItemRequest,
    esCliente: boolean
  ): Promise<CarritoResponse> {
    return httpClient.put(
      `/carrito/items/${idProductoFinal}?idSucursal=${idSucursal}`,
      body,
      { headers: carritoHeaders(esCliente) }
    )
  },

  async eliminarItem(
    idSucursal: number,
    idProductoFinal: number,
    esCliente: boolean
  ): Promise<CarritoResponse> {
    return httpClient.delete(
      `/carrito/items/${idProductoFinal}?idSucursal=${idSucursal}`,
      { headers: carritoHeaders(esCliente) }
    )
  },

  async checkout(idSucursal: number): Promise<CheckoutResponse> {
    return httpClient.post(`/carrito/checkout?idSucursal=${idSucursal}`)
  },
}
