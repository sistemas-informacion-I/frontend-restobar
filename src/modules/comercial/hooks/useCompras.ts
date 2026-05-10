import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import {
  ComprasService,
  CompraResponse,
  CompraRequest,
  CompraFiltros,
  EstadoPago,
} from '../services/compras.service'

function buildKey(filtros?: CompraFiltros): string {
  const params = new URLSearchParams()
  if (filtros?.nroFactura) params.append('nroFactura', filtros.nroFactura)
  if (filtros?.idProveedor) params.append('idProveedor', String(filtros.idProveedor))
  if (filtros?.estadoPago) params.append('estadoPago', filtros.estadoPago)
  if (filtros?.fechaDesde) params.append('fechaDesde', filtros.fechaDesde)
  if (filtros?.fechaHasta) params.append('fechaHasta', filtros.fechaHasta)
  const qs = params.toString()
  return qs ? `/api/compras?${qs}` : '/api/compras'
}

export const useCompras = (filtros?: CompraFiltros) => {
  const swrKey = buildKey(filtros)

  const {
    data: compras = [],
    error: loadError,
    isLoading,
    mutate,
  } = useSWR<CompraResponse[]>(swrKey, () => ComprasService.getAll(filtros))

  const { trigger: createCompra, isMutating: isCreating } = useSWRMutation(
    '/api/compras',
    async (_, { arg }: { arg: CompraRequest }) => {
      return ComprasService.create(arg)
    },
    { onSuccess: () => mutate() }
  )

  const { trigger: updateCompra, isMutating: isUpdating } = useSWRMutation(
    '/api/compras/update',
    async (_, { arg }: { arg: { id: number; data: CompraRequest } }) => {
      return ComprasService.update(arg.id, arg.data)
    },
    { onSuccess: () => mutate() }
  )

  const { trigger: deleteCompra, isMutating: isDeleting } = useSWRMutation(
    '/api/compras/delete',
    async (_, { arg }: { arg: number }) => {
      return ComprasService.delete(arg)
    },
    { onSuccess: () => mutate() }
  )

  const { trigger: cambiarEstadoPago, isMutating: isChangingEstado } = useSWRMutation(
    '/api/compras/estado',
    async (_, { arg }: { arg: { id: number; estadoPago: EstadoPago } }) => {
      return ComprasService.cambiarEstadoPago(arg.id, arg.estadoPago)
    },
    { onSuccess: () => mutate() }
  )

  return {
    compras,
    isLoading,
    loadError,
    isCreating,
    isUpdating,
    isDeleting,
    isChangingEstado,
    isSubmitting: isCreating || isUpdating || isDeleting,
    createCompra,
    updateCompra,
    deleteCompra,
    cambiarEstadoPago,
    refresh: mutate,
  }
}
