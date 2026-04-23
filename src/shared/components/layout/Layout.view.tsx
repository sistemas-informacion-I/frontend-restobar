import React from 'react'
import { Link } from 'react-router-dom'
import { LogOut, X, Sun, Moon, Sparkles, Menu, ChevronDown } from 'lucide-react'
import { Button } from '../ui/Button'

interface LayoutViewProps {
  children: React.ReactNode
  user: any
  theme: 'light' | 'dark'
  toggleTheme: () => void
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  handleLogout: () => void
  navSections: Array<{ 
    title: string; 
    items: Array<{ path: string; label: string; icon: any; show: boolean }> 
  }>
  expandedSections: Record<string, boolean>
  toggleSection: (title: string) => void
  currentPath: string
}

export const LayoutView: React.FC<LayoutViewProps> = ({
  children,
  user,
  theme,
  toggleTheme,
  sidebarOpen,
  setSidebarOpen,
  handleLogout,
  navSections,
  expandedSections,
  toggleSection,
  currentPath
}) => {
  return (
    <div className="relative flex min-h-screen bg-transparent text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[100] flex w-72 flex-col border-r border-wine-100/50 bg-white/70 backdrop-blur-2xl transition-all duration-500 ease-in-out dark:border-wine-900/30 dark:bg-black/60 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-[20px_0_40px_-15px_rgba(76,5,25,0.05)]`}>
        <div className="flex items-center gap-4 border-b border-wine-100/30 p-8 dark:border-wine-900/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-xl shadow-wine-900/40 rotate-3 group hover:rotate-0 transition-transform duration-300">
            <Sparkles size={24} className="animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">LA GAIRA</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-wine-600 dark:text-wine-400">RESTOBAR</span>
          </div>
          <button 
            className="ml-auto rounded-xl p-2.5 text-slate-400 transition-all hover:bg-wine-50 hover:text-wine-900 dark:hover:bg-wine-900/30 dark:hover:text-wine-100 md:hidden border border-transparent hover:border-wine-100/50"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-6 p-6 overflow-y-auto custom-scrollbar">
          {navSections.map((section, sidx) => {
            const isExpanded = expandedSections[section.title]
            
            return (
              <div key={sidx} className="flex flex-col gap-2">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between px-5 text-[11px] font-black uppercase tracking-[0.3em] text-wine-900/60 dark:text-wine-100/40 mb-2 group hover:text-wine-600 dark:hover:text-wine-400 transition-colors"
                >
                  {section.title}
                  <div className={`transition-transform duration-500 ${isExpanded ? '' : '-rotate-90'}`}>
                    <ChevronDown size={14} className="opacity-40 group-hover:opacity-100" />
                  </div>
                </button>
                
                <div className={`flex flex-col gap-1.5 overflow-hidden transition-all duration-500 ease-in-out ${
                  isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {section.items.filter(item => item.show).map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-[12px] font-black uppercase tracking-widest transition-all duration-500 group ${currentPath === item.path 
                        ? 'bg-gradient-to-r from-wine-700 to-wine-950 text-white shadow-[0_10px_25px_-5px_rgba(76,5,25,0.4)] scale-[1.05] z-10' 
                        : 'text-slate-400 hover:bg-wine-50/50 hover:text-wine-900 dark:text-slate-500 dark:hover:bg-wine-900/20 dark:hover:text-wine-100'}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className={`p-1 rounded-lg transition-colors ${currentPath === item.path ? 'text-wine-200' : 'text-inherit opacity-60'}`}>
                        <item.icon size={18} strokeWidth={currentPath === item.path ? 3 : 2} />
                      </div>
                      <span>{item.label}</span>
                      {currentPath === item.path && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </nav>

        <div className="mt-auto border-t border-wine-100/30 p-8 dark:border-wine-900/10">
          <div className="flex items-center gap-4 p-4 rounded-3xl bg-wine-50/30 dark:bg-wine-900/10 border border-wine-100/50 dark:border-wine-900/20">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-900 text-sm font-black text-white shadow-lg shadow-wine-900/30 border-2 border-white dark:border-wine-800">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-sm font-black text-slate-900 dark:text-white tracking-tighter">{user?.name}</span>
              <span className="truncate text-[9px] font-black uppercase tracking-[0.1em] text-wine-600 dark:text-wine-400">{user?.roles?.[0]?.name || 'Nivel 0'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-[99] bg-wine-950/40 backdrop-blur-md transition-opacity md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col md:ml-72 transition-all duration-500">
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-wine-100/30 bg-white/70 px-6 backdrop-blur-2xl dark:border-wine-900/10 dark:bg-black/40 md:h-20 md:justify-end">
          <button 
            className="rounded-xl p-2.5 text-slate-700 transition-all hover:bg-wine-50 dark:text-slate-200 dark:hover:bg-wine-900/30 md:hidden border border-wine-100/30 dark:border-wine-900/20 shadow-sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
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
