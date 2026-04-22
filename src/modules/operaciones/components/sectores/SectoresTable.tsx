import { Edit2, Eye, Trash2, Grid3X3, Armchair } from 'lucide-react'
import { Button, TableCell, TableRow } from '@/shared/components/ui'
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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full border-collapse">
          <thead>
            <TableRow header>
              <TableCell header>Nombre</TableCell>
              <TableCell header>Tipo</TableCell>
              <TableCell header>Sucursal</TableCell>
              <TableCell header>Estado</TableCell>
              <TableCell header>Acciones</TableCell>
            </TableRow>
          </thead>
          <tbody>
            {sectores.map((sector) => (
              <TableRow key={sector.idSector}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
                      <Grid3X3 size={16} />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{sector.nombre}</span>
                  </div>
                </TableCell>

                <TableCell className="text-slate-600 dark:text-slate-300">
                  {tipoSectorLabels[sector.tipoSector] || sector.tipoSector}
                </TableCell>

                <TableCell className="text-slate-600 dark:text-slate-300">
                  {sector.nombreSucursal || `Sucursal #${sector.idSucursal}`}
                </TableCell>

                <TableCell>
                  {sector.activo ? (
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      Inactivo
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="!h-8 !w-8 !min-h-8 !rounded-md !px-0 border border-emerald-300 !text-emerald-600 hover:!border-emerald-500 hover:!bg-emerald-50 hover:!text-emerald-700 dark:border-emerald-600/50 dark:!text-emerald-400 dark:hover:!border-emerald-500 dark:hover:!bg-emerald-500/10 dark:hover:!text-emerald-300"
                      title="Añadir Mesa"
                      onClick={() => onAddMesa(sector)}
                    >
                      <Armchair size={16} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="!h-8 !w-8 !min-h-8 !rounded-md !px-0 border border-slate-300 !text-slate-500 hover:!border-indigo-400 hover:!bg-indigo-50 hover:!text-indigo-600 dark:border-slate-600 dark:!text-slate-400 dark:hover:!border-indigo-500/50 dark:hover:!bg-indigo-500/10 dark:hover:!text-indigo-300"
                      title="Ver"
                      onClick={() => onView(sector)}
                    >
                      <Eye size={16} />
                    </Button>

                    {canUpdateSectores && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="!h-8 !w-8 !min-h-8 !rounded-md !px-0 border border-slate-300 !text-slate-500 hover:!border-indigo-400 hover:!bg-indigo-50 hover:!text-indigo-600 dark:border-slate-600 dark:!text-slate-400 dark:hover:!border-indigo-500/50 dark:hover:!bg-indigo-500/10 dark:hover:!text-indigo-300"
                        title="Editar"
                        onClick={() => onEdit(sector)}
                      >
                        <Edit2 size={16} />
                      </Button>
                    )}

                    {canDeleteSectores && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="!h-8 !w-8 !min-h-8 !rounded-md !px-0 border border-slate-300 !text-slate-500 hover:!border-rose-400 hover:!bg-rose-50 hover:!text-rose-600 dark:border-slate-600 dark:!text-slate-400 dark:hover:!border-rose-500/50 dark:hover:!bg-rose-500/10 dark:hover:!text-rose-300"
                        title="Eliminar"
                        onClick={() => onDelete(sector)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}