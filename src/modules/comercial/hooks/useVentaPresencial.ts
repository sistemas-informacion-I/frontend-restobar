import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { VentaPresencialService } from '../services/ventaPresencial.service'
import type {
  Comanda,
  VentaPresencialRequest,
} from '../models/ventaPresencial.model'

export const useVentaPresencial = () => {
  const {
    data: comandas = [],
    error: comandasError,
    isLoading: comandasLoading,
    mutate: refetchComandas,
  } = useSWR<Comanda[]>('/api/ventas-presencial/comandas', () =>
    VentaPresencialService.getComandas()
  )

  const {
    trigger: confirmarVenta,
    isMutating: isConfirming,
  } = useSWRMutation(
    '/api/notas-venta/presencial',
    async (_, { arg }: { arg: VentaPresencialRequest }) => {
      return VentaPresencialService.confirmarVenta(arg)
    }
  )

  return {
    comandas,
    comandasLoading,
    comandasError,
    isConfirming,
    refetchComandas,
    confirmarVenta,
  }
}
