import { Edit2, Eye, Trash2, User, CreditCard, Briefcase } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Empleado } from '@/modules/acceso/services/empleados.service'

interface EmployeesTableProps {
  employees: Empleado[]
  canUpdate: boolean
  canDelete: boolean
  onView: (employee: Empleado) => void
  onEdit: (employee: Empleado) => void
  onDelete: (employee: Empleado) => void
}

export function EmployeesTable({
  employees,
  canUpdate,
  canDelete,
  onView,
  onEdit,
  onDelete,
}: EmployeesTableProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {employees.length === 0 ? (
          <div className="glass-card rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/5 py-12 text-center dark:border-wine-900/20">
            <User size={40} className="mx-auto text-wine-100 dark:text-wine-900/30 mb-3" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">No hay empleados</span>
          </div>
        ) : (
          employees.map((emp) => (
            <div key={emp.idEmpleado} className="glass-card overflow-hidden rounded-[2rem] border border-wine-100/50 bg-white/50 p-6 dark:border-wine-900/20 dark:bg-black/20 shadow-xl shadow-wine-900/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg shadow-wine-900/20">
                    <User size={24} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight leading-none">{emp.nombre} {emp.apellido}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-600 dark:text-wine-400">ID: {emp.codigoEmpleado}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm border ${
                  emp.activo
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                }`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${emp.activo ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  {emp.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Cargo:</span>
                    <div className="flex flex-wrap gap-1">
                      {emp.roles?.map((r, i) => (
                        <span key={i} className="bg-wine-500/10 text-wine-700 dark:text-wine-300 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Sucursal:</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{emp.nombreSucursal || 'Global'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-wine-100/30 dark:border-wine-900/10 pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Identificación:</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{emp.ci}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Salario:</span>
                    <span className="text-xs font-bold text-wine-700 dark:text-wine-400">Bs. {emp.salario}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  className="!rounded-xl bg-white dark:bg-white/5 border border-wine-100/50 dark:border-wine-900/20 text-[10px] font-black uppercase tracking-widest h-12"
                  onClick={() => onView(emp)}
                >
                  <Eye size={16} className="mr-2" /> Detalle
                </Button>
                {canUpdate && (
                  <Button
                    variant="ghost"
                    className="!rounded-xl bg-white dark:bg-white/5 border border-wine-100/50 dark:border-wine-900/20 text-[10px] font-black uppercase tracking-widest h-12"
                    onClick={() => onEdit(emp)}
                  >
                    <Edit2 size={16} className="mr-2" /> Editar
                  </Button>
                )}
                {canDelete && (
                  <Button
                    variant="danger"
                    className="!rounded-xl h-12 col-span-2 shadow-lg shadow-rose-900/10"
                    onClick={() => onDelete(emp)}
                  >
                    <Trash2 size={16} className="mr-2" /> Eliminar Personal
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block glass-card rounded-[2.5rem] shadow-2xl shadow-wine-900/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full border-collapse">
            <thead>
              <tr className="border-b border-wine-100/50 bg-wine-50/30 dark:border-wine-900/20 dark:bg-wine-950/20">
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Empleado</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Identificación</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Cargo</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Sucursal</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Salario / Turno</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Estado</th>
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wine-50 dark:divide-wine-950/30">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <User size={40} className="text-wine-100 dark:text-wine-900/30" />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">No se encontraron empleados</span>
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.idEmpleado} className="transition-all duration-300 hover:bg-wine-50/30 dark:hover:bg-wine-900/10 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg shadow-wine-900/20 group-hover:scale-105 transition-transform">
                          <User size={20} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-900 dark:text-white tracking-tight leading-none">{emp.nombre} {emp.apellido}</span>
                          <span className="text-[10px] font-bold lowercase tracking-widest text-wine-600 dark:text-wine-400">{emp.correo || 'sin@correo.com'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300">
                          <CreditCard size={14} className="text-wine-900/30" />
                          {emp.ci}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-wine-600 dark:text-wine-500">{emp.codigoEmpleado}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {emp.roles && emp.roles.length > 0 ? (
                          emp.roles.map((role, idx) => (
                            <span key={idx} className="bg-wine-500/10 text-wine-700 dark:text-wine-300 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border border-wine-100/50 dark:border-wine-800/30">
                              {role}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 italic">Sin cargo</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5 text-sm font-bold text-slate-600 dark:text-slate-300">
                        {emp.nombreSucursal || 'Sin sucursal'}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300">
                          <Briefcase size={14} className="text-wine-900/30" />
                          Bs. {emp.salario}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Turno: {emp.turno || 'N/A'}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter shadow-sm border ${
                          emp.activo
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        }`}
                      >
                        <div className={`h-1.5 w-1.5 rounded-full ${emp.activo ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        {emp.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="!rounded-xl bg-white/50 dark:bg-black/20 hover:!bg-wine-50 dark:hover:!bg-wine-900/30 border border-transparent hover:border-wine-100 dark:hover:border-wine-900/20 transition-all"
                          onClick={() => onView(emp)}
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </Button>

                        {canUpdate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="!rounded-xl bg-white/50 dark:bg-black/20 hover:!bg-wine-50 dark:hover:!bg-wine-900/30 border border-transparent hover:border-wine-100 dark:hover:border-wine-900/20 transition-all"
                            onClick={() => onEdit(emp)}
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </Button>
                        )}

                        {canDelete && (
                          <Button
                            variant="danger"
                            size="sm"
                            className="!rounded-xl shadow-lg shadow-rose-900/10"
                            onClick={() => onDelete(emp)}
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
    </div>
  )
}
