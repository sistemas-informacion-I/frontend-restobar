import { RefreshCw, ChefHat, Beer, AlertCircle, Loader2 } from 'lucide-react'
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

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <StationIcon className="w-6 h-6" />
            Preparación de Comandas - {stationName}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {queue.reduce((acc, c) => acc + c.itemsPendientes, 0)} pendientes · {queue.reduce((acc, c) => acc + c.itemsEnPreparacion, 0)} en preparación · {queue.length} comandas
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Station Toggle - only for supervisors */}
          {isSupervisor && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => handleEstacionChange('COCINA')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  estacion === 'COCINA'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5 inline mr-1" />
                Cocina
              </button>
              <button
                onClick={() => handleEstacionChange('BARRA')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  estacion === 'BARRA'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Beer className="w-3.5 h-3.5 inline mr-1" />
                Barra
              </button>
            </div>

            {isSuperuser && (
              <div className="flex items-center gap-2">
                <label className="text-[11px] uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                  Sucursal
                </label>
                {isSucursalLoading ? (
                  <div className="text-xs text-gray-500 dark:text-gray-400">Cargando...</div>
                ) : (
                  <select
                    value={selectedSucursalId ?? ''}
                    onChange={(event) => handleSucursalChange(Number(event.target.value))}
                    className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {sucursales.map((sucursal) => (
                      <option key={sucursal.idSucursal} value={sucursal.idSucursal}>
                        {sucursal.nombre}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>
        )}

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            title="Actualizar"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Error al cargar: {error?.message || 'Error desconocido'}</span>
        </div>
      )}

      {/* Queue Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : queue.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-400 dark:text-gray-500">
          <StationIcon className="w-16 h-16 mb-4 opacity-50" />
          <p className="font-medium text-lg">No hay items pendientes</p>
          <p className="text-sm">La {stationName.toLowerCase()} está al día</p>
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
