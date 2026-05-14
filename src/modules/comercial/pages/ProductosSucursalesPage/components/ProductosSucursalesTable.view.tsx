import { ProductoSucursal } from '../../../hooks/useProductosSucursales'
import { Edit2 } from 'lucide-react'

interface ProductosSucursalesTableProps {
  productos: ProductoSucursal[]
  canEdit?: boolean
  onEdit?: (producto: ProductoSucursal) => void
}

export function ProductosSucursalesTable({ productos, canEdit = false, onEdit }: ProductosSucursalesTableProps) {
  if (productos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-wine-100/40 bg-wine-50/30 py-16 dark:border-wine-900/20 dark:bg-wine-950/10">
        <div className="text-center">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No hay productos asignados</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">Asigna uno para comenzar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-wine-100/30 bg-white/80 shadow-[0_12px_40px_-18px_rgba(69,10,10,0.18)] backdrop-blur dark:border-wine-900/20 dark:bg-black/30">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-wine-100/40 bg-wine-50/40 dark:border-wine-900/20 dark:bg-wine-950/20">
              <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-100/40">
                Código
              </th>
              <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-100/40">
                Producto
              </th>
              <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-100/40">
                Precio
              </th>
              <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-100/40">
                Disponible
              </th>
              <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-100/40">
                Estado
              </th>
              {canEdit && (
                <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-100/40">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {productos.map((ps) => (
              <tr
                key={`${ps.idProductoFinal}-${ps.idSucursal}`}
                className="border-b border-wine-100/20 transition hover:bg-wine-50/40 dark:border-wine-900/10 dark:hover:bg-wine-900/10"
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{ps.codigoProducto || '-'}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{ps.nombreProducto || 'Sin nombre'}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Bs. {Number(ps.precio || 0).toFixed(2)}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{ps.disponible ? 'Sí' : 'No'}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                      ps.activo
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                    }`}
                  >
                    {ps.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                {canEdit && (
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onEdit?.(ps)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-wine-100/70 hover:text-wine-700 dark:hover:bg-wine-900/20 dark:hover:text-wine-300"
                      title="Editar precio y estado"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
