interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
}

export function Loader({ size = 'md' }: LoaderProps) {
  const sizeClasses: Record<NonNullable<LoaderProps['size']>, string> = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-[3px]',
    lg: 'h-10 w-10 border-4',
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-400 ${sizeClasses[size]}`}></div>
    </div>
  )
}
