import React, { HTMLAttributes } from 'react'

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
  header?: boolean
  hover?: boolean
}

/**
 * TableRow - Componente para filas de tabla
 * Proporciona estilos consistentes para filas normales y de encabezado
 */
export const TableRow: React.FC<TableRowProps> = ({
  children,
  header = false,
  hover = true,
  className = '',
  ...props
}) => {
  const backgroundClass = header
    ? 'bg-slate-100 dark:bg-slate-800/80'
    : `bg-white dark:bg-slate-900 ${hover ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50' : ''}`

  return (
    <tr className={`${backgroundClass} transition-colors ${className}`} {...props}>
      {children}
    </tr>
  )
}
