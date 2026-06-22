import useSWR, { mutate } from 'swr'
import { alertaInventarioService } from '../services/alertaInventario.service'

export const ALERTAS_KEYS = {
  alertas: (idSucursal?: number) => `/api/inventario/alertas?estado=NO_LEIDA${idSucursal ? `&idSucursal=${idSucursal}` : ''}`,
  alertasPendientesCount: (idSucursal?: number) =>
    `/api/inventario/alertas/pendientes/count${idSucursal ? `?idSucursal=${idSucursal}` : ''}`,
}

export function useAlertas(idSucursal?: number) {
  const { data: alertas, error, mutate, isLoading } = useSWR(
    ALERTAS_KEYS.alertas(idSucursal),
    () => alertaInventarioService.listarAlertas({ idSucursal, estado: 'NO_LEIDA' })
  )

  return {
    alertas: alertas ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}

export function useAlertasPendientesCount(idSucursal?: number) {
  const { data: count, error, mutate, isLoading } = useSWR(
    ALERTAS_KEYS.alertasPendientesCount(idSucursal),
    () => alertaInventarioService.contarAlertasPendientes(idSucursal)
  )

  return {
    pendingCount: count ?? 0,
    isLoading,
    isError: !!error,
    mutate,
  }
}
