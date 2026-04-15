import { LoaderView } from './Loader.view'

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
}

export function Loader(props: LoaderProps) {
  const { size = 'md' } = props
  const sizeClasses: Record<NonNullable<LoaderProps['size']>, string> = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-[3px]',
    lg: 'h-10 w-10 border-4',
  }

  const classes = `animate-spin rounded-full border-wine-100/50 border-t-wine-600 dark:border-wine-900/40 dark:border-t-wine-400 ${sizeClasses[size]}`

  return LoaderView({ classes })
}
