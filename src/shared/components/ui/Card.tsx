import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-slate-950/50 ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: CardProps) {
  return (
    <div className={`px-5 pt-5 text-center sm:px-8 sm:pt-8 ${className}`}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = '' }: CardProps) {
  return (
    <div className={`p-5 sm:p-8 ${className}`}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }: CardProps) {
  return (
    <div className={`px-5 pb-5 text-center sm:px-8 sm:pb-8 ${className}`}>
      {children}
    </div>
  )
}
