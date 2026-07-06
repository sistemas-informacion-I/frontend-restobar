import {
  BadgePercent,
  CalendarDays,
  CircleCheck,
  CircleOff,
  Clock3,
  Gift,
  Package,
  Store,
  Tag,
  AlertTriangle,
  Ticket,
  Layers,
} from 'lucide-react'
import type { Promocion } from '../models/Promocion'

interface PromocionDetailViewProps {
  promocion?: Promocion | null
  isLoading?: boolean
  error?: string | null
}

const estadoLabel: Record<string, string> = {
  PROGRAMADA: 'Programada',
  ACTIVA: 'Activa',
  INACTIVA: 'Inactiva',
  FINALIZADA: 'Finalizada',
}

const tipoLabel: Record<string, string> = {
  PORCENTAJE: 'Porcentaje',
  MONTO_FIJO: 'Monto fijo',
  COMPRA_MINIMA: 'Compra mínima',
  DOS_POR_UNO: '2x1',
  COMBO: 'Combo',
}

const estadoBadgeClass: Record<string, string> = {
  PROGRAMADA: 'bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300',
  ACTIVA: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
  INACTIVA: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  FINALIZADA: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300',
}

const estadoProductoLabel: Record<string, string> = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
  NO_DISPONIBLE: 'No disponible',
  NO_ASIGNADO: 'No asignado',
}

const estadoProductoBadgeClass: Record<string, string> = {
  ACTIVO: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
  INACTIVO: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300',
  NO_DISPONIBLE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
  NO_ASIGNADO: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
}

const formatPrecio = (precio?: number) => {
  if (typeof precio !== 'number' || Number.isNaN(precio)) return 'No disponible'
  return `Bs ${precio.toFixed(2)}`
}

const formatDate = (value?: string) => {
  if (!value) return '—'
  const normalized = value.trim()

  const isoMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    const [, year, month, day] = isoMatch
    return `${day}/${month}/${year}`
  }

  const slashMatch = normalized.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (slashMatch) {
    const [, day, month, year] = slashMatch
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
  }

  return normalized
}

const toNumber = (value?: number) => (typeof value === 'number' && Number.isFinite(value) ? value : 0)

const daysSinceEnd = (fechaFin?: string) => {
  if (!fechaFin) return 0
  const isoMatch = fechaFin.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!isoMatch) return 0
  const [, year, month, day] = isoMatch
  const endDate = new Date(Number(year), Number(month) - 1, Number(day))
  const today = new Date()
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const diff = Math.floor((todayDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-wine-100/40 bg-white/70 p-4 dark:border-wine-900/20 dark:bg-black/20">
      <div className="mb-3 flex items-center gap-2 text-wine-700 dark:text-wine-300">{icon}</div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/50 dark:text-wine-400/50">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{value || '—'}</p>
    </article>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-2xl border border-wine-100/40 bg-white/70 p-5 dark:border-wine-900/20 dark:bg-black/20">
        <div className="h-7 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-3 h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="h-24 rounded-2xl border border-wine-100/40 bg-white/70 dark:border-wine-900/20 dark:bg-black/20" />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 h-40 rounded-2xl border border-wine-100/40 bg-white/70 dark:border-wine-900/20 dark:bg-black/20" />
        <div className="h-40 rounded-2xl border border-wine-100/40 bg-white/70 dark:border-wine-900/20 dark:bg-black/20" />
      </div>

      <div className="h-56 rounded-2xl border border-wine-100/40 bg-white/70 dark:border-wine-900/20 dark:bg-black/20" />
    </div>
  )
}

export function PromocionDetailView({ promocion, isLoading = false, error = null }: PromocionDetailViewProps) {
  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-900/30 dark:bg-rose-900/20">
        <div className="flex items-center gap-3 text-rose-700 dark:text-rose-300">
          <AlertTriangle size={18} />
          <p className="text-sm font-semibold">No fue posible cargar la promoción.</p>
        </div>
        <p className="mt-2 text-sm text-rose-600 dark:text-rose-200/80">{error}</p>
      </div>
    )
  }

  if (!promocion) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/30">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No hay información de la promoción para mostrar.</p>
      </div>
    )
  }

  const estado = promocion.estado || 'INACTIVA'
  const badgeEstadoClass = estadoBadgeClass[estado] ?? estadoBadgeClass.INACTIVA
  const diasRestantes = toNumber(promocion.diasRestantes)
  const diasTranscurridos = toNumber(promocion.diasTranscurridos)
  const vigenciaText =
    estado === 'PROGRAMADA'
      ? `Comienza en ${diasRestantes} días`
      : estado === 'ACTIVA'
      ? `Vigente · Restan ${diasRestantes} días · Transcurrieron ${diasTranscurridos} días`
      : estado === 'FINALIZADA'
      ? `Finalizada · Terminó hace ${daysSinceEnd(promocion.fechaFin)} días`
      : 'Promoción inactiva'

  const productCount = promocion.productos?.length ?? 0

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-wine-100/40 bg-white/70 p-5 dark:border-wine-900/20 dark:bg-black/20">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-wine-700 dark:text-wine-300">
              <Gift size={20} />
              <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{promocion.nombre}</h3>
            </div>
            {promocion.descripcion && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{promocion.descripcion}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${badgeEstadoClass}`}>
              {estadoLabel[estado] ?? estado}
            </span>
            <span className="inline-flex items-center rounded-full bg-wine-100 px-3 py-1 text-xs font-bold text-wine-700 dark:bg-wine-900/30 dark:text-wine-300">
              {tipoLabel[promocion.tipo] ?? promocion.tipo}
            </span>
          </div>
        </div>
      </section>

      <section>
        <h4 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Información general</h4>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <InfoCard icon={<Tag size={16} />} label="Nombre" value={promocion.nombre} />
          <InfoCard icon={<Ticket size={16} />} label="Tipo" value={tipoLabel[promocion.tipo] ?? promocion.tipo} />
          <InfoCard icon={<CircleCheck size={16} />} label="Estado" value={estadoLabel[estado] ?? estado} />
          <InfoCard icon={<BadgePercent size={16} />} label="Descuento" value={`${promocion.valorDescuento ?? 0}%`} />
          <InfoCard icon={<Layers size={16} />} label="Compra mínima" value={promocion.compraMinima != null ? `${promocion.compraMinima}` : 'No aplica'} />
          <InfoCard icon={<CalendarDays size={16} />} label="Fecha de inicio" value={formatDate(promocion.fechaInicio)} />
          <InfoCard icon={<CalendarDays size={16} />} label="Fecha de fin" value={formatDate(promocion.fechaFin)} />
          <InfoCard icon={<Store size={16} />} label="Sucursal" value={promocion.nombreSucursal ?? `#${promocion.idSucursal}`} />
          <InfoCard icon={<CircleOff size={16} />} label="Activa" value={promocion.activo ? 'Sí' : 'No'} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-wine-100/40 bg-white/70 p-5 dark:border-wine-900/20 dark:bg-black/20 lg:col-span-2">
          <h4 className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">
            <Clock3 size={14} /> Vigencia
          </h4>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${badgeEstadoClass}`}>
              {estadoLabel[estado] ?? estado}
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{vigenciaText}</p>
        </article>

        <article className="rounded-2xl border border-wine-100/40 bg-white/70 p-5 dark:border-wine-900/20 dark:bg-black/20">
          <h4 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Resumen</h4>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <li className="flex justify-between gap-3"><span>Productos</span><strong>{productCount}</strong></li>
            <li className="flex justify-between gap-3"><span>Tipo</span><strong>{tipoLabel[promocion.tipo] ?? promocion.tipo}</strong></li>
            <li className="flex justify-between gap-3"><span>Estado</span><strong>{estadoLabel[estado] ?? estado}</strong></li>
            <li className="flex justify-between gap-3"><span>Sucursal</span><strong>{promocion.nombreSucursal ?? `#${promocion.idSucursal}`}</strong></li>
            <li className="flex justify-between gap-3"><span>Vigencia</span><strong>{vigenciaText}</strong></li>
          </ul>
        </article>
      </section>

      <section>
        <h4 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">
          <Package size={14} /> Productos incluidos
        </h4>

        {productCount === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-300">
            No existen productos asociados.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-wine-100/40 bg-white/70 dark:border-wine-900/20 dark:bg-black/20">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-wine-50/60 dark:bg-wine-900/10">
                  <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-800/70 dark:text-wine-300/70">
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Categoría</th>
                    <th className="px-4 py-3">Precio</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60">
                  {(promocion.productos ?? []).map((producto, index) => (
                    <tr key={`${producto.idProductoFinal ?? index}-${index}`}>
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">{producto.nombre ?? `Producto #${producto.idProductoFinal ?? '-'}`}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{producto.nombreCategoria ?? 'No disponible'}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatPrecio(producto.precio)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                            estadoProductoBadgeClass[producto.estado ?? 'NO_ASIGNADO'] ?? estadoProductoBadgeClass.NO_ASIGNADO
                          }`}
                        >
                          {estadoProductoLabel[producto.estado ?? 'NO_ASIGNADO'] ?? 'No asignado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
