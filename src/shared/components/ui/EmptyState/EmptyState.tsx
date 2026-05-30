import { ShoppingBag, ShoppingCart, Package, Clock, Search, Coffee } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '../Button'
import { type ReactNode } from 'react'

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

interface EmptyStateProps {
  icon?: 'cart' | 'orders' | 'package' | 'search' | 'clock' | 'cafe'
  customIcon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  illustration?: ReactNode
  className?: string
}

const iconMap: Record<string, LucideIcon> = {
  cart: ShoppingCart,
  orders: ShoppingBag,
  package: Package,
  search: Search,
  clock: Clock,
  cafe: Coffee,
}

export function EmptyState({
  icon = 'package',
  customIcon,
  title,
  description,
  action,
  secondaryAction,
  illustration,
  className,
}: EmptyStateProps) {
  const Icon = customIcon || iconMap[icon] || Package

  return (
    <div className={cn(
      'flex flex-col items-center justify-center gap-4 py-16 px-4 text-center',
      className
    )}>
      {illustration || (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-wine-50 dark:bg-wine-950/50">
          <Icon size={42} className="text-wine-400 dark:text-wine-500" />
        </div>
      )}

      <div className="max-w-xs space-y-2">
        <h3 className="text-lg font-black tracking-tighter text-slate-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition-all hover:border-wine-300 hover:text-wine-700 dark:border-slate-700 dark:text-slate-400 dark:hover:border-wine-700 dark:hover:text-wine-400"
          >
            {secondaryAction.label}
          </button>
        )}
        {action && (
          <Button onClick={action.onClick} icon={<Icon size={16} />}>
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
}
