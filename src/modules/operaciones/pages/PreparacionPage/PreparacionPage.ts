import { useState, useMemo, useEffect, useRef } from 'react'
import { usePreparacion } from '../../hooks/usePreparacion'
import { useAuth } from '../../../acceso/context/AuthContext'
import { PreparacionPageView } from './PreparacionPage.view'
import { useSucursales } from '../../hooks/useSucursales'
import type { EstacionPreparacion } from '../../services/types'

export function PreparacionPage() {
  const { user, canRead } = useAuth()
  const { sucursales, isLoading: sucursalesLoading } = useSucursales()
  const [estacion, setEstacion] = useState<EstacionPreparacion>('COCINA')
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | undefined>(undefined)
  const initializationDone = useRef(false)

  useEffect(() => {
    if (initializationDone.current) return
    
    if (user && sucursales.length > 0) {
      if (user.tipoUsuario === 'S') {
        // Superuser: default to first sucursal
        setSelectedSucursalId(sucursales[0].idSucursal)
      } else if (user.sucursalId) {
        // Regular employee: use assigned sucursal
        setSelectedSucursalId(user.sucursalId)
      }
      initializationDone.current = true
    }
  }, [user, sucursales])

  const effectiveEstacion = useMemo<EstacionPreparacion>(() => {
    if (user?.roles?.some(r => r.name === 'COCINERO')) return 'COCINA'
    if (user?.roles?.some(r => r.name === 'BARTENDER')) return 'BARRA'
    return estacion
  }, [user, estacion])

  // For superuser: use selected sucursal; for employees: use their assigned sucursal
  const currentSucursalId = user?.tipoUsuario === 'S' ? selectedSucursalId : (user?.sucursalId ?? selectedSucursalId)
  const shouldFetch = currentSucursalId !== undefined

  const {
    queue,
    isLoading,
    isRefreshing,
    isTomando,
    isMarcandoListo,
    error,
    refresh,
    tomarItem,
    marcarListo,
  } = usePreparacion(effectiveEstacion, currentSucursalId, shouldFetch)

  const isCocinero = user?.roles?.some(r => r.name === 'COCINERO') ?? false
  const isBartender = user?.roles?.some(r => r.name === 'BARTENDER') ?? false
  const isSupervisor = user?.tipoUsuario === 'S' || canRead('preparacion')
  const isSuperuser = user?.tipoUsuario === 'S'

  const handleEstacionChange = (newEstacion: EstacionPreparacion) => {
    setEstacion(newEstacion)
  }

  const handleSucursalChange = (idSucursal: number) => {
    setSelectedSucursalId(idSucursal)
  }

  const handleRefresh = async () => {
    await refresh()
  }

  return PreparacionPageView({
    queue,
    isLoading,
    isRefreshing,
    isTomando,
    isMarcandoListo,
    error,
    estacion: effectiveEstacion,
    isCocinero,
    isBartender,
    isSupervisor,
    isSuperuser,
    sucursales,
    selectedSucursalId,
    isSucursalLoading: sucursalesLoading,
    handleSucursalChange,
    handleEstacionChange,
    handleRefresh,
    tomarItem,
    marcarListo,
  })
}

export default PreparacionPage
