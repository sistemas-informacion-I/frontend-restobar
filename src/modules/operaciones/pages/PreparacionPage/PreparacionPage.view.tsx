import { RefreshCw, ChefHat, Beer, AlertCircle, Loader2, Store } from 'lucide-react'
import { Select } from '@/shared/components/ui/Select/Select'
import { PreparacionQueueCard } from '../../components/preparacion/PreparacionQueueCard'
import type { PreparacionQueue, EstacionPreparacion, Sucursal } from '../../services/types'

interface PreparacionPageViewProps {
  queue: PreparacionQueue[]
  isLoading: boolean
  isRefreshing: boolean
  isTomando: boolean
  isMarcandoListo: boolean
  error: any
  estacion: EstacionPreparacion
  isCocinero: boolean
  isBartender: boolean
  isSupervisor: boolean
  isSuperuser: boolean
  sucursales: Sucursal[]
  selectedSucursalId?: number
  isSucursalLoading: boolean
  handleSucursalChange: (idSucursal: number) => void
  handleEstacionChange: (estacion: EstacionPreparacion) => void
  handleRefresh: () => void
  tomarItem: (idDetalleComanda: number) => void
  marcarListo: (idDetalleComanda: number) => void
}

export function PreparacionPageView({
  queue,
  isLoading,
  isRefreshing,
  isTomando,
  isMarcandoListo,
  error,
  estacion,
  isCocinero,
  isBartender,
  isSupervisor,
  isSuperuser,
  sucursales,
  selectedSucursalId,
  isSucursalLoading,
  handleSucursalChange,
  handleEstacionChange,
  handleRefresh,
  tomarItem,
  marcarListo,
}: PreparacionPageViewProps) {
  if (!isCocinero && !isBartender && !isSupervisor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 dark:text-gray-400">
        <AlertCircle className="w-12 h-12 mb-3" />
        <p className="font-medium">Acceso denegado</p>
        <p className="text-sm">No tienes permisos para acceder a la pantalla de preparación</p>
      </div>
    )
  }

  const stationName = estacion === 'COCINA' ? 'Cocina' : 'Barra'
  const StationIcon = estacion === 'COCINA' ? ChefHat : Beer
  const totalPendientes = queue.reduce((acc, c) => acc + c.itemsPendientes, 0)
  const totalEnPrep = queue.reduce((acc, c) => acc + c.itemsEnPreparacion, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6 animate-in fade-in slide-in-from-bottom-1">
      {/* Header */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wine-600/10 text-wine-600 dark:bg-wine-500/10 dark:text-wine-400">
              <StationIcon size={28} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-4xl">
              Preparación · {stationName}
            </h1>
          </div>
          <p className="ml-1 text-sm font-bold uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-300/40">
            {totalPendientes} pendientes · {totalEnPrep} en preparación · {queue.length} comandas
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          {/* Station Toggle - only for supervisors */}
          {isSupervisor && (
            <div className="flex overflow-hidden rounded-2xl border border-wine-100/50 dark:border-wine-900/20">
              <button
                onClick={() => handleEstacionChange('COCINA')}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                  estacion === 'COCINA'
                    ? 'bg-wine-600 text-white shadow-lg shadow-wine-900/20'
                    : 'bg-white/50 text-wine-900/50 hover:bg-wine-50 dark:bg-black/20 dark:text-wine-300/50 dark:hover:bg-wine-900/20'
                }`}
              >
                <ChefHat className="h-3.5 w-3.5" /> Cocina
              </button>
              <button
                onClick={() => handleEstacionChange('BARRA')}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                  estacion === 'BARRA'
                    ? 'bg-wine-600 text-white shadow-lg shadow-wine-900/20'
                    : 'bg-white/50 text-wine-900/50 hover:bg-wine-50 dark:bg-black/20 dark:text-wine-300/50 dark:hover:bg-wine-900/20'
                }`}
              >
                <Beer className="h-3.5 w-3.5" /> Barra
              </button>
            </div>
          )}

          {isSupervisor && isSuperuser && (
            isSucursalLoading ? (
              <div className="text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-300/40">Cargando...</div>
            ) : (
              <div className="w-full sm:w-56">
                <Select
                  value={selectedSucursalId}
                  onChange={(val) => handleSucursalChange(Number(val))}
                  options={sucursales.map((s) => ({ value: s.idSucursal, label: s.nombre }))}
                  placeholder="Sucursal"
                  icon={<Store size={18} />}
                />
              </div>
            )
          )}

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-wine-100/50 bg-white/50 text-wine-600 transition-all hover:bg-wine-50 disabled:opacity-50 dark:border-wine-900/20 dark:bg-black/20 dark:text-wine-400 dark:hover:bg-wine-900/20"
            title="Actualizar"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border-2 border-rose-200 bg-rose-50 px-6 py-4 text-xs font-bold uppercase tracking-widest text-rose-700 shadow-lg shadow-rose-900/5 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>Error al cargar: {error?.message || 'Error desconocido'}</span>
        </div>
      )}

      {/* Queue Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/5 dark:border-wine-900/20 dark:bg-black/10">
          <Loader2 className="h-12 w-12 animate-spin text-wine-600 dark:text-wine-500" />
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Cargando cola de preparación...</p>
        </div>
      ) : queue.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center gap-4 rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/5 py-24 text-center dark:border-wine-900/20 dark:bg-black/10">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-wine-500/10 text-wine-600 dark:text-wine-400">
            <StationIcon size={32} />
          </div>
          <div className="max-w-xs">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-wine-950 dark:text-white">No hay ítems pendientes</h3>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">La {stationName.toLowerCase()} está al día</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {queue.map((comanda) => (
            <PreparacionQueueCard
              key={comanda.idComanda}
              comanda={comanda}
              onTomar={tomarItem}
              onMarcarListo={marcarListo}
              isTomando={isTomando}
              isMarcandoListo={isMarcandoListo}
            />
          ))}
        </div>
      )}
    </div>
  )
}
