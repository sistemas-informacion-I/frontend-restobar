import { Edit2, Eye, Trash2, Armchair } from 'lucide-react'
import { Button, TableCell, TableRow } from '@/shared/components/ui'
import { Mesa } from '../../services/types'

interface MesasTableProps {
  mesas: Mesa[]
  canUpdateMesas: boolean
  canDeleteMesas: boolean
  onView: (mesa: Mesa) => void
  onEdit: (mesa: Mesa) => void
  onDelete: (mesa: Mesa) => void
}

const disponibilidadLabels: Record<string, string> = {
  DISPONIBLE: 'Disponible',
  OCUPADA: 'Ocupada',
  RESERVADA: 'Reservada',
  MANTENIMIENTO: 'Mantenimiento',
}

export function MesasTable({
  mesas,
  canUpdateMesas,
  canDeleteMesas,
  onView,
  onEdit,
  onDelete,
}: MesasTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full border-collapse">
          <thead>
            <TableRow header>
              <TableCell header>Número</TableCell>
              <TableCell header>Capacidad</TableCell>
              <TableCell header>Disponibilidad</TableCell>
              <TableCell header>Sector</TableCell>
              <TableCell header>Estado</TableCell>
              <TableCell header>Acciones</TableCell>
            </TableRow>
          </thead>
          <tbody>
            {mesas.map((mesa) => (
              <TableRow key={mesa.idMesa}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
                      <Armchair size={16} />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-slate-100">Mesa {mesa.numeroMesa}</span>
                  </div>
                </TableCell>

                <TableCell className="text-slate-600 dark:text-slate-300">
                  {mesa.capacidadPersonas} personas
                </TableCell>

                <TableCell className="text-slate-600 dark:text-slate-300">
                  {disponibilidadLabels[mesa.disponibilidad] || mesa.disponibilidad}
                </TableCell>

                <TableCell className="text-slate-600 dark:text-slate-300">
                  {mesa.nombreSector || `Sector #${mesa.idSector}`}
                </TableCell>

                <TableCell>
                  {mesa.activo ? (
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
                      className="!h-8 !w-8 !min-h-8 !rounded-md !px-0 border border-slate-300 !text-slate-500 hover:!border-indigo-400 hover:!bg-indigo-50 hover:!text-indigo-600 dark:border-slate-600 dark:!text-slate-400 dark:hover:!border-indigo-500/50 dark:hover:!bg-indigo-500/10 dark:hover:!text-indigo-300"
                      title="Ver"
                      onClick={() => onView(mesa)}
                    >
                      <Eye size={16} />
                    </Button>

                    {canUpdateMesas && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="!h-8 !w-8 !min-h-8 !rounded-md !px-0 border border-slate-300 !text-slate-500 hover:!border-indigo-400 hover:!bg-indigo-50 hover:!text-indigo-600 dark:border-slate-600 dark:!text-slate-400 dark:hover:!border-indigo-500/50 dark:hover:!bg-indigo-500/10 dark:hover:!text-indigo-300"
                        title="Editar"
                        onClick={() => onEdit(mesa)}
                      >
                        <Edit2 size={16} />
                      </Button>
                    )}

                    {canDeleteMesas && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="!h-8 !w-8 !min-h-8 !rounded-md !px-0 border border-slate-300 !text-slate-500 hover:!border-rose-400 hover:!bg-rose-50 hover:!text-rose-600 dark:border-slate-600 dark:!text-slate-400 dark:hover:!border-rose-500/50 dark:hover:!bg-rose-500/10 dark:hover:!text-rose-300"
                        title="Eliminar"
                        onClick={() => onDelete(mesa)}
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