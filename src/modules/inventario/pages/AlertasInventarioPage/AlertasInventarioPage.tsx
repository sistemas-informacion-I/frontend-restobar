import { useRef, useState, useEffect } from 'react'
import { useAlertas, useAlertasPendientesCount } from '../../hooks/useAlertas'
import { AlertasInventarioPageView } from './AlertasInventarioPage.view'
import { alertaInventarioService } from '../../services/alertaInventario.service'
import { getErrorMessage } from '@/core/api'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { sucursalService } from '@/modules/operaciones/services/sucursal.service'

const FEEDBACK_TIMEOUT_MS = 4000

export function AlertasInventarioPage() {
  const { user } = useAuth()
  const [sucursales, setSucursales] = useState<any[]>([])
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | undefined>(undefined)

  useEffect(() => {
    const load = async () => {
      try {
        const s = await sucursalService.getAll()
        setSucursales(s)
        if (!selectedSucursalId) {
          if (user?.sucursalId) setSelectedSucursalId(user.sucursalId)
          else if (s?.length > 0) setSelectedSucursalId(s[0].idSucursal)
        }
      } catch (e) {
        // ignore
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const { alertas, isLoading: loadingAlertas, mutate: mutateAlertas } = useAlertas(selectedSucursalId)
  const { pendingCount, isLoading: loadingAlertasCount, mutate: mutateAlertasCount } = useAlertasPendientesCount(selectedSucursalId)

  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showFeedback = (message: string, type: 'success' | 'error') => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    setFeedbackMessage(message)
    setFeedbackType(type)
    feedbackTimer.current = setTimeout(() => {
      setFeedbackMessage('')
      setFeedbackType('')
    }, FEEDBACK_TIMEOUT_MS)
  }

  const clearFeedback = () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    setFeedbackMessage('')
    setFeedbackType('')
  }

  const handleMarcarAlertaComoLeida = async (idAlerta: number) => {
    try {
      await alertaInventarioService.marcarAlertaComoLeida(idAlerta)
      showFeedback('Alerta marcada como leída', 'success')
      mutateAlertas((current) => {
        const next = (current ?? []).filter((alerta) => alerta.idAlerta !== idAlerta)
        return next
      }, false)
      mutateAlertasCount((current) => Math.max(0, (current ?? 0) - 1), false)
      await Promise.all([mutateAlertas(), mutateAlertasCount()])
      return { success: true }
    } catch (error) {
      const message = getErrorMessage(error, 'marcar la alerta como leída')
      showFeedback(message, 'error')
      return { success: false, error: message }
    }
  }

  useEffect(() => {
    if (selectedSucursalId) {
      mutateAlertas()
      mutateAlertasCount()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSucursalId])

  return AlertasInventarioPageView({
    alertas,
    loading: loadingAlertas || loadingAlertasCount,
    pendingCount,
    feedbackMessage,
    feedbackType,
    clearFeedback,
    handleMarcarAlertaComoLeida,
    sucursales,
    selectedSucursalId,
    setSelectedSucursalId,
    user,
  })
}

export default AlertasInventarioPage
