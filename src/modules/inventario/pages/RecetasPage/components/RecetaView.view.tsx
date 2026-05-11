import type { Receta } from '../../../services/recetas.service'

interface RecetaViewProps {
  receta: Receta
}

export function RecetaView({ receta }: RecetaViewProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-wine-100/40 bg-wine-50/40 p-4 dark:border-wine-900/20 dark:bg-wine-900/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-wine-700 dark:text-wine-300">Receta</p>
          <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{receta.nombre}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{receta.versionEtiqueta || 'Sin version'}</p>
        </div>

        <div className="rounded-xl border border-wine-100/40 bg-wine-50/40 p-4 dark:border-wine-900/20 dark:bg-wine-900/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-wine-700 dark:text-wine-300">Producto Final</p>
          <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{receta.nombreProductoFinal}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Sucursal referencia: {receta.nombreSucursalReferencia}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-900/40">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tiempo</p>
          <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">{receta.tiempoPreparacion || 0} min</p>
        </div>
        <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-900/40">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Costo</p>
          <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
            {receta.costoTotal !== undefined && receta.costoTotal !== null ? `Bs ${Number(receta.costoTotal).toFixed(2)}` : '-'}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-900/40">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Estado</p>
          <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">{receta.activo ? 'Activa' : 'Inactiva'}</p>
        </div>
      </div>

      {receta.descripcion && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Descripcion</p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{receta.descripcion}</p>
        </div>
      )}

      {receta.instrucciones && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Instrucciones</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{receta.instrucciones}</p>
        </div>
      )}

      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ingredientes ({receta.ingredientes?.length || 0})</p>
        <div className="mt-2 overflow-x-auto rounded-xl border border-wine-100/40 dark:border-wine-900/20">
          <table className="min-w-full divide-y divide-wine-100/30 dark:divide-wine-900/20">
            <thead className="bg-wine-50/70 dark:bg-wine-900/20">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-black uppercase tracking-widest text-wine-800/70 dark:text-wine-300/70">Insumo</th>
                <th className="px-3 py-2 text-right text-[10px] font-black uppercase tracking-widest text-wine-800/70 dark:text-wine-300/70">Cantidad</th>
                <th className="px-3 py-2 text-center text-[10px] font-black uppercase tracking-widest text-wine-800/70 dark:text-wine-300/70">Unidad</th>
                <th className="px-3 py-2 text-left text-[10px] font-black uppercase tracking-widest text-wine-800/70 dark:text-wine-300/70">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wine-100/30 dark:divide-wine-900/20">
              {(receta.ingredientes || []).map((item, idx) => (
                <tr key={`${item.idInventario}-${idx}`}>
                  <td className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300">{item.nombreInventario || `Insumo #${item.idInventario}`}</td>
                  <td className="px-3 py-2 text-right text-sm font-bold text-slate-800 dark:text-slate-200">{Number(item.cantidad || 0).toFixed(3)}</td>
                  <td className="px-3 py-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">{item.unidadMedida}</td>
                  <td className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400">{item.notas || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
