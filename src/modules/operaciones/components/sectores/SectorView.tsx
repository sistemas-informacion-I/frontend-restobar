import { Grid3X3 } from 'lucide-react'

export interface Sector {
  idSector: number
  nombre: string
  descripcion?: string
  tipoSector: string
  activo: boolean
  idSucursal: number
  nombreSucursal?: string
}

interface SectorViewProps {
  sector: Sector
}

const tipoSectorLabels: Record<string, string> = {
  SALON: 'Salón',
  BARRA: 'Barra',
  TERRAZA: 'Terraza',
  VIP: 'VIP',
  COCINA: 'Cocina',
}

export function SectorView({ sector }: SectorViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 border-b border-slate-200 pb-6 text-center dark:border-slate-700 sm:flex-row sm:items-start sm:text-left">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30">
          <Grid3X3 size={24} />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{sector.nombre}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {sector.activo ? (
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
            <Grid3X3 size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">ID de Sector</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">{sector.idSector}</span>
          </div>
        </div>

        {sector.descripcion && (
          <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Grid3X3 size={18} />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Descripción</span>
              <span className="break-all text-sm text-slate-900 dark:text-slate-100">{sector.descripcion}</span>
            </div>
          </div>
        )}

        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Grid3X3 size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Tipo de Sector</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">
              {tipoSectorLabels[sector.tipoSector] || sector.tipoSector}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Grid3X3 size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Sucursal</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">
              {sector.nombreSucursal || `Sucursal #${sector.idSucursal}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}