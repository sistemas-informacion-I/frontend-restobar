import { Store, Phone, Mail, Clock, Globe } from 'lucide-react'
import { Grid3X3 } from 'lucide-react'
import { Sucursal, Sector } from '../../services/types'

interface SucursalViewProps {
  sucursal: Sucursal
  sectores?: Sector[]
}

export function SucursalView({sucursal, sectores}: SucursalViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 border-b border-slate-200 pb-6 text-center dark:border-slate-700 sm:flex-row sm:items-start sm:text-left">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30">
          <Store size={24} />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{sucursal.nombre}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {sucursal.activo ? (
              <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                Activa
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                Inactiva
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* ID */}
        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Store size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">ID de Sucursal</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">{sucursal.idSucursal}</span>
          </div>
        </div>

        {/* Dirección */}
        {sucursal.direccion && (
          <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Grid3X3 size={18} />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Direccion Sucursal</span>
              <span className="break-all text-sm text-slate-900 dark:text-slate-100">{sucursal.direccion}</span>
            </div>
          </div>
        )}

        {/* Teléfono */}
        {sucursal.telefono && (
          <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Phone size={18} />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Teléfono</span>
              <span className="break-all text-sm text-slate-900 dark:text-slate-100">{sucursal.telefono}</span>
            </div>
          </div>
        )}

        {/* Correo */}
        {sucursal.correo && (
          <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Mail size={18} />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Correo</span>
              <span className="break-all text-sm text-slate-900 dark:text-slate-100">{sucursal.correo}</span>
            </div>
          </div>
        )}

        {/* Ciudad y Departamento */}
        {(sucursal.ciudad || sucursal.departamento) && (
          <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Globe size={18} />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Ubicación</span>
              <span className="break-all text-sm text-slate-900 dark:text-slate-100">
                {sucursal.ciudad}{sucursal.departamento ? `, ${sucursal.departamento}` : ''}
              </span>
            </div>
          </div>
        )}

        {/* Sectores */}
        {(sectores && sectores.length > 0) && (
          <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Grid3X3 size={18} />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Sectores</span>
              <div className="flex flex-col gap-1">
                {sectores.map((sector) => (
                  <span key={sector.idSector} className="break-all text-sm text-slate-900 dark:text-slate-100">
                    • {sector.nombre} ({sector.tipoSector})
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Horario */}
        {(sucursal.horarioApertura || sucursal.horarioCierre) && (
          <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Clock size={18} />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Horario</span>
              <span className="break-all text-sm text-slate-900 dark:text-slate-100">
                {sucursal.horarioApertura || '-'} - {sucursal.horarioCierre || '-'}
              </span>
            </div>
          </div>
        )}

        {/* Estado Operativo */}
        {sucursal.estadoOperativo && (
          <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Clock size={18} />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Estado Operativo</span>
              <span className="break-all text-sm text-slate-900 dark:text-slate-100">{sucursal.estadoOperativo}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}