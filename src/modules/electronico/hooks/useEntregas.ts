import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { entregaService } from '../services/entrega.service'
import type {
  EntregaResponse,
  NuevaEntregaNotificacion,
} from '../models/entrega.model'
import { wsClient } from '@/core/api/websocket-client'
import { useEffect } from 'react'

export function useEntregasPendientes() {
  const {
    data: entregas = [],
    error: loadError,
    isLoading,
    mutate,
  } = useSWR<EntregaResponse[]>('/api/entregas/pendientes', () => entregaService.getPendientes())

  useEffect(() => {
    const sub = wsClient.subscribe<NuevaEntregaNotificacion>(
      '/topic/repartidores/nueva-entrega',
      () => { mutate() }
    )
    const subTomada = wsClient.subscribe<{ idEntrega: number }>(
      '/topic/repartidores/entrega-tomada',
      () => { mutate() }
    )
    return () => {
      sub.unsubscribe()
      subTomada.unsubscribe()
    }
  }, [mutate])

  return {
    entregas,
    isLoading,
    loadError,
    refresh: mutate,
  }
}

export function useEntregaDetalle(idEntrega: number | undefined) {
  const key = idEntrega != null ? `/api/entregas/${idEntrega}` : null

  const {
    data: entrega,
    error: loadError,
    isLoading,
    mutate,
  } = useSWR<EntregaResponse>(key, key ? () => entregaService.getById(idEntrega!) : null)

  return {
    entrega,
    isLoading,
    loadError,
    refresh: mutate,
  }
}

export function useMisEntregas() {
  const {
    data: entregas = [],
    error: loadError,
    isLoading,
    mutate,
  } = useSWR<EntregaResponse[]>('/api/entregas/mis-entregas', () => entregaService.getMisEntregas())

  useEffect(() => {
    const sub = wsClient.subscribe<any>(
      '/topic/repartidores/nueva-entrega',
      () => { mutate() }
    )
    const subTomada = wsClient.subscribe<any>(
      '/topic/repartidores/entrega-tomada',
      () => { mutate() }
    )
    return () => {
      sub.unsubscribe()
      subTomada.unsubscribe()
    }
  }, [mutate])

  return {
    entregas,
    isLoading,
    loadError,
    refresh: mutate,
  }
}

export function useAceptarEntrega() {
  const { trigger, isMutating } = useSWRMutation(
    '/api/entregas/aceptar',
    async (_: string, { arg }: { arg: { idEntrega: number; latitud?: number; longitud?: number } }) => {
      return entregaService.aceptar(arg.idEntrega, arg.latitud, arg.longitud)
    }
  )

  return {
    aceptarEntrega: trigger,
    isAceptando: isMutating,
  }
}

export function useIniciarViaje() {
  const { trigger, isMutating } = useSWRMutation(
    '/api/entregas/iniciar',
    async (_: string, { arg }: { arg: { idEntrega: number } }) => {
      return entregaService.iniciarViaje(arg.idEntrega)
    }
  )

  return {
    iniciarViaje: trigger,
    isIniciando: isMutating,
  }
}

export function useMarcarEntregado() {
  const { trigger, isMutating } = useSWRMutation(
    '/api/entregas/entregado',
    async (_: string, { arg }: { arg: { idEntrega: number } }) => {
      return entregaService.marcarEntregado(arg.idEntrega)
    }
  )

  return {
    marcarEntregado: trigger,
    isMarcando: isMutating,
  }
}

export function useSeguimientoEntrega(idEntrega: number | undefined) {
  const key = idEntrega != null ? `/api/entregas/${idEntrega}` : null

  const {
    data: entrega,
    error: loadError,
    isLoading,
    mutate,
  } = useSWR<EntregaResponse>(key, key ? () => entregaService.getById(idEntrega!) : null)

  useEffect(() => {
    if (idEntrega == null) return

    const sub = wsClient.subscribe<{ idEntrega: number; latitud: number; longitud: number; timestamp: string }>(
      `/topic/entrega/${idEntrega}/ubicacion`,
      (msg) => {
        mutate((prev) => {
          if (!prev) return prev
          return { ...prev, latitudActual: msg.latitud, longitudActual: msg.longitud }
        }, { revalidate: false })
      }
    )

    // STOMP SimpleBroker does NOT support wildcards (+/#).
    // Subscribe explicitly to each state-change topic the backend emits.
    const estadoTopics = ['asignada', 'en-camino', 'entregado', 'cancelada']
    const estadoSubs = estadoTopics.map((subTopic) =>
      wsClient.subscribe<any>(
        `/topic/entrega/${idEntrega}/${subTopic}`,
        () => { mutate() }
      )
    )

    return () => {
      sub.unsubscribe()
      estadoSubs.forEach((s) => s.unsubscribe())
    }
  }, [idEntrega, mutate])

  return {
    entrega,
    isLoading,
    loadError,
    refresh: mutate,
  }
}
