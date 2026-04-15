import { Sparkles } from 'lucide-react'
import { AuthBrandHeaderProps } from './AuthBrandHeader'

export function AuthBrandHeaderView({ subtitle }: AuthBrandHeaderProps) {
  return (
    <div className="text-center group">
      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-wine-600 to-wine-900 text-white shadow-2xl shadow-wine-900/30 ring-8 ring-wine-900/5 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
        <Sparkles size={40} className="drop-shadow-lg" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Gaira <span className="text-wine-600">Auth</span></h1>
      <div className="mt-2 flex items-center justify-center gap-2">
        <div className="h-px w-8 bg-wine-200 dark:bg-wine-950" />
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-wine-600/60 dark:text-wine-400/60">{subtitle}</p>
        <div className="h-px w-8 bg-wine-200 dark:bg-wine-950" />
      </div>
    </div>
  )
}
