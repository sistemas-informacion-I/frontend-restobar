import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import {
  CajaService,
  CajaResponse,
  EstadoCaja,
  AbrirCajaRequest,
  MovimientoManualRequest,
  CerrarCajaRequest,
} from '../services/caja.service'
import { ApiError } from '@/core/api/http-client'

function isNotFound(error: unknown): boolean {
  return (error as ApiError)?.status === 404
}

interface UseCajaOptions {
  /** Sucursal a consultar. Requerido para Superusuario; los empleados usan la suya. */
  idSucursal?: number
  /** True si el usuario es Superusuario (necesita seleccionar sucursal explícitamente). */
  isSuper?: boolean
  /** Filtro de estado para el historial. */
  estado?: EstadoCaja
}

/**
 * Hook del CU22. Gestiona la caja ABIERTA actual de la sucursal y el historial.
 */
export const useCaja = ({ idSucursal, isSuper, estado }: UseCajaOptions = {}) => {
  // Para SU sin sucursal seleccionada no consultamos (el backend exige sucursal).
  const canFetch = !isSuper || idSucursal !== undefined

  const actualKey = canFetch
    ? `/api/cajas/actual${idSucursal !== undefined ? `?idSucursal=${idSucursal}` : ''}`
    : null

  const {
    data: cajaActual = null,
    error: actualError,
    isLoading: isLoadingActual,
    mutate: mutateActual,
  } = useSWR<CajaResponse | null>(actualKey, async () => {
    try {
      return await CajaService.getActual(idSucursal)
    } catch (error) {
      if (isNotFound(error)) return null // No hay caja abierta
      throw error
    }
  })

  // Historial de cajas
  const histParams = new URLSearchParams()
  if (idSucursal !== undefined) histParams.append('idSucursal', String(idSucursal))
  if (estado) histParams.append('estado', estado)
  const histKey = canFetch
    ? histParams.toString()
      ? `/api/cajas?${histParams.toString()}`
      : '/api/cajas'
    : null

  const {
    data: historial = [],
    error: historialError,
    isLoading: isLoadingHistorial,
    mutate: mutateHistorial,
  } = useSWR<CajaResponse[]>(histKey, () =>
    CajaService.getHistorial({ idSucursal, estado })
  )

  const refreshAll = () => {
    mutateActual()
    mutateHistorial()
  }

  const { trigger: abrirCaja, isMutating: isOpening } = useSWRMutation(
    '/api/cajas/abrir',
    async (_, { arg }: { arg: AbrirCajaRequest }) => CajaService.abrir(arg),
    { onSuccess: refreshAll }
  )

  const { trigger: registrarMovimiento, isMutating: isRegistering } = useSWRMutation(
    '/api/cajas/movimiento',
    async (_, { arg }: { arg: { id: number; data: MovimientoManualRequest } }) =>
      CajaService.registrarMovimiento(arg.id, arg.data),
    { onSuccess: refreshAll }
  )

  const { trigger: cerrarCaja, isMutating: isClosing } = useSWRMutation(
    '/api/cajas/cerrar',
    async (_, { arg }: { arg: { id: number; data: CerrarCajaRequest } }) =>
      CajaService.cerrar(arg.id, arg.data),
    { onSuccess: refreshAll }
  )

  return {
    cajaActual,
    historial,
    isLoadingActual,
    isLoadingHistorial,
    loadError: actualError && !isNotFound(actualError) ? actualError : historialError,
    isOpening,
    isRegistering,
    isClosing,
    isSubmitting: isOpening || isRegistering || isClosing,
    abrirCaja,
    registrarMovimiento,
    cerrarCaja,
    refresh: refreshAll,
  }
}
