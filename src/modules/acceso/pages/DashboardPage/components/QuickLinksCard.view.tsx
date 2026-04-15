import { LayoutDashboard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { QuickLinksCardProps } from './QuickLinksCard'

export function QuickLinksCardView({ links }: QuickLinksCardProps) {
  return (
    <div className="glass-card rounded-[2.5rem] p-8 shadow-2xl shadow-wine-900/5 h-full relative overflow-hidden group/quick transition-all duration-700 hover:shadow-wine-900/10">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-gradient-to-br from-wine-600/5 to-transparent blur-2xl group-hover/quick:scale-150 transition-transform duration-1000" />
      
      <div className="flex flex-col gap-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-4 w-1.5 rounded-full bg-gradient-to-b from-wine-600 to-wine-900" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 font-sans">
            Acceso Directo (Módulos)
          </h3>
        </div>

        {links.length > 0 ? (
          <div className="grid grid-cols-1 gap-5">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center gap-6 rounded-3xl bg-white/40 p-5 transition-all duration-500 hover:bg-white/80 dark:bg-black/20 dark:hover:bg-wine-900/10 border border-wine-100/30 dark:border-wine-900/10 group/link hover:-translate-y-2 hover:shadow-2xl hover:shadow-wine-900/10 backdrop-blur-sm"
              >
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-xl shadow-wine-900/40 group-hover/link:rotate-6 transition-transform duration-500 border border-white dark:border-wine-800`}>
                  <link.icon size={24} />
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-none">{link.title}</span>
                  <span className="text-[10px] font-black text-wine-600 dark:text-wine-400 uppercase tracking-widest opacity-60 group-hover/link:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis">{link.description}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[2rem] bg-wine-50/5 py-16 dark:bg-black/20 border-2 border-dashed border-wine-100/50 dark:border-wine-900/20">
            <div className="h-20 w-20 flex items-center justify-center rounded-full bg-wine-50/50 dark:bg-wine-900/10 border border-white/20 mb-4 animate-pulse">
              <LayoutDashboard className="text-wine-200 dark:text-wine-900/40" size={40} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-300 dark:text-wine-900/60 px-8 text-center leading-relaxed">
              Módulos de seguridad<br/>con acceso restringido
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
