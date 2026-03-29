import { ComponentType } from 'react'
import { LayoutDashboard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/shared/components/ui/Card'

interface QuickLink {
  title: string
  description: string
  icon: ComponentType<{ size?: string | number }>
  href: string
  color: string
}

interface QuickLinksCardProps {
  links: QuickLink[]
}

export function QuickLinksCard({ links }: QuickLinksCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-4">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
            <LayoutDashboard size={20} />
            Accesos Rápidos
          </h3>

          {links.length > 0 ? (
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center gap-4 rounded-xl border border-transparent bg-slate-100 p-4 transition hover:border-indigo-400/30 hover:bg-indigo-50/60 dark:bg-slate-800/70 dark:hover:bg-indigo-950/30"
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${link.color}`}>
                    <link.icon size={24} />
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{link.title}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{link.description}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-slate-100 px-4 py-8 text-center text-sm text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
              No tienes permisos para acceder a módulos adicionales.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
