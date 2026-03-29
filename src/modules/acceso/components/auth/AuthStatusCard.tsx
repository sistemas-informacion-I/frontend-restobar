import { ReactNode } from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'

interface AuthStatusCardProps {
  icon: ReactNode
  title: string
  message: string
  action?: ReactNode
}

export function AuthStatusCard({ icon, title, message, action }: AuthStatusCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="py-4 text-center">
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full">{icon}</div>
          <h2 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          <p className="mb-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{message}</p>
          {action}
        </div>
      </CardContent>
    </Card>
  )
}
