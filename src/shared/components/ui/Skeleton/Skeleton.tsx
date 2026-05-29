function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
import { forwardRef } from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'shimmer' | 'none'
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', width, height, animation = 'shimmer' }, ref) => {
    const variantClasses = {
      text: 'rounded-md',
      circular: 'rounded-full',
      rectangular: 'rounded-xl',
    }

    const animationClasses = {
      pulse: 'animate-pulse',
      shimmer: 'animate-shimmer',
      none: '',
    }

    const sizeStyle: React.CSSProperties = {
      width: width || (variant === 'circular' ? '2.5rem' : '100%'),
      height: height || (variant === 'text' ? '1rem' : variant === 'circular' ? '2.5rem' : '12rem'),
    }

    return (
      <div
        ref={ref}
        className={cn(
          'bg-slate-200 dark:bg-slate-700',
          variantClasses[variant],
          animationClasses[animation],
          className
        )}
        style={sizeStyle}
        aria-hidden="true"
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

function ProductoCardSkeleton() {
  return (
    <div className="rounded-[2rem] border border-wine-100/40 bg-white p-4 shadow-lg dark:border-wine-900/20 dark:bg-black/35">
      <Skeleton variant="rectangular" height={160} className="rounded-2xl" />
      <div className="mt-4 space-y-2">
        <Skeleton variant="text" width="60%" height="1rem" />
        <Skeleton variant="text" width="40%" height="0.75rem" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton variant="text" width="30%" height="1.25rem" />
          <Skeleton variant="text" width="28%" height="2.25rem" className="rounded-xl" />
        </div>
      </div>
    </div>
  )
}

function CarritoItemSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-[1.75rem] border border-wine-100/40 bg-white/70 p-4 dark:border-wine-900/20 dark:bg-black/35">
      <Skeleton variant="rectangular" width={64} height={64} className="rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="70%" height="1rem" />
        <Skeleton variant="text" width="40%" height="0.75rem" />
      </div>
      <Skeleton variant="text" width={60} height="1rem" />
    </div>
  )
}

function PedidoCardSkeleton() {
  return (
    <div className="rounded-[2rem] border border-wine-100/40 bg-white/70 p-6 shadow-lg dark:border-wine-900/20 dark:bg-black/35">
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="text" width="50%" height="1.25rem" />
        <Skeleton variant="text" width="25%" height="1.5rem" className="rounded-full" />
      </div>
      <Skeleton variant="text" width="35%" height="0.75rem" className="mb-2" />
      <Skeleton variant="text" width="45%" height="0.75rem" className="mb-3" />
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width="30%" height="1rem" />
        <Skeleton variant="text" width="20%" height="1rem" />
      </div>
    </div>
  )
}

function TextRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3">
      <Skeleton variant="text" width="30%" height="1rem" />
      <Skeleton variant="text" width="25%" height="1rem" />
    </div>
  )
}

export { Skeleton, ProductoCardSkeleton, CarritoItemSkeleton, PedidoCardSkeleton, TextRowSkeleton }
export type { SkeletonProps }
