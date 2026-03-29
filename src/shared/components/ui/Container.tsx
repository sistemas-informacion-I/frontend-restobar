import React, { HTMLAttributes } from 'react'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

/**
 * Container - Componente envolvente para limitar el ancho máximo del contenido
 * Similar a container-div.blade.php en SI1-ferreteria
 */
export const Container: React.FC<ContainerProps> = ({
  maxWidth = 'xl',
  className = '',
  children,
  ...props
}) => {
  const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'w-full',
  }

  return (
    <div
      className={`mx-auto sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
