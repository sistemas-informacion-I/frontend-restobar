import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { VentaPresencialService } from '../services/ventaPresencial.service'
import type {
  Comanda,
  ProductoVenta,
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
    data: productos,
    error: productosError,
    isLoading: productosLoading,
    mutate: refetchProductos,
  } = useSWR<ProductoVenta[] | null>(
    'productos-comanda',
    () => null,
    { revalidateOnMount: false }
  )

  const {
    trigger: confirmarVenta,
    isMutating: isConfirming,
  } = useSWRMutation(
    '/api/ventas-presencial',
    async (_, { arg }: { arg: VentaPresencialRequest }) => {
      return VentaPresencialService.confirmarVenta(arg)
    }
  )

  const cargarProductos = async (idComanda: number) => {
    refetchProductos(
      VentaPresencialService.getProductosByComanda(idComanda),
      false
    )
  }

  return {
    comandas,
    comandasLoading,
    comandasError,
    productos,
    productosLoading,
    productosError,
    isConfirming,
    refetchComandas,
    cargarProductos,
    confirmarVenta,
  }
}
