import { CardProps } from './Card'

export function CardView({ children, className = '' }: CardProps) {
  return (
    <div className={`overflow-hidden rounded-3xl glass-card shadow-2xl shadow-wine-900/5 ${className}`}>
      {children}
    </div>
  )
}

export function CardHeaderView({ children, className = '' }: CardProps) {
  return (
    <div className={`px-5 pt-5 text-center sm:px-8 sm:pt-8 ${className}`}>
      {children}
    </div>
  )
}

export function CardContentView({ children, className = '' }: CardProps) {
  return (
    <div className={`p-5 sm:p-8 ${className}`}>
      {children}
    </div>
  )
}

export function CardFooterView({ children, className = '' }: CardProps) {
  return (
    <div className={`px-5 pb-5 text-center sm:px-8 sm:pb-8 ${className}`}>
      {children}
    </div>
  )
}
