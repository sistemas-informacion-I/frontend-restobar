import { AlertCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { Link } from 'react-router-dom'
import { AlertaInventario } from '../../services/alertaInventario.service'
import { Select } from '@/shared/components/ui'
import { useAuth } from '@/modules/acceso/context/AuthContext'

interface AlertasInventarioPageViewProps {
  alertas: AlertaInventario[]
  loading: boolean
  pendingCount: number
  feedbackMessage: string
  feedbackType: 'error' | 'success' | ''
  clearFeedback: () => void
  handleMarcarAlertaComoLeida: (idAlerta: number) => Promise<{ success: boolean; error?: string }>
  sucursales?: any[]
  selectedSucursalId?: number
  setSelectedSucursalId?: (id?: number) => void
  user?: any
}

export function AlertasInventarioPageView(props: AlertasInventarioPageViewProps) {
  const {
    alertas,
    loading,
    pendingCount,
    feedbackMessage,
    feedbackType,
    clearFeedback,
    handleMarcarAlertaComoLeida,
    sucursales,
    selectedSucursalId,
    setSelectedSucursalId,
    user,
  } = props

  const auth = useAuth()

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
            Alertas de Inventario
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            Gestiona las alertas pendientes de stock y vencimiento.
          </p>
        </div>

        <div className="inline-flex items-center gap-4">
          {auth.user?.tipoUsuario === 'S' && setSelectedSucursalId && (
            <Select
              value={selectedSucursalId}
              onChange={(val) => setSelectedSucursalId?.(val)}
              options={(sucursales || []).map((s) => ({ value: s.idSucursal, label: s.nombre }))}
              placeholder="Seleccionar Sucursal"
              className="w-full sm:min-w-[240px]"
            />
          )}

          <Link to="/inventario" className="inline-flex">
          <Button variant="secondary" icon={<AlertCircle size={18} />}>
            Volver a Inventario
          </Button>
          </Link>
        </div>
      </div>

      {feedbackMessage && (
        <div className={`flex items-center gap-3 rounded-2xl border-2 px-6 py-4 animate-in slide-in-from-top-4 duration-500 ${
          feedbackType === 'success'
            ? 'border-emerald-100 bg-emerald-50/50 text-emerald-800 dark:border-emerald-900/20 dark:bg-emerald-900/10 dark:text-emerald-400'
            : 'border-rose-100 bg-rose-50/50 text-rose-800 dark:border-rose-900/20 dark:bg-rose-900/10 dark:text-rose-400'
        }`}>
          <AlertCircle size={20} />
          <p className="text-sm font-black uppercase tracking-widest">{feedbackMessage}</p>
          <button onClick={clearFeedback} className="ml-auto text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100">
            Cerrar
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-100 border-t-wine-600 shadow-lg" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-wine-600 animate-pulse">Cargando alertas</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="rounded-[1.75rem] border border-wine-100/30 bg-white/80 p-4 shadow-[0_10px_35px_-18px_rgba(69,10,10,0.2)] dark:border-wine-900/20 dark:bg-black/25">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">Alertas pendientes</p>
                <p className="text-sm text-slate-600 dark:text-slate-200">Hay {pendingCount} alerta{pendingCount === 1 ? '' : 's'} pendientes.</p>
              </div>
              <Badge className="bg-rose-100 text-rose-800">Pendientes</Badge>
            </div>
          </div>

          {alertas.length === 0 ? (
            <div className="rounded-[1.75rem] border border-wine-100/30 bg-white/80 p-8 text-center text-slate-600 shadow-[0_10px_35px_-18px_rgba(69,10,10,0.2)] dark:border-wine-900/20 dark:bg-black/25">
              No hay alertas pendientes en este momento.
            </div>
          ) : (
            <div className="grid gap-3">
              {alertas.map((alerta) => (
                <div key={alerta.idAlerta} className="rounded-[1.75rem] border border-rose-200/60 bg-white/80 p-4 shadow-[0_10px_35px_-18px_rgba(69,10,10,0.2)] dark:bg-black/25">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{alerta.nombreTipo ?? alerta.tipo}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{alerta.nombreSucursal ?? 'Sin sucursal'}</p>
                    </div>
                    <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-900/10 dark:text-rose-400">{alerta.nombreEstado ?? alerta.estado}</Badge>
                  </div>

                  <div className="mt-3 grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                    {alerta.nombreInventario && <p>Insumo: <span className="font-semibold text-slate-900 dark:text-white">{alerta.nombreInventario}</span></p>}
                    {alerta.numeroLote && <p>Lote: <span className="font-semibold text-slate-900 dark:text-white">{alerta.numeroLote}</span></p>}
                    {alerta.fechaVencimiento && <p>Vencimiento: <span className="font-semibold text-slate-900 dark:text-white">{alerta.fechaVencimiento}</span></p>}
                    {alerta.cantidadActual && <p>Cantidad actual: <span className="font-semibold text-slate-900 dark:text-white">{alerta.cantidadActual}</span></p>}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleMarcarAlertaComoLeida(alerta.idAlerta)}
                    >
                      Marcar como leída
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
