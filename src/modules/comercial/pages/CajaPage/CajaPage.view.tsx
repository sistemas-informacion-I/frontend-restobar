import { Wallet, Building2, Filter } from 'lucide-react'
import { Select } from '@/shared/components/ui/Select/Select'
import {
  AbrirCajaRequest,
  CajaResponse,
  CerrarCajaRequest,
  EstadoCaja,
  MovimientoManualRequest,
} from '../../services/caja.service'
import { CajaActualPanel } from './components/CajaActualPanel.view'
import { MovimientosTable } from './components/MovimientosTable.view'
import { HistorialTable } from './components/HistorialTable.view'
import { AbrirCajaModal } from './components/AbrirCajaModal.view'
import { MovimientoModal } from './components/MovimientoModal.view'
import { CerrarCajaModal } from './components/CerrarCajaModal.view'

interface CajaPageViewProps {
  isSuper: boolean
  sucursales: { idSucursal: number; nombre: string }[]
  sucursalesLoading: boolean
  selectedSucursal?: number
  onSelectSucursal: (id: number | undefined) => void
  requiereSeleccionSucursal: boolean
  filtroEstado: EstadoCaja | ''
  onFiltroEstadoChange: (estado: EstadoCaja | '') => void
  cajaActual: CajaResponse | null
  historial: CajaResponse[]
  isLoadingActual: boolean
  isLoadingHistorial: boolean
  loadError: string
  isSubmitting: boolean
  canCreate: boolean
  canUpdate: boolean
  isAbrirOpen: boolean
  setIsAbrirOpen: (open: boolean) => void
  isMovimientoOpen: boolean
  setIsMovimientoOpen: (open: boolean) => void
  isCerrarOpen: boolean
  setIsCerrarOpen: (open: boolean) => void
  onAbrir: (data: AbrirCajaRequest) => Promise<void>
  onMovimiento: (data: MovimientoManualRequest) => Promise<void>
  onCerrar: (data: CerrarCajaRequest) => Promise<void>
}

const ESTADOS = [
  { value: '', label: 'Todos los estados' },
  { value: 'ABIERTA', label: 'Abiertas' },
  { value: 'CERRADA', label: 'Cerradas' },
]

export function CajaPageView({
  isSuper,
  sucursales,
  sucursalesLoading,
  selectedSucursal,
  onSelectSucursal,
  requiereSeleccionSucursal,
  filtroEstado,
  onFiltroEstadoChange,
  cajaActual,
  historial,
  isLoadingActual,
  isLoadingHistorial,
  loadError,
  isSubmitting,
  canCreate,
  canUpdate,
  isAbrirOpen,
  setIsAbrirOpen,
  isMovimientoOpen,
  setIsMovimientoOpen,
  isCerrarOpen,
  setIsCerrarOpen,
  onAbrir,
  onMovimiento,
  onCerrar,
}: CajaPageViewProps) {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Header */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wine-600/10 text-wine-600 dark:bg-wine-500/10 dark:text-wine-400">
              <Wallet size={28} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-4xl">
              Caja
            </h1>
          </div>
          <p className="ml-1 text-sm font-bold uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-300/40">
            Apertura · Movimientos · Arqueo y cierre
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isSuper && (
            <div className="w-full min-w-[220px] sm:w-auto">
              <Select
                value={selectedSucursal !== undefined ? String(selectedSucursal) : ''}
                onChange={(val) => onSelectSucursal(val ? Number(val) : undefined)}
                options={[
                  { value: '', label: sucursalesLoading ? 'Cargando...' : 'Seleccionar sucursal' },
                  ...sucursales.map((s) => ({ value: String(s.idSucursal), label: s.nombre })),
                ]}
                placeholder="Sucursal"
                icon={<Building2 size={18} />}
                className="h-12"
              />
            </div>
          )}
          <div className="w-full min-w-[180px] sm:w-auto">
            <Select
              value={filtroEstado}
              onChange={(val) => onFiltroEstadoChange(val as EstadoCaja | '')}
              options={ESTADOS}
              placeholder="Estado"
              icon={<Filter size={18} />}
              className="h-12"
            />
          </div>
        </div>
      </header>

      {loadError && (
        <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 px-6 py-4 text-xs font-bold uppercase tracking-widest text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400">
          {loadError}
        </div>
      )}

      {/* Panel de caja actual */}
      <CajaActualPanel
        caja={cajaActual}
        isLoading={isLoadingActual}
        canCreate={canCreate}
        canUpdate={canUpdate}
        requiereSeleccionSucursal={requiereSeleccionSucursal}
        onAbrir={() => setIsAbrirOpen(true)}
        onMovimiento={() => setIsMovimientoOpen(true)}
        onCerrar={() => setIsCerrarOpen(true)}
      />

      {/* Movimientos de la caja actual */}
      {cajaActual && (
        <section className="flex flex-col gap-4">
          <h2 className="px-1 text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">
            Movimientos de la sesión
          </h2>
          <MovimientosTable movimientos={cajaActual.movimientos ?? []} />
        </section>
      )}

      {/* Historial */}
      <HistorialTable cajas={historial} isLoading={isLoadingHistorial} />

      {/* Modales */}
      <AbrirCajaModal
        isOpen={isAbrirOpen}
        onClose={() => setIsAbrirOpen(false)}
        onSubmit={onAbrir}
        isLoading={isSubmitting}
      />
      <MovimientoModal
        isOpen={isMovimientoOpen}
        onClose={() => setIsMovimientoOpen(false)}
        onSubmit={onMovimiento}
        isLoading={isSubmitting}
      />
      <CerrarCajaModal
        isOpen={isCerrarOpen}
        onClose={() => setIsCerrarOpen(false)}
        caja={cajaActual}
        onSubmit={onCerrar}
        isLoading={isSubmitting}
      />
    </div>
  )
}
