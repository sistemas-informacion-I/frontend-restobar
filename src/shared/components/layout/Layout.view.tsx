import React from 'react'
import { LogOut, Sun, Moon, Menu } from 'lucide-react'
import { Button } from '../ui/Button'
import { Sidebar } from './Sidebar'

interface LayoutViewProps {
  children: React.ReactNode
  theme: 'light' | 'dark'
  toggleTheme: () => void
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  sidebarMinimized: boolean
  setSidebarMinimized: (value: boolean) => void
  handleLogout: () => void
}

export const LayoutView: React.FC<LayoutViewProps> = ({
  children,
  theme,
  toggleTheme,
  sidebarOpen,
  setSidebarOpen,
  sidebarMinimized,
  setSidebarMinimized,
  handleLogout
}) => {
  return (
    <div className="relative flex min-h-screen bg-transparent text-slate-900 dark:text-slate-100">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        sidebarMinimized={sidebarMinimized}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-[99] bg-wine-950/40 backdrop-blur-md transition-opacity md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={`flex min-h-screen flex-1 flex-col transition-all duration-500 ease-in-out ${sidebarMinimized ? 'md:ml-20' : 'md:ml-72'}`}>
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-wine-100/30 bg-white/70 px-6 backdrop-blur-2xl dark:border-wine-900/10 dark:bg-black/40 md:h-20">
          <div className="flex items-center gap-4">
            <button 
              className="rounded-xl p-2.5 text-slate-700 transition-all hover:bg-wine-50 dark:text-slate-200 dark:hover:bg-wine-900/30 md:hidden border border-wine-100/30 dark:border-wine-900/20 shadow-sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            {/* Desktop Toggle Button */}
            <button 
              className="hidden md:flex rounded-xl p-2.5 text-slate-700 transition-all hover:bg-wine-50 dark:text-slate-200 dark:hover:bg-wine-900/30 border border-wine-100/30 dark:border-wine-900/20 shadow-sm"
              onClick={() => setSidebarMinimized(!sidebarMinimized)}
              title={sidebarMinimized ? "Expandir Sidebar" : "Minimizar Sidebar"}
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={toggleTheme}
              className="!rounded-2xl bg-white/50 dark:bg-black/20 hover:!bg-wine-50 transition-all border border-wine-100/30 dark:border-wine-900/10"
              icon={theme === 'dark' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-wine-800" />}
            >
              <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">{theme === 'dark' ? 'Ligero' : 'Oscuro'}</span>
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              icon={<LogOut size={18} />}
              className="!rounded-2xl border-2 border-wine-100/50 hover:!bg-rose-50 hover:!text-rose-600 hover:!border-rose-200 dark:border-wine-900/20 dark:hover:!bg-rose-900/20 text-[10px] font-black uppercase tracking-widest px-6"
            >
              Cerrar Sesión
            </Button>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
