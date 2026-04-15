import { ContainerProps } from './Container'

export function ContainerView({ children, className = '', clean = false }: ContainerProps) {
  if (clean) return <div className={className}>{children}</div>
  
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}
