import type { PromocionDashboard } from '../models/Promocion'

interface PromocionesStatsCardsProps {
  stats?: PromocionDashboard
}

const cardClass =
  'rounded-2xl border border-wine-100/50 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-wine-900/20 dark:bg-black/20'

export function PromocionesStatsCards({ stats }: PromocionesStatsCardsProps) {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article className={cardClass}>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Promociones activas</p>
        <p className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{stats?.cantidadPromocionesActivas ?? 0}</p>
      </article>

      <article className={cardClass}>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Promociones programadas</p>
        <p className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{stats?.cantidadPromocionesProgramadas ?? 0}</p>
      </article>

      <article className={cardClass}>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Promociones inactivas</p>
        <p className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{stats?.cantidadPromocionesInactivas ?? 0}</p>
      </article>

      <article className={cardClass}>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Promociones finalizadas</p>
        <p className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{stats?.cantidadPromocionesFinalizadas ?? 0}</p>
      </article>
    </div>
  )
}
