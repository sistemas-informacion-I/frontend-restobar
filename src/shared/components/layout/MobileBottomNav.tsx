import { useLocation, useNavigate } from 'react-router-dom'
import { Home, ShoppingCart, Package, User, Menu, CalendarDays } from 'lucide-react'
import { useCarrito } from '@/modules/electronico/hooks/useCarrito'

interface MobileBottomNavProps {
  onMenuClick?: () => void
}

const tabs = [
  { path: '/catalogo', label: 'Inicio', icon: Home },
  { path: '/reservas', label: 'Reservas', icon: CalendarDays },
  { path: '/carrito', label: 'Carrito', icon: ShoppingCart, badgeKey: 'carrito' as const },
  { path: '/mis-pedidos', label: 'Pedidos', icon: Package },
  { path: '/perfil', label: 'Perfil', icon: User },
]

export function MobileBottomNav({ onMenuClick }: MobileBottomNavProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { carrito } = useCarrito()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === '/catalogo') return currentPath === '/catalogo' || currentPath === '/'
    return currentPath.startsWith(path)
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-wine-100/30 dark:border-wine-900/30 pb-safe" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around h-16 px-2">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 text-slate-400 dark:text-slate-500 hover:text-wine-600 dark:hover:text-wine-400 transition-colors"
          >
            <Menu size={22} />
            <span className="text-[10px] font-bold">Menú</span>
          </button>
        )}
        {tabs.map((tab) => {
          const active = isActive(tab.path)
          const badgeCount = tab.badgeKey === 'carrito' ? (carrito?.items?.length || 0) : 0

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 transition-all duration-200 ${active ? 'text-wine-700 dark:text-wine-300' : 'text-slate-400 dark:text-slate-500'}`}
            >
              <div className={`relative ${active ? 'scale-110' : ''}`}>
                <tab.icon size={22} strokeWidth={active ? 2.5 : 2} />
                {badgeCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-wine-600 text-[9px] font-black text-white shadow-sm animate-in zoom-in duration-200 px-1">
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold ${active ? 'opacity-100' : 'opacity-60'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
