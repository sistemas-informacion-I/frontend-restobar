import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { useSucursales } from '@/modules/operaciones/hooks/useSucursales'
import { getErrorMessage } from '@/core/api'
import { useCaja } from '../../hooks/useCaja'
import {
  AbrirCajaRequest,
  CerrarCajaRequest,
  EstadoCaja,
  MovimientoManualRequest,
} from '../../services/caja.service'
import { CajaPageView } from './CajaPage.view'

export default function CajaPage() {
  const { user, hasPermission } = useAuth()
  const isSuper = user?.tipoUsuario === 'S'

  const { sucursales, isLoading: sucursalesLoading } = useSucursales()

  // Para SU se elige sucursal; los empleados operan su sucursal asignada.
  const [selectedSucursal, setSelectedSucursal] = useState<number | undefined>(undefined)
  const [filtroEstado, setFiltroEstado] = useState<EstadoCaja | ''>('')

  const idSucursal = isSuper ? selectedSucursal : undefined

  const {
    cajaActual,
    historial,
    isLoadingActual,
    isLoadingHistorial,
    loadError,
    isSubmitting,
    abrirCaja,
    registrarMovimiento,
    cerrarCaja,
  } = useCaja({
    idSucursal,
    isSuper,
    estado: filtroEstado || undefined,
  })

  const canCreate = hasPermission('caja:create')
  const canUpdate = hasPermission('caja:update')

  const [isAbrirOpen, setIsAbrirOpen] = useState(false)
  const [isMovimientoOpen, setIsMovimientoOpen] = useState(false)
  const [isCerrarOpen, setIsCerrarOpen] = useState(false)

  const sucursalesOptions = useMemo(
    () => sucursales.map((s: any) => ({ idSucursal: s.idSucursal as number, nombre: s.nombre as string })),
    [sucursales]
  )

  // SU debe elegir sucursal antes de poder operar.
  const requiereSeleccionSucursal = isSuper && selectedSucursal === undefined

  const handleAbrir = async (data: AbrirCajaRequest) => {
    try {
      await abrirCaja({
        ...data,
        idSucursal: isSuper ? selectedSucursal : undefined,
      })
      toast.success('Caja abierta correctamente')
      setIsAbrirOpen(false)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Abrir caja'))
    }
  }

  const handleMovimiento = async (data: MovimientoManualRequest) => {
    if (!cajaActual) return
    try {
      await registrarMovimiento({ id: cajaActual.idCaja, data })
      toast.success(
        data.concepto === 'INGRESO_EXTRA' ? 'Ingreso registrado' : 'Retiro registrado'
      )
      setIsMovimientoOpen(false)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Registrar movimiento'))
    }
  }

  const handleCerrar = async (data: CerrarCajaRequest) => {
    if (!cajaActual) return
    try {
      const cerrada = await cerrarCaja({ id: cajaActual.idCaja, data })
      const diff = cerrada?.diferencia ?? 0
      if (diff === 0) {
        toast.success('Caja cerrada sin diferencias')
      } else if (diff > 0) {
        toast.success(`Caja cerrada. Sobrante de Bs ${Math.abs(diff).toFixed(2)}`)
      } else {
        toast.warning(`Caja cerrada. Faltante de Bs ${Math.abs(diff).toFixed(2)}`)
      }
      setIsCerrarOpen(false)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Cerrar caja'))
    }
  }

  return (
    <CajaPageView
      isSuper={isSuper}
      sucursales={sucursalesOptions}
      sucursalesLoading={sucursalesLoading}
      selectedSucursal={selectedSucursal}
      onSelectSucursal={setSelectedSucursal}
      requiereSeleccionSucursal={requiereSeleccionSucursal}
      filtroEstado={filtroEstado}
      onFiltroEstadoChange={setFiltroEstado}
      cajaActual={cajaActual}
      historial={historial}
      isLoadingActual={isLoadingActual}
      isLoadingHistorial={isLoadingHistorial}
      loadError={loadError ? getErrorMessage(loadError) : ''}
      isSubmitting={isSubmitting}
      canCreate={canCreate}
      canUpdate={canUpdate}
      isAbrirOpen={isAbrirOpen}
      setIsAbrirOpen={setIsAbrirOpen}
      isMovimientoOpen={isMovimientoOpen}
      setIsMovimientoOpen={setIsMovimientoOpen}
      isCerrarOpen={isCerrarOpen}
      setIsCerrarOpen={setIsCerrarOpen}
      onAbrir={handleAbrir}
      onMovimiento={handleMovimiento}
      onCerrar={handleCerrar}
    />
  )
}
