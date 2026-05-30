import { ShoppingCart } from 'lucide-react'
import { useCarrito } from "@/modules/electronico/hooks/useCarrito"
import { useEffect, useRef, useState } from 'react'

export function CarritoButton() {
  const { openCarrito, totalItems } = useCarrito()
  const [bounce, setBounce] = useState(false)
  const prevTotal = useRef(totalItems)

  useEffect(() => {
    if (totalItems > prevTotal.current) {
      setBounce(true)
      const t = setTimeout(() => setBounce(false), 500)
      prevTotal.current = totalItems
      return () => clearTimeout(t)
    }
    prevTotal.current = totalItems
  }, [totalItems])

  return (
    <button
      onClick={openCarrito}
      className={`relative flex h-9 w-9 items-center justify-center rounded-xl border border-wine-100/50 bg-white/50 text-slate-500 shadow-sm transition-all hover:border-wine-300 hover:bg-wine-50 hover:text-wine-700 dark:border-wine-900/30 dark:bg-black/20 dark:hover:border-wine-700/30 dark:hover:bg-wine-900/20 dark:hover:text-wine-300 ${bounce ? 'animate-bounce' : ''}`}
      title="Ver carrito"
    >
      <ShoppingCart size={17} />
      {totalItems > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine-600 px-1 text-[9px] font-black text-white shadow-md shadow-wine-900/30 animate-in zoom-in duration-200">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  )
}
