import { useCallback } from 'react'
import useSWR from 'swr'
import { PasarelaPagoService, IniciarPagoRequest, ConfirmarPagoRequest } from '../services/pasarelaPago.service'

export const usePasarelaPago = (idComanda?: number) => {
  const contextKey = idComanda ? `/api/pasarela-pago/comandas/${idComanda}` : null
  const transaccionesKey = idComanda ? `/api/pasarela-pago/comandas/${idComanda}/transacciones` : null

  const {
    data: contexto,
    error: loadError,
    isLoading,
    mutate,
  } = useSWR(contextKey, () => PasarelaPagoService.getContext(idComanda!))

  const {
    data: transacciones = [],
    mutate: mutateTransacciones,
  } = useSWR(transaccionesKey, () => PasarelaPagoService.getTransacciones(idComanda!))

  const iniciarPago = useCallback(async (request: IniciarPagoRequest) => {
    const response = await PasarelaPagoService.iniciar(request)
    await mutateTransacciones()
    return response
  }, [mutateTransacciones])

  const confirmarPago = useCallback(async (idTransaccion: number, request: ConfirmarPagoRequest) => {
    const response = await PasarelaPagoService.confirmar(idTransaccion, request)
    await mutateTransacciones()
    return response
  }, [mutateTransacciones])

  return {
    contexto,
    transacciones,
    isLoading,
    loadError,
    iniciarPago,
    confirmarPago,
    refresh: mutate,
    refreshTransacciones: mutateTransacciones,
  }
}