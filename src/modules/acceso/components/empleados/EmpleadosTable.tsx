import { Edit, Eye, Trash2 } from 'lucide-react'
import { Button, TableCell, TableRow } from '@/shared/components/ui'
import { Empleado } from '../../services/api'

interface EmpleadosTableProps {
  empleados: Empleado[]
  canUpdateEmpleados: boolean
  canDeleteEmpleados: boolean
  onView: (empleado: Empleado) => void
  onEdit: (empleado: Empleado) => void
  onDelete: (empleado: Empleado) => void
}

export function EmpleadosTable({
  empleados,
  canUpdateEmpleados,
  canDeleteEmpleados,
  onView,
  onEdit,
  onDelete,
}: EmpleadosTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead>
            <TableRow header>
              <TableCell header>Nombre</TableCell>
              <TableCell header>CI</TableCell>
              <TableCell header>Código</TableCell>
              <TableCell header>Usuario</TableCell>
              <TableCell header>Correo</TableCell>
              <TableCell header>Teléfono</TableCell>
              <TableCell header>Estado</TableCell>
              <TableCell header>Acciones</TableCell>
            </TableRow>
          </thead>
          <tbody>
            {empleados.length === 0 ? (
              <TableRow hover={false}>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                  No se encontraron empleados
                </TableCell>
              </TableRow>
            ) : (
              empleados.map((empleado) => (
                <TableRow key={empleado.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-sm font-semibold text-white">
                        {(empleado.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <span className="text-slate-900 dark:text-slate-100">{empleado.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-slate-700 dark:text-slate-300">{empleado.ci || 'N/A'}</TableCell>

                  <TableCell className="text-slate-700 dark:text-slate-300">{empleado.codigoEmpleado || 'N/A'}</TableCell>

                  <TableCell className="text-slate-700 dark:text-slate-300">{empleado.username || 'N/A'}</TableCell>

                  <TableCell className="text-slate-700 dark:text-slate-300">{empleado.email || 'N/A'}</TableCell>

                  <TableCell className="text-slate-700 dark:text-slate-300">{empleado.phone || 'N/A'}</TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        empleado.isActive
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400'
                      }`}
                    >
                      {empleado.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="!h-8 !w-8 !min-h-8 !rounded-md !px-0 border border-slate-300 !text-slate-500 hover:!border-emerald-400 hover:!bg-emerald-50 hover:!text-emerald-600 dark:border-slate-600 dark:!text-slate-400 dark:hover:!border-emerald-500/50 dark:hover:!bg-emerald-500/10 dark:hover:!text-emerald-300"
                        onClick={() => onView(empleado)}
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </Button>

                      {canUpdateEmpleados && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="!h-8 !w-8 !min-h-8 !rounded-md !px-0 border border-slate-300 !text-slate-500 hover:!border-emerald-400 hover:!bg-emerald-50 hover:!text-emerald-600 dark:border-slate-600 dark:!text-slate-400 dark:hover:!border-emerald-500/50 dark:hover:!bg-emerald-500/10 dark:hover:!text-emerald-300"
                          onClick={() => onEdit(empleado)}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </Button>
                      )}

                      {canDeleteEmpleados && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="!h-8 !w-8 !min-h-8 !rounded-md !px-0 border border-slate-300 !text-slate-500 hover:!border-rose-400 hover:!bg-rose-50 hover:!text-rose-600 dark:border-slate-600 dark:!text-slate-400 dark:hover:!border-rose-500/50 dark:hover:!bg-rose-500/10 dark:hover:!text-rose-300"
                          onClick={() => onDelete(empleado)}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
