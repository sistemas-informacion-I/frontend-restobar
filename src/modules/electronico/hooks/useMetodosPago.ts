import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import {
  MetodosPagoService,
  MetodoPago,
  MetodoPagoUpdateData,
} from '../services/metodosPago.service'

export const useMetodosPago = () => {
  const {
    data: metodosPago = [],
    error: loadError,
    isLoading,
    mutate,
  } = useSWR<MetodoPago[]>('/api/metodos-pago', () => MetodosPagoService.getAll())

  const { trigger: updateMetodoPago, isMutating: isUpdating } = useSWRMutation(
    '/api/metodos-pago/update',
    async (_, { arg }: { arg: { id: number; data: MetodoPagoUpdateData } }) => {
      return MetodosPagoService.update(arg.id, arg.data)
    },
    { onSuccess: () => mutate() }
  )

  return {
    metodosPago,
    isLoading,
    loadError,
    isUpdating,
    isSubmitting: isUpdating,
    updateMetodoPago,
    refresh: mutate,
  }
}