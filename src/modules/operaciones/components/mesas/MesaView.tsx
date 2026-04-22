import { Armchair } from 'lucide-react'
import { Mesa } from '../../services/types'

interface MesaViewProps {
  mesa: Mesa
}

const disponibilidadLabels: Record<string, string> = {
  DISPONIBLE: 'Disponible',
  OCUPADA: 'Ocupada',
  RESERVADA: 'Reservada',
  MANTENIMIENTO: 'Mantenimiento',
}

export function MesaView({ mesa }: MesaViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 border-b border-slate-200 pb-6 text-center dark:border-slate-700 sm:flex-row sm:items-start sm:text-left">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30">
          <Armchair size={24} />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Mesa {mesa.numeroMesa}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {mesa.activo ? (
              <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                Activo
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                Inactivo
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Armchair size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">ID de Mesa</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">{mesa.idMesa}</span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Armchair size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Número de Mesa</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">{mesa.numeroMesa}</span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Armchair size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Capacidad</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">{mesa.capacidadPersonas} personas</span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Armchair size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Disponibilidad</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">
              {disponibilidadLabels[mesa.disponibilidad] || mesa.disponibilidad}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Armchair size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Sector</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">
              {mesa.nombreSector || `Sector #${mesa.idSector}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}