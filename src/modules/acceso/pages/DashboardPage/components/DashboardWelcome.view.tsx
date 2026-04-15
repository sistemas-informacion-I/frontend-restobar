import { DashboardWelcomeProps } from './DashboardWelcome'

export function DashboardWelcomeView({ userName }: DashboardWelcomeProps) {
  return (
    <div className="text-left animate-in slide-in-from-left duration-700 ease-out">
      <h1 className="mb-3 text-4xl font-black text-slate-900 dark:text-white sm:text-5xl tracking-tighter">
        ¡Excelente día,{' '}
        <span className="bg-gradient-to-r from-wine-600 via-wine-800 to-wine-950 bg-clip-text text-transparent drop-shadow-sm">{userName}</span>!
      </h1>
      <div className="flex items-center gap-4">
        <div className="h-1 w-12 bg-gradient-to-r from-wine-600 to-transparent rounded-full" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-wine-900/40 dark:text-wine-400/30">Intelligence Center • Master Control</p>
      </div>
    </div>
  )
}
