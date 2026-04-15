import { ContainerSecondProps } from './ContainerSecond'

export function ContainerSecondView({ children, className = '' }: ContainerSecondProps) {
  return (
    <div className={`mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}
