import { Card, CardContent } from '@/shared/components/ui/Card'
import { AuthStatusCardProps } from './AuthStatusCard'

export function AuthStatusCardView({ icon, title, message, action }: AuthStatusCardProps) {
  return (
    <Card className="glass-card rounded-[2.5rem] border-2 border-wine-100/50 shadow-2xl shadow-wine-900/5">
      <CardContent>
        <div className="py-8 text-center">
          <div className="mb-8 inline-flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-wine-500/10 to-wine-900/10 text-wine-600 dark:text-wine-400 border-2 border-wine-100/50 dark:border-wine-900/20">{icon}</div>
          <h2 className="mb-4 text-3xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
          <p className="mb-10 text-xs font-bold uppercase tracking-widest leading-loose text-slate-400 dark:text-slate-500 max-w-sm mx-auto">{message}</p>
          <div className="flex justify-center">
            {action}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
