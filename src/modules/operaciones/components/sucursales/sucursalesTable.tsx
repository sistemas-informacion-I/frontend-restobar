import { Edit2, Eye, Store, Trash2, Grid3X3, MapPin, Phone, Mail } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { TableContainer } from '@/shared/components/ui'

interface Sucursal {
  idSucursal: number
  nombre: string
  direccion: string
  telefono?: string
  correo?: string
  ciudad?: string
  departamento?: string
  activo: boolean
  nombreResponsable?: string
}

interface SucursalesTableProps {
  sucursales: Sucursal[]
  canUpdateSucursales: boolean
  canDeleteSucursales: boolean
  onView: (sucursal: Sucursal) => void
  onEdit: (sucursal: Sucursal) => void
  onDelete: (sucursal: Sucursal) => void
  onAddSector: (sucursal: Sucursal) => void
}

export function SucursalesTable({
  sucursales,
  canUpdateSucursales,
  canDeleteSucursales,
  onView,
  onEdit,
  onDelete,
  onAddSector,
}: SucursalesTableProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {sucursales.length === 0 ? (
          <div className="glass-card rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/5 py-12 text-center dark:border-wine-900/20">
            <Store size={40} className="mx-auto text-wine-100 dark:text-wine-900/30 mb-3" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">No hay sucursales</span>
          </div>
        ) : (
          sucursales.map((sucursal) => (
            <div key={sucursal.idSucursal} className="glass-card overflow-hidden rounded-[2rem] border border-wine-100/50 bg-white/50 p-6 dark:border-wine-900/20 dark:bg-black/20 shadow-xl shadow-wine-900/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg shadow-wine-900/20">
                    <Store size={24} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-black text-lg text-slate-600 dark:text-slate-200 tracking-tight leading-none">{sucursal.nombre}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-600 dark:text-wine-400">ID: {sucursal.idSucursal}</span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm border ${
                    sucursal.activo
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                  }`}
                >
                  <div className={`h-1.5 w-1.5 rounded-full ${sucursal.activo ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  {sucursal.activo ? 'Activa' : 'Inactiva'}
                </span>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-wine-50/50 dark:bg-wine-900/20 text-wine-600">
                    <MapPin size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{sucursal.direccion || 'Sin dirección'}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">{sucursal.ciudad || 'Sin ciudad'}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-wine-900/40" />
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{sucursal.telefono || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-wine-900/40" />
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 truncate max-w-[120px]">{sucursal.correo || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  className="!rounded-xl bg-white dark:bg-white/5 border border-wine-100/50 dark:border-wine-900/20 text-[10px] font-black uppercase tracking-widest h-12"
                  onClick={() => onAddSector(sucursal)}
                >
                  <Grid3X3 size={16} className="mr-2" /> + Sector
                </Button>
                <Button
                  variant="ghost"
                  className="!rounded-xl bg-white dark:bg-white/5 border border-wine-100/50 dark:border-wine-900/20 text-[10px] font-black uppercase tracking-widest h-12"
                  onClick={() => onView(sucursal)}
                >
                  <Eye size={16} className="mr-2" /> Detalle
                </Button>
                {canUpdateSucursales && (
                  <Button
                    variant="ghost"
                    className="!rounded-xl bg-white dark:bg-white/5 border border-wine-100/50 dark:border-wine-900/20 text-[10px] font-black uppercase tracking-widest h-12"
                    onClick={() => onEdit(sucursal)}
                  >
                    <Edit2 size={16} className="mr-2" /> Editar
                  </Button>
                )}
                {canDeleteSucursales && (
                  <Button
                    variant="danger"
                    className="!rounded-xl h-12 shadow-lg shadow-rose-900/10"
                    onClick={() => onDelete(sucursal)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block glass-card rounded-[2.5rem] shadow-2xl shadow-wine-900/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <TableContainer>
          <table className="min-w-[800px] w-full border-collapse">
            <thead>
              <tr className="border-b border-wine-100/50 bg-wine-50/30 dark:border-wine-900/20 dark:bg-wine-950/20">
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Sucursal</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Dirección</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Responsable</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Estado</th>
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wine-50 dark:divide-wine-950/30">
              {sucursales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Store size={40} className="text-wine-100 dark:text-wine-900/30" />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">No se encontraron sucursales</span>
                    </div>
                  </td>
                </tr>
              ) : (
                sucursales.map((sucursal) => (
                  <tr key={sucursal.idSucursal} className="transition-all duration-300 hover:bg-wine-50/30 dark:hover:bg-wine-900/10 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg shadow-wine-900/20 group-hover:scale-105 transition-transform">
                          <Store size={20} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-black text-lg text-slate-600 dark:text-slate-200 tracking-tight leading-none">{sucursal.nombre}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-wine-600 dark:text-wine-400">ID: {sucursal.idSucursal}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5 max-w-[250px]">
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 truncate tracking-tight">{sucursal.direccion || 'Sin dirección'}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{sucursal.ciudad || 'Ciudad no especificada'}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-wine-500" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">
                          {sucursal.nombreResponsable || 'Sin asignar'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter shadow-sm border ${
                          sucursal.activo
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        }`}
                      >
                        <div className={`h-1.5 w-1.5 rounded-full ${sucursal.activo ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        {sucursal.activo ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="!rounded-xl bg-white/50 dark:bg-black/20 hover:!bg-emerald-50 dark:hover:!bg-emerald-900/20 hover:!text-emerald-600 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-all"
                          onClick={() => onAddSector(sucursal)}
                          title="Añadir Sector"
                        >
                          <Grid3X3 size={16} />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="!rounded-xl bg-white/50 dark:bg-black/20 hover:!bg-wine-50 dark:hover:!bg-wine-900/30 border border-transparent hover:border-wine-100 dark:hover:border-wine-900/20 transition-all"
                          onClick={() => onView(sucursal)}
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </Button>

                        {canUpdateSucursales && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="!rounded-xl bg-white/50 dark:bg-black/20 hover:!bg-wine-50 dark:hover:!bg-wine-900/30 border border-transparent hover:border-wine-100 dark:hover:border-wine-900/20 transition-all"
                            onClick={() => onEdit(sucursal)}
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </Button>
                        )}

                        {canDeleteSucursales && (
                          <Button
                            variant="danger"
                            size="sm"
                            className="!rounded-xl shadow-lg shadow-rose-900/10"
                            onClick={() => onDelete(sucursal)}
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
        </TableContainer>
      </div>
    </div>
  )
}
