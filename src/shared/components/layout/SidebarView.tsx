import React from 'react'
import { Link } from 'react-router-dom'
import { X, Sparkles, ChevronDown } from 'lucide-react'

interface SidebarViewProps {
  user: any
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  sidebarMinimized: boolean
  navSections: Array<{ 
    title: string; 
    items: Array<{ path: string; label: string; icon: any; show: boolean }> 
  }>
  expandedSections: Record<string, boolean>
  toggleSection: (title: string) => void
  currentPath: string
}

export const SidebarView: React.FC<SidebarViewProps> = ({
  user,
  sidebarOpen,
  setSidebarOpen,
  sidebarMinimized,
  navSections,
  expandedSections,
  toggleSection,
  currentPath
}) => {
  return (
    <aside className={`fixed inset-y-0 left-0 z-[100] flex flex-col border-r border-wine-100/50 bg-white/70 backdrop-blur-2xl transition-all duration-500 ease-in-out dark:border-wine-900/30 dark:bg-black/60 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-[20px_0_40px_-15px_rgba(76,5,25,0.05)] no-scrollbar ${sidebarMinimized ? 'w-20' : 'w-72'}`}>
      <div className={`flex items-center border-b border-wine-100/30 p-8 dark:border-wine-900/10 transition-all duration-500 ${sidebarMinimized ? 'justify-center px-4' : 'gap-4'}`}>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-xl shadow-wine-900/40 rotate-3 group hover:rotate-0 transition-transform duration-300">
          <Sparkles size={24} className="animate-pulse" />
        </div>
        {!sidebarMinimized && (
          <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-500">
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">LA GAIRA</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-wine-600 dark:text-wine-400">RESTOBAR</span>
          </div>
        )}
        <button 
          className="ml-auto rounded-xl p-2.5 text-slate-400 transition-all hover:bg-wine-50 hover:text-wine-900 dark:hover:bg-wine-900/30 dark:hover:text-wine-100 md:hidden border border-transparent hover:border-wine-100/50"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      <nav className={`flex flex-1 flex-col gap-6 overflow-y-auto no-scrollbar transition-all duration-500 ${sidebarMinimized ? 'p-4' : 'p-6'}`}>
        {navSections.map((section, sidx) => {
          const isExpanded = expandedSections[section.title]
          
          return (
            <div key={sidx} className="flex flex-col gap-2">
              {!sidebarMinimized ? (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between px-5 text-[11px] font-black uppercase tracking-[0.3em] text-wine-900/60 dark:text-wine-100/40 mb-2 group hover:text-wine-600 dark:hover:text-wine-400 transition-colors animate-in fade-in duration-500"
                >
                  {section.title}
                  <div className={`transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`}>
                    <ChevronDown size={14} className="opacity-40 group-hover:opacity-100" />
                  </div>
                </button>
              ) : (
                <div className="h-px bg-wine-100/30 dark:bg-wine-900/20 mx-2 mb-2" />
              )}
              
              <div className={`flex flex-col gap-1.5 overflow-hidden transition-all duration-500 ease-in-out ${
                isExpanded || sidebarMinimized ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                {section.items.filter(item => item.show).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={sidebarMinimized ? item.label : ''}
                    className={`flex items-center rounded-2xl transition-all duration-300 group ${sidebarMinimized ? 'justify-center p-4' : 'gap-4 px-5 py-4'} ${currentPath === item.path 
                      ? 'bg-gradient-to-r from-wine-700 to-wine-950 text-white shadow-[0_10px_25px_-5px_rgba(76,5,25,0.4)] scale-[1.05] z-10' 
                      : 'text-slate-400 hover:bg-wine-50/50 hover:text-wine-900 dark:text-slate-500 dark:hover:bg-wine-900/20 dark:hover:text-wine-100'}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className={`shrink-0 transition-colors ${currentPath === item.path ? 'text-wine-200' : 'text-inherit opacity-60'}`}>
                      <item.icon size={20} strokeWidth={currentPath === item.path ? 3 : 2} />
                    </div>
                    {!sidebarMinimized && (
                      <span className="text-[12px] font-black uppercase tracking-widest truncate animate-in fade-in slide-in-from-left-2 duration-500">{item.label}</span>
                    )}
                    {currentPath === item.path && !sidebarMinimized && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </nav>

      <div className={`mt-auto border-t border-wine-100/30 dark:border-wine-900/10 transition-all duration-500 ${sidebarMinimized ? 'p-4' : 'p-8'}`}>
        <div className={`flex items-center rounded-3xl bg-wine-50/30 dark:bg-wine-900/10 border border-wine-100/50 dark:border-wine-900/20 transition-all duration-500 ${sidebarMinimized ? 'justify-center p-2' : 'gap-4 p-4'}`}>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-900 text-sm font-black text-white shadow-lg shadow-wine-900/30 border-2 border-white dark:border-wine-800">
            {user?.nombre?.charAt(0).toUpperCase() || 'U'}
          </div>
          {!sidebarMinimized && (
            <div className="flex min-w-0 flex-col gap-0.5 animate-in fade-in slide-in-from-left-2 duration-500">
              <span className="truncate text-sm font-black text-slate-900 dark:text-white tracking-tighter">{user?.nombre}</span>
              <span className="truncate text-[9px] font-black uppercase tracking-[0.1em] text-wine-600 dark:text-wine-400">{user?.tipoUsuario === 'S' ? 'Superuser' : 'Personal'}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
