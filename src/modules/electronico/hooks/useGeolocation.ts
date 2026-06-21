import { useState, useEffect, useCallback, useRef } from 'react'
import { entregaService } from '../services/entrega.service'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  permission: 'pending' | 'granted' | 'denied' | 'unavailable'
  error: string | null
  isManual: boolean
}

const STORAGE_KEY = 'restobar_manual_gps'

export function useGeolocation(reportIntervalMs = 10000) {
  const [state, setState] = useState<GeolocationState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
          return {
            latitude: parsed.lat,
            longitude: parsed.lng,
            permission: 'granted',
            error: null,
            isManual: true,
          }
        }
      }
    } catch {}
    return {
      latitude: null,
      longitude: null,
      permission: 'pending',
      error: null,
      isManual: false,
    }
  })
  
  const watchIdRef = useRef<number | null>(null)
  const lastReportRef = useRef<number>(0)
  const isManualRef = useRef(state.isManual)
  
  // Sync the ref with state just in case
  useEffect(() => {
    isManualRef.current = state.isManual
  }, [state.isManual])

  const reportPosition = useCallback(
    async (lat: number, lng: number) => {
      const now = Date.now()
      if (now - lastReportRef.current < reportIntervalMs) return
      lastReportRef.current = now
      try {
        await entregaService.reportarUbicacion(lat, lng)
      } catch {
        // silent
      }
    },
    [reportIntervalMs],
  )

  const reportNow = useCallback(
    async (lat: number, lng: number) => {
      lastReportRef.current = 0
      try {
        await entregaService.reportarUbicacion(lat, lng)
        lastReportRef.current = Date.now()
      } catch {
        // silent
      }
    },
    [],
  )

  const setManualPosition = useCallback(
    (lat: number, lng: number) => {
      isManualRef.current = true
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ lat, lng }))
      } catch {}
      setState((s) => ({ ...s, latitude: lat, longitude: lng, permission: 'granted', isManual: true, error: null }))
    },
    [],
  )

  // Manejo del intervalo para reportar ubicacion manual periodicamente
  useEffect(() => {
    if (state.isManual && state.latitude != null && state.longitude != null) {
      const lat = state.latitude
      const lng = state.longitude
      
      // Reportar de inmediato al iniciar el hook o cambiar la ubicacion
      reportNow(lat, lng)
      
      const intervalId = setInterval(() => {
        entregaService.reportarUbicacion(lat, lng).catch(() => {})
      }, reportIntervalMs)
      
      return () => {
        clearInterval(intervalId)
      }
    }
  }, [state.isManual, state.latitude, state.longitude, reportNow, reportIntervalMs])

  // Manejo de la geolocalizacion nativa
  useEffect(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, permission: 'unavailable', error: 'Geolocalización no soportada' }))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setState((s) => {
          if (s.isManual) return s
          return { latitude, longitude, permission: 'granted', error: null, isManual: false }
        })
        if (!isManualRef.current) {
          reportPosition(latitude, longitude)
        }
      },
      (err) => {
        const permission = err.code === err.PERMISSION_DENIED ? 'denied' : 'pending'
        setState((s) => ({ ...s, permission, error: err.message }))
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        if (isManualRef.current) return
        const { latitude, longitude } = pos.coords
        setState((s) => {
          if (s.isManual) return s
          return { ...s, latitude, longitude, permission: 'granted', error: null }
        })
        reportPosition(latitude, longitude)
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000 },
    )

    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [reportPosition])

  return { ...state, setManualPosition }
}
