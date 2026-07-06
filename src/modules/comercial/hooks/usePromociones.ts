import { useState } from 'react'
import useSWR from 'swr'
import type { Promocion, PromocionDashboard, PromocionRequest } from '../models/Promocion'
import { promocionService } from '../services/promocionService'

interface PromocionesFilters {
  nombre?: string
  idSucursal?: number
  estado?: string
  tipo?: string
  fechaInicio?: string
  fechaFin?: string
}

export const usePromociones = (filters?: PromocionesFilters) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { data: promociones = [], mutate, isLoading, error: swrPromocionesError } = useSWR<Promocion[]>(
    ['/api/promociones', filters],
    () => promocionService.getAll(filters),
    { revalidateOnFocus: false }
  )

  const { data: dashboard, mutate: mutateDashboard, error: swrDashboardError } = useSWR<PromocionDashboard>(
    '/api/promociones/dashboard',
    () => promocionService.getDashboard(),
    { revalidateOnFocus: false }
  )

  const fetchError = (swrPromocionesError as any)?.message || (swrDashboardError as any)?.message || null

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const listar = async (nextFilters?: PromocionesFilters) => {
    setLoading(true)
    clearMessages()
    try {
      const data = await promocionService.getAll(nextFilters)
      mutate(data, false)
      return data
    } catch (err: any) {
      const message = err?.message || 'No se pudieron cargar las promociones'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const crear = async (data: PromocionRequest) => {
    setLoading(true)
    clearMessages()
    try {
      const created = await promocionService.create(data)
      mutate([created, ...promociones], false)
      mutateDashboard()
      setSuccess('Promoción creada correctamente')
      return created
    } catch (err: any) {
      const message = err?.message || 'No se pudo crear la promoción'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const editar = async (id: number, data: PromocionRequest) => {
    setLoading(true)
    clearMessages()
    try {
      const updated = await promocionService.update(id, data)
      mutate(promociones.map((promo) => (promo.id === id ? updated : promo)), false)
      mutateDashboard()
      setSuccess('Promoción actualizada correctamente')
      return updated
    } catch (err: any) {
      const message = err?.message || 'No se pudo actualizar la promoción'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const eliminar = async (id: number) => {
    setLoading(true)
    clearMessages()
    try {
      const deleted = await promocionService.delete(id)
      mutate(promociones.filter((promo) => promo.id !== id), false)
      mutateDashboard()
      setSuccess('Promoción eliminada correctamente')
      return deleted
    } catch (err: any) {
      const message = err?.message || 'No se pudo eliminar la promoción'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const activar = async (id: number) => {
    setLoading(true)
    clearMessages()
    try {
      const activated = await promocionService.activate(id)
      mutate(promociones.map((promo) => (promo.id === id ? activated : promo)), false)
      mutateDashboard()
      setSuccess('Promoción activada correctamente')
      return activated
    } catch (err: any) {
      const message = err?.message || 'No se pudo activar la promoción'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const desactivar = async (id: number) => {
    setLoading(true)
    clearMessages()
    try {
      const deactivated = await promocionService.deactivate(id)
      mutate(promociones.map((promo) => (promo.id === id ? deactivated : promo)), false)
      mutateDashboard()
      setSuccess('Promoción desactivada correctamente')
      return deactivated
    } catch (err: any) {
      const message = err?.message || 'No se pudo desactivar la promoción'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const buscarPorId = async (id: number) => {
    setLoading(true)
    clearMessages()
    try {
      return await promocionService.getById(id)
    } catch (err: any) {
      const message = err?.message || 'No se pudo cargar la promoción'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    promociones,
    dashboard,
    loading: loading || isLoading,
    error: error ?? fetchError,
    success,
    listar,
    crear,
    editar,
    eliminar,
    activar,
    desactivar,
    buscarPorId,
    refresh: mutate,
  }
}
