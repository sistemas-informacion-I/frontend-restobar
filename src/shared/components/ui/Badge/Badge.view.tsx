import type { ReactNode } from 'react'

interface BadgeViewProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'outline'
}

export function BadgeView({ children, className = '', variant = 'default' }: BadgeViewProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'

  const variantClasses = variant === 'outline'
    ? 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
    : ''

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`.trim()}>
      {children}
    </span>
  )
}
