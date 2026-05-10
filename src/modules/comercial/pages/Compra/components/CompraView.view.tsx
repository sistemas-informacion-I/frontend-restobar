import { CompraResponse, EstadoPago } from '@/modules/comercial/services/compras.service'
import { ShoppingCart, Hash, User, Building2, Calendar, FileText } from 'lucide-react'

interface CompraViewProps {
  compra: CompraResponse
}

const ESTADO_STYLES: Record<EstadoPago, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/30',
  PAGADO: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/30',
  PARCIAL: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-900/30',
  VENCIDO: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-900/30',
}

export function CompraView({ compra }: CompraViewProps) {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col items-center gap-6 border-b border-wine-100/30 pb-8 text-center sm:flex-row sm:items-start sm:text-left">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-2xl shadow-wine-900/30 ring-4 ring-white dark:ring-wine-900/20">
          <ShoppingCart size={48} />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
            Compra N° {compra.nroFactura}
          </h3>
          <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
            <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${ESTADO_STYLES[compra.estadoPago]}`}>
              <div className={`h-1.5 w-1.5 rounded-full ${compra.estadoPago === 'PAGADO' ? 'bg-green-500 animate-pulse' : 'bg-current'}`} />
              {compra.estadoPago}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard icon={<Building2 size={20} />} label="Proveedor" value={compra.nombreProveedor} />
        <InfoCard icon={<User size={20} />} label="Empleado" value={compra.nombreEmpleado} />
        <InfoCard icon={<Hash size={20} />} label="N° Factura" value={compra.nroFactura} />
        <InfoCard icon={<Calendar size={20} />} label="Fecha de Compra" value={compra.fechaCompra} />
        {compra.fechaEntregaProgramada && (
          <InfoCard icon={<Calendar size={20} />} label="Fecha Entrega Programada" value={compra.fechaEntregaProgramada} />
        )}
        {compra.fechaEntregaReal && (
          <InfoCard icon={<Calendar size={20} />} label="Fecha Entrega Real" value={compra.fechaEntregaReal} />
        )}
        {compra.fechaLimitePago && (
          <InfoCard icon={<Calendar size={20} />} label="Fecha Límite Pago" value={compra.fechaLimitePago} />
        )}
        {compra.fechaPago && (
          <InfoCard icon={<Calendar size={20} />} label="Fecha Pago" value={compra.fechaPago} />
        )}
        {compra.observaciones && (
          <div className="md:col-span-2">
            <InfoCard icon={<FileText size={20} />} label="Observaciones" value={compra.observaciones} />
          </div>
        )}
      </div>

      <div className="border-t border-wine-100/30 pt-6 dark:border-wine-900/10">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-wine-900/40 dark:text-wine-100/30 mb-4 flex items-center gap-2">
          Detalles de la Compra
          <div className="h-px flex-1 bg-wine-100/50 dark:bg-wine-900/20" />
        </h4>

        <div className="overflow-hidden rounded-[2rem] border border-wine-100/30 dark:border-wine-900/20">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-wine-50/50 dark:bg-wine-950/20 border-b border-wine-100/30 dark:border-wine-900/20">
                <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-wine-900/50">Producto</th>
                <th className="px-5 py-4 text-right text-[10px] font-black uppercase tracking-widest text-wine-900/50">Cantidad</th>
                <th className="px-5 py-4 text-right text-[10px] font-black uppercase tracking-widest text-wine-900/50">Precio Unit.</th>
                <th className="px-5 py-4 text-right text-[10px] font-black uppercase tracking-widest text-wine-900/50">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wine-50 dark:divide-wine-950/30">
              {compra.detalles.map((d) => (
                <tr key={d.idDetalleCompra} className="hover:bg-wine-50/30 dark:hover:bg-wine-900/10">
                  <td className="px-5 py-3 text-sm font-bold text-slate-800 dark:text-slate-200">{d.nombreProducto}</td>
                  <td className="px-5 py-3 text-right text-sm font-bold text-slate-600 dark:text-slate-300">{d.cantidad}</td>
                  <td className="px-5 py-3 text-right text-sm font-bold text-slate-600 dark:text-slate-300">Bs {d.precioUnitario.toFixed(2)}</td>
                  <td className="px-5 py-3 text-right text-sm font-bold text-slate-800 dark:text-slate-200">Bs {d.subTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 ml-auto w-full max-w-xs space-y-2 rounded-[1.75rem] bg-wine-50/30 p-5 dark:bg-wine-950/20">
          <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>SubTotal</span>
            <span>Bs {compra.subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Descuento</span>
            <span>Bs {compra.descuento.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Impuesto</span>
            <span>Bs {compra.impuesto.toFixed(2)}</span>
          </div>
          <div className="border-t border-wine-100/30 pt-2 flex justify-between text-sm font-black text-slate-900 dark:text-white">
            <span>Total</span>
            <span>Bs {compra.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="group flex items-start gap-4 rounded-[1.75rem] border border-wine-100/30 bg-white/50 p-5 transition-all hover:bg-white dark:border-wine-900/20 dark:bg-wine-950/20 dark:hover:bg-black/40">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-wine-50 text-wine-600 shadow-sm transition-colors group-hover:bg-wine-600 group-hover:text-white dark:bg-wine-900/20 dark:text-wine-400">
        {icon}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-wine-900/30 dark:text-wine-100/20">{label}</span>
        <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight break-words">{value}</span>
      </div>
    </div>
  )
}
