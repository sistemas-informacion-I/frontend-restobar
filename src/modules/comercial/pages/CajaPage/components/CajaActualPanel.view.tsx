import { ArrowDownLeft, ArrowUpRight, Lock, PlusCircle, Wallet, Clock, TrendingUp } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { CajaResponse } from '../../../services/caja.service'

interface CajaActualPanelProps {
  caja: CajaResponse | null
  isLoading: boolean
  canCreate: boolean
  canUpdate: boolean
  requiereSeleccionSucursal: boolean
  onAbrir: () => void
  onMovimiento: () => void
  onCerrar: () => void
}

const bs = (n?: number) => `Bs ${(n ?? 0).toFixed(2)}`

function formatFecha(fecha?: string) {
  if (!fecha) return '—'
  const d = new Date(fecha)
  if (Number.isNaN(d.getTime())) return fecha
  return d.toLocaleString('es-BO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function CajaActualPanel({
  caja,
  isLoading,
  canCreate,
  canUpdate,
  requiereSeleccionSucursal,
  onAbrir,
  onMovimiento,
  onCerrar,
}: CajaActualPanelProps) {
  if (requiereSeleccionSucursal) {
    return (
      <EmptyPanel
        icon={<Wallet size={44} className="text-wine-900/20 dark:text-wine-300/20" />}
        title="Seleccione una sucursal"
        subtitle="Elija la sucursal para gestionar su caja"
      />
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/10 py-20 dark:border-wine-900/20 dark:bg-black/10">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
      </div>
    )
  }

  // Sin caja abierta → CTA para abrir
  if (!caja) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 rounded-[2.5rem] border-2 border-dashed border-wine-200/60 bg-wine-50/20 py-16 dark:border-wine-900/30 dark:bg-black/10">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-wine-600/10 text-wine-600 dark:bg-wine-500/10 dark:text-wine-400">
          <Wallet size={42} />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-black tracking-tight text-slate-800 dark:text-white">
            No hay una caja abierta
          </h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-300/40">
            Abra la caja para comenzar a registrar movimientos
          </p>
        </div>
        {canCreate && (
          <Button variant="success" size="lg" onClick={onAbrir} icon={<PlusCircle size={18} />}>
            Abrir Caja
          </Button>
        )}
      </div>
    )
  }

  // Caja abierta → KPIs + acciones
  return (
    <div className="overflow-hidden rounded-[2.5rem] border border-wine-100/60 bg-gradient-to-br from-white/80 to-wine-50/30 shadow-lg shadow-wine-900/5 dark:border-wine-900/20 dark:from-black/40 dark:to-wine-900/10">
      <div className="flex flex-col gap-6 p-6 sm:p-8">
        {/* Cabecera */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Wallet size={30} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Caja #{caja.idCaja}
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Abierta
                </span>
              </div>
              <p className="mt-0.5 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-300/40">
                {caja.nombreSucursal}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {canUpdate && (
              <Button variant="secondary" onClick={onMovimiento} icon={<PlusCircle size={16} />}>
                Movimiento
              </Button>
            )}
            {canUpdate && (
              <Button variant="danger" onClick={onCerrar} icon={<Lock size={16} />}>
                Cerrar / Arqueo
              </Button>
            )}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard
            icon={<Wallet size={18} />}
            label="Monto inicial"
            value={bs(caja.montoInicial)}
            tone="neutral"
          />
          <KpiCard
            icon={<ArrowUpRight size={18} />}
            label="Ingresos"
            value={bs(caja.totalIngresos)}
            tone="positive"
          />
          <KpiCard
            icon={<ArrowDownLeft size={18} />}
            label="Egresos"
            value={bs(caja.totalEgresos)}
            tone="negative"
          />
          <KpiCard
            icon={<TrendingUp size={18} />}
            label="Saldo esperado"
            value={bs(caja.saldoEsperado)}
            tone="highlight"
          />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-wine-100/60 pt-4 text-[11px] font-bold text-wine-900/40 dark:border-wine-900/20 dark:text-wine-300/40">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} /> Apertura: {formatFecha(caja.fechaApertura)}
          </span>
          {caja.empleadoApertura && (
            <span className="uppercase tracking-widest">Por: {caja.empleadoApertura}</span>
          )}
          <span className="uppercase tracking-widest">{caja.cantidadMovimientos} movimientos</span>
        </div>
      </div>
    </div>
  )
}

function KpiCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  tone: 'neutral' | 'positive' | 'negative' | 'highlight'
}) {
  const tones: Record<typeof tone, string> = {
    neutral: 'text-slate-700 dark:text-slate-200',
    positive: 'text-emerald-600 dark:text-emerald-400',
    negative: 'text-rose-600 dark:text-rose-400',
    highlight: 'text-wine-700 dark:text-wine-300',
  }
  return (
    <div className="rounded-2xl border border-wine-100/50 bg-white/70 p-4 dark:border-wine-900/20 dark:bg-black/20">
      <div className="flex items-center gap-2 text-wine-900/40 dark:text-wine-300/40">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className={`mt-2 text-lg font-black ${tones[tone]}`}>{value}</p>
    </div>
  )
}

function EmptyPanel({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/10 py-16 dark:border-wine-900/20 dark:bg-black/10">
      {icon}
      <h3 className="text-base font-black tracking-tight text-slate-700 dark:text-slate-200">{title}</h3>
      <p className="text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-300/40">
        {subtitle}
      </p>
    </div>
  )
}
