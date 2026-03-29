import React, { HTMLAttributes } from 'react'

interface ContainerSecondProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
}

/**
 * ContainerSecond - Componente estilizado con gradiente y efectos
 * Similar a container-second-div.blade.php en SI1-ferreteria
 * Usado para destacar contenido con estilos visuales
 */
export const ContainerSecond: React.FC<ContainerSecondProps> = ({
  hover = true,
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`p-6 sm:p-8 bg-gradient-to-r from-gray-900 via-gray-950 to-gray-800 shadow-xl rounded-lg border-l-4 border-orange-600 ${
        hover ? 'transform hover:scale-[1.01] transition-transform duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
