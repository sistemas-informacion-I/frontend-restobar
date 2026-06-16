import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { reservaService } from '../services/reserva.service'
import { CrearReservaRequest, ReservaResponse } from '../models/reserva.model'

export const useSucursalesReserva = () => {
  const { data = [], error, isLoading, mutate } = useSWR(
    '/api/sucursal/reservas-options',
    () => reservaService.getSucursales()
  )

  return {
    sucursales: data.filter((s) => s.activo !== false),
    isLoading,
    error,
    refresh: mutate,
  }
}

export const useDisponibilidadReservas = (
  idSucursal: number | null,
  fechaReserva: string,
  horaInicio: string,
  horaFin?: string
) => {
  const enabled = Boolean(idSucursal && fechaReserva && horaInicio)
  const key = enabled
    ? ['/reservas/disponibilidad', idSucursal, fechaReserva, horaInicio, horaFin]
    : null

  const { data = [], error, isLoading, mutate } = useSWR(
    key,
    () => reservaService.disponibilidad({
      idSucursal: idSucursal!,
      fechaReserva,
      horaInicio,
      horaFin,
    })
  )

  return {
    mesas: data,
    isLoading,
    error,
    refresh: mutate,
  }
}

export const useCrearReserva = () => {
  const { trigger, isMutating } = useSWRMutation(
    '/reservas',
    async (_, { arg }: { arg: CrearReservaRequest }) => reservaService.crear(arg)
  )

  return {
    crearReserva: trigger,
    isCreating: isMutating,
  }
}

export const usePanelReservas = (
  idSucursal: number | null,
  fechaReserva: string,
  estado?: string
) => {
  const enabled = Boolean(idSucursal && fechaReserva)
  const key = enabled ? ['/reservas/panel', idSucursal, fechaReserva, estado] : null

  const { data = [], error, isLoading, mutate } = useSWR<ReservaResponse[]>(
    key,
    () => reservaService.listar({
      idSucursal: idSucursal!,
      fechaReserva,
      estado: estado || undefined,
    })
  )

  const { trigger: confirmar, isMutating: isConfirming } = useSWRMutation(
    '/reservas/confirmar',
    async (_, { arg }: { arg: number }) => reservaService.confirmar(arg),
    { onSuccess: () => mutate() }
  )

  const { trigger: checkIn, isMutating: isCheckingIn } = useSWRMutation(
    '/reservas/check-in',
    async (_, { arg }: { arg: number }) => reservaService.checkIn(arg),
    { onSuccess: () => mutate() }
  )

  const { trigger: cancelar, isMutating: isCancelling } = useSWRMutation(
    '/reservas/cancelar',
    async (_, { arg }: { arg: { idReserva: number; motivo?: string } }) =>
      reservaService.cancelar(arg.idReserva, { motivo: arg.motivo }),
    { onSuccess: () => mutate() }
  )

  const { trigger: noAsistio, isMutating: isMarkingNoShow } = useSWRMutation(
    '/reservas/no-asistio',
    async (_, { arg }: { arg: number }) => reservaService.noAsistio(arg),
    { onSuccess: () => mutate() }
  )

  return {
    reservas: data,
    isLoading,
    error,
    isSubmitting: isConfirming || isCheckingIn || isCancelling || isMarkingNoShow,
    confirmar,
    checkIn,
    cancelar,
    noAsistio,
    refresh: mutate,
  }
}
