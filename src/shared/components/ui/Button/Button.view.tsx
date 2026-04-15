import { ReactNode, Ref } from 'react'
import { Loader } from '../Loader'

interface ButtonViewProps {
  children?: ReactNode
  isLoading: boolean
  icon?: ReactNode
  classes: string
  disabled?: boolean
  ref: Ref<HTMLButtonElement>
}

export function ButtonView({
  children,
  isLoading,
  icon,
  classes,
  disabled,
  ref,
  ...props
}: ButtonViewProps) {
  return (
    <button ref={ref} className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <Loader size="sm" />
          <span>Procesando...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex items-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}
