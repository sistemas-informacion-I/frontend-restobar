import { Package, MessageSquare } from 'lucide-react'
import { SkeletonLoading } from './SkeletonLoading.view'
import type { Comanda, ProductoVenta } from '@/modules/comercial/models/ventaPresencial.model'

interface VentaDetalleProps {
  comanda: Comanda
  productos: ProductoVenta[]
  productosLoading: boolean
}

export function VentaDetalle({ comanda, productos, productosLoading }: VentaDetalleProps) {
  return (
    <div className="rounded-2xl border-2 border-wine-100/50 bg-white/50 backdrop-blur-sm dark:bg-black/20 dark:border-wine-900/30 shadow-md">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-wine-100/50 dark:border-wine-900/30">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-wine-600/10 text-wine-600 dark:bg-wine-500/10 dark:text-wine-400">
          <Package size={16} />
        </div>
        <div>
          <p className="text-sm font-black text-slate-900 dark:text-white">
            {comanda.numeroComanda} — {comanda.mesa}
          </p>
          {comanda.sucursal && (
            <p className="text-[10px] font-bold text-wine-900/40 dark:text-wine-400/40">
              {comanda.sucursal}
            </p>
          )}
          <p className="text-[10px] font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">
            {comanda.cliente}
          </p>
        </div>
      </div>

      <div className="divide-y divide-wine-100/50 dark:divide-wine-900/30">
        {productosLoading ? (
          <div className="p-5">
            <SkeletonLoading />
          </div>
        ) : productos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">
              Sin productos
            </p>
          </div>
        ) : (
          productos.map((producto) => (
            <div key={producto.idProducto} className="px-5 py-3 hover:bg-wine-50/50 dark:hover:bg-wine-900/10 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {producto.nombre}
                    </span>
                    <span className="text-[10px] font-bold text-wine-900/40 dark:text-wine-400/40">
                      x{producto.cantidad}
                    </span>
                  </div>
                  {producto.observaciones && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <MessageSquare size={10} className="text-wine-900/30 dark:text-wine-400/30 shrink-0" />
                      <span className="text-[10px] font-semibold text-wine-900/50 dark:text-wine-400/50 italic">
                        {producto.observaciones}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[10px] font-bold text-wine-900/40 dark:text-wine-400/40">
                    Bs {producto.precioUnitario.toFixed(2)}
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white min-w-[70px] text-right">
                    Bs {producto.subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
