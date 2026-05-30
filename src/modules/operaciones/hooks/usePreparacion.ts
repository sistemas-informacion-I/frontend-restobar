import { useState, useEffect, useCallback } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { preparacionService } from '../services/preparacion.service'
import { wsClient } from '../../../core/api/websocket-client'
import { getErrorMessage } from '../../../core/api'
import type { PreparacionQueue, EstacionPreparacion } from '../services/types'
import { toast } from 'sonner'

function playNotificationBeep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    osc.type = 'sine'
    gain.gain.value = 0.3
    osc.start()
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.stop(ctx.currentTime + 0.3)
  } catch {
    // Silently fail if audio not available
  }
}

export const usePreparacion = (
  estacion: EstacionPreparacion,
  idSucursal?: number,
  enabled = true
) => {
  const [queue, setQueue] = useState<PreparacionQueue[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const swrKey = enabled
    ? `/api/preparacion/cola?estacion=${estacion}${idSucursal ? `&idSucursal=${idSucursal}` : ''}`
    : null

  const { data, error, isLoading, mutate } = useSWR<PreparacionQueue[]>(
    swrKey,
    () => preparacionService.getCola(estacion, idSucursal),
    { revalidateOnFocus: false }
  )

  useEffect(() => {
    if (data) setQueue(data)
  }, [data])

  useEffect(() => {
    if (!idSucursal) return

    const topic = `/topic/sucursal/${idSucursal}/preparacion/nuevos-items`
    const subscription = wsClient.subscribe(topic, () => {
      playNotificationBeep()
      mutate()
    })

    return () => subscription.unsubscribe()
  }, [idSucursal, mutate])

  useEffect(() => {
    if (!idSucursal) return

    const events = ['item-tomado', 'item-listo', 'comanda-lista']
    const subscriptions = events.map(event => {
      const topic = `/topic/sucursal/${idSucursal}/preparacion/${event}`
      return wsClient.subscribe(topic, () => mutate())
    })

    return () => subscriptions.forEach(s => s.unsubscribe())
  }, [idSucursal, mutate])

  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await mutate()
    } finally {
      setIsRefreshing(false)
    }
  }, [mutate])

  const changeEstacion = useCallback(async () => {
    setQueue([])
    await mutate()
  }, [mutate])

  const { trigger: triggerTomar, isMutating: isTomando } = useSWRMutation(
    swrKey,
    async (_, { arg }: { arg: number }) => {
      return preparacionService.tomarItem(arg)
    }
  )

  const { trigger: triggerMarcarListo, isMutating: isMarcandoListo } = useSWRMutation(
    swrKey,
    async (_, { arg }: { arg: number }) => {
      return preparacionService.marcarListo(arg)
    }
  )

  const tomarItem = useCallback(async (idDetalleComanda: number) => {
    try {
      await triggerTomar(idDetalleComanda)
      await mutate()
      toast.success('Item en preparación')
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'tomar el item'))
    }
  }, [triggerTomar, mutate])

  const marcarListo = useCallback(async (idDetalleComanda: number) => {
    try {
      const response = await triggerMarcarListo(idDetalleComanda)
      await mutate()
      if (response?.estadoComanda === 'LISTA') {
        toast.success('¡Comanda completa!')
      } else {
        toast.success('Item listo')
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'marcar como listo'))
    }
  }, [triggerMarcarListo, mutate])

  return {
    queue,
    isLoading,
    isRefreshing,
    isTomando,
    isMarcandoListo,
    error,
    refresh,
    changeEstacion,
    tomarItem,
    marcarListo,
  }
}
