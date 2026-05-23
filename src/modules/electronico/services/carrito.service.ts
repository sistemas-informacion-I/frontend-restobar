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

function carritoHeaders(isAuthenticated: boolean): Record<string, string> {
  if (isAuthenticated) return {}
  return { 'X-Session-Id': getOrCreateSessionId() }
}

export const carritoService = {
  async getCarrito(idSucursal: number, isAuthenticated: boolean): Promise<CarritoResponse> {
    return httpClient.get(`/carrito?idSucursal=${idSucursal}`)
  },

  async agregarItem(
    idSucursal: number,
    body: AgregarItemRequest,
    isAuthenticated: boolean
  ): Promise<CarritoResponse> {
    return httpClient.post(`/carrito/items?idSucursal=${idSucursal}`, body, {
      headers: carritoHeaders(isAuthenticated),
    })
  },

  async actualizarItem(
    idSucursal: number,
    idProductoFinal: number,
    body: ActualizarItemRequest,
    isAuthenticated: boolean
  ): Promise<CarritoResponse> {
    return httpClient.put(
      `/carrito/items/${idProductoFinal}?idSucursal=${idSucursal}`,
      body,
      { headers: carritoHeaders(isAuthenticated) }
    )
  },

  async eliminarItem(
    idSucursal: number,
    idProductoFinal: number,
    isAuthenticated: boolean
  ): Promise<CarritoResponse> {
    return httpClient.delete(
      `/carrito/items/${idProductoFinal}?idSucursal=${idSucursal}`
    )
  },

  async checkout(idSucursal: number): Promise<CheckoutResponse> {
    return httpClient.post(`/carrito/checkout?idSucursal=${idSucursal}`)
  },
}
