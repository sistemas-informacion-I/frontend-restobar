import { Eye, Edit2, Trash2 } from 'lucide-react'
import { ProductoFinal } from '../../../services/productosFinales.service'

interface ProductosFinalesTableProps {
  productos: ProductoFinal[]
  onView: (producto: ProductoFinal) => void
  onEdit: (producto: ProductoFinal) => void
  onDelete: (producto: ProductoFinal) => Promise<void>
}

export function ProductosFinalesTable({
  productos,
  onView,
  onEdit,
  onDelete,
}: ProductosFinalesTableProps) {
  if (productos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-wine-100/40 bg-wine-50/30 py-16 dark:border-wine-900/20 dark:bg-wine-950/10">
        <div className="text-center">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No hay productos registrados</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">Crea uno para comenzar</p>
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
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-100/40">
                Descripción
              </th>
              <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-100/40">
                Estado
              </th>
              <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-100/40">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr
                key={producto.idProductoFinal}
                className="border-b border-wine-100/20 transition hover:bg-wine-50/40 dark:border-wine-900/10 dark:hover:bg-wine-900/10"
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{producto.codigo}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{producto.nombre}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="max-w-xs truncate text-sm text-slate-600 dark:text-slate-400">
                    {producto.descripcion || '-'}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                      producto.activo
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                    }`}
                  >
                    {producto.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onView(producto)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-wine-100/70 hover:text-wine-700 dark:hover:bg-wine-900/20 dark:hover:text-wine-300"
                      title="Ver"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(producto)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-wine-100/70 hover:text-wine-700 dark:hover:bg-wine-900/20 dark:hover:text-wine-300"
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(producto)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
