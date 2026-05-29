import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { CarritoButton } from '@/modules/electronico/pages/CarritoPage'
import { MobileBottomNav } from './MobileBottomNav'
import { Button } from '../ui/Button'
import { useAppStore } from '@/core/store/appStore'
import { Sun, Moon, LogIn } from 'lucide-react'
import { useAuth } from '@/modules/acceso/context/AuthContext'

export function PublicLayout() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useAppStore()
  const { isAuthenticated } = useAuth()

  return (
      <div className="relative flex min-h-screen bg-transparent text-slate-900 dark:text-slate-100">
        <div className="flex min-h-screen flex-1 flex-col w-full">
          <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-wine-100/30 bg-white/70 px-6 backdrop-blur-2xl dark:border-wine-900/10 dark:bg-black/40 md:h-20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg">
                <span className="text-lg font-black">R</span>
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">RestoBar</h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-300/40">Pedidos Online</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CarritoButton />

              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="!rounded-2xl bg-white/50 dark:bg-black/20 hover:!bg-wine-50 transition-all border border-wine-100/30 dark:border-wine-900/10"
                icon={theme === 'dark' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-wine-800" />}
              >
                <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">{theme === 'dark' ? 'Luz' : 'Noche'}</span>
              </Button>

              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  className="!rounded-2xl border border-wine-100/50 bg-white/50 px-4 text-[10px] font-black uppercase tracking-widest dark:border-wine-900/20 dark:bg-black/20"
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="!rounded-2xl border border-wine-100/50 bg-white/50 px-4 text-[10px] font-black uppercase tracking-widest dark:border-wine-900/20 dark:bg-black/20"
                  icon={<LogIn size={16} />}
                >
                  Iniciar Sesión
                </Button>
              )}
            </div>
          </header>

          <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
            <Outlet />
          </main>

          <MobileBottomNav />
        </div>
      </div>
  )
}