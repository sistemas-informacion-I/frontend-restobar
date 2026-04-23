import { Edit2, Eye, Trash2, Grid3X3, Armchair, Store } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Sector } from '../../services/types'

interface SectoresTableProps {
  sectores: Sector[]
  canUpdateSectores: boolean
  canDeleteSectores: boolean
  onView: (sector: Sector) => void
  onEdit: (sector: Sector) => void
  onDelete: (sector: Sector) => void
  onAddMesa: (sector: Sector) => void
}

const tipoSectorLabels: Record<string, string> = {
  SALON: 'Salón',
  TERRAZA: 'Terraza',
  VIP: 'VIP',
}

export function SectoresTable({
  sectores,
  canUpdateSectores,
  canDeleteSectores,
  onView,
  onEdit,
  onDelete,
  onAddMesa,
}: SectoresTableProps) {
  return (
    <div className="glass-card rounded-[2.5rem] shadow-2xl shadow-wine-900/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full border-collapse">
          <thead>
            <tr className="border-b border-wine-100/50 bg-wine-50/30 dark:border-wine-900/20 dark:bg-wine-950/20">
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Sector</th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Tipo / Área</th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Sucursal</th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Estado</th>
              <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wine-50 dark:divide-wine-950/30">
            {sectores.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Grid3X3 size={40} className="text-wine-100 dark:text-wine-900/30" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">No se encontraron sectores</span>
                  </div>
                </td>
              </tr>
            ) : (
              sectores.map((sector) => (
                <tr key={sector.idSector} className="transition-all duration-300 hover:bg-wine-50/30 dark:hover:bg-wine-900/10 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg shadow-wine-900/20 group-hover:scale-105 transition-transform">
                        <Grid3X3 size={20} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-900 dark:text-white tracking-tight leading-none">{sector.nombre}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-wine-600 dark:text-wine-400">ID: {sector.idSector}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-lg bg-wine-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-wine-700 dark:text-wine-300 border border-wine-100/50 dark:border-wine-900/20">
                      {tipoSectorLabels[sector.tipoSector] || sector.tipoSector}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                     <Store size={14} className="text-wine-900/40 dark:text-wine-100/30" />
                     <span className="text-sm font-bold text-slate-600 dark:text-slate-300 tracking-tight">
                        {sector.nombreSucursal || `Sucursal #${sector.idSucursal}`}
                     </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter shadow-sm ${
                        sector.activo
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      <div className={`h-1.5 w-1.5 rounded-full ${sector.activo ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      {sector.activo ? 'Habilitado' : 'Inactivo'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="!rounded-xl bg-white/50 dark:bg-black/20 hover:!bg-emerald-50 dark:hover:!bg-emerald-900/20 hover:!text-emerald-600 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-all"
                        onClick={() => onAddMesa(sector)}
                        title="Añadir Mesa"
                      >
                        <Armchair size={16} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="!rounded-xl bg-white/50 dark:bg-black/20 hover:!bg-wine-50 dark:hover:!bg-wine-900/30 border border-transparent hover:border-wine-100 dark:hover:border-wine-900/20 transition-all"
                        onClick={() => onView(sector)}
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </Button>

                      {canUpdateSectores && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="!rounded-xl bg-white/50 dark:bg-black/20 hover:!bg-wine-50 dark:hover:!bg-wine-900/30 border border-transparent hover:border-wine-100 dark:hover:border-wine-900/20 transition-all"
                          onClick={() => onEdit(sector)}
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </Button>
                      )}

                      {canDeleteSectores && (
                        <Button
                          variant="danger"
                          size="sm"
                          className="!rounded-xl shadow-lg shadow-rose-900/10"
                          onClick={() => onDelete(sector)}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}