import { Wallet, CreditCard, Smartphone, Banknote } from 'lucide-react'
import type { MetodoPagoResponse } from '@/modules/comercial/models/ventaPresencial.model'

interface MetodoPagoProps {
  metodoPagoId: number
  onMetodoPagoChange: (id: number) => void
  metodosPago: MetodoPagoResponse[]
}

function getIcon(nombre: string): React.FC<any> {
  const name = nombre.toLowerCase()
  if (name.includes('efectivo')) return Wallet
  if (name.includes('tarjeta') || name.includes('débito') || name.includes('credito')) return CreditCard
  if (name.includes('qr') || name.includes('movil')) return Smartphone
  return Banknote
}

export function MetodoPago({ metodoPagoId, onMetodoPagoChange, metodosPago }: MetodoPagoProps) {
  const activos = metodosPago.filter((m) => m.activo)

  return (
    <div className="rounded-2xl border-2 border-wine-100/50 bg-white/50 backdrop-blur-sm dark:bg-black/20 dark:border-wine-900/30 shadow-md">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-wine-100/50 dark:border-wine-900/30">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600/10 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
          <Wallet size={16} />
        </div>
        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Método de Pago
        </p>
      </div>

      <div className="px-5 py-4">
        <div className="grid grid-cols-3 gap-3">
          {activos.map(({ idMetodoPago, nombre, descripcion }) => {
            const Icon = getIcon(nombre)
            return (
              <button
                key={idMetodoPago}
                type="button"
                onClick={() => onMetodoPagoChange(idMetodoPago)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all cursor-pointer ${
                  metodoPagoId === idMetodoPago
                    ? 'border-wine-500 bg-wine-50 shadow-lg shadow-wine-900/10 dark:bg-wine-900/20 dark:border-wine-600'
                    : 'border-wine-100/50 hover:border-wine-300 hover:bg-wine-50/50 dark:border-wine-900/30 dark:hover:border-wine-700 dark:hover:bg-wine-900/10'
                }`}
              >
                <Icon size={24} className={`${
                  metodoPagoId === idMetodoPago
                    ? 'text-wine-600 dark:text-wine-400'
                    : 'text-wine-900/40 dark:text-wine-400/40'
                }`} />
                <span className={`text-[10px] font-black uppercase tracking-wider ${
                  metodoPagoId === idMetodoPago
                    ? 'text-wine-600 dark:text-wine-400'
                    : 'text-wine-900/50 dark:text-wine-400/50'
                }`}>
                  {nombre}
                </span>
                {descripcion && (
                  <span className="text-[8px] font-bold text-wine-900/30 dark:text-wine-400/30">
                    {descripcion}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
