import React, { TdHTMLAttributes } from 'react'

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
  header?: boolean
}

/**
 * TableCell - Componente para celdas de tabla
 * Compatible con <td> y <th>
 */
export const TableCell: React.FC<TableCellProps> = ({
  children,
  align = 'left',
  header = false,
  className = '',
  ...props
}) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align]

  const baseClass =
    'border-b border-slate-200 px-3 py-3 dark:border-slate-700'
  const headerClass = 'bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-800/80 dark:text-slate-200'
  const cellClass = 'text-sm text-slate-900 dark:text-slate-100'

  if (header) {
    return (
      <th
        className={`${baseClass} ${headerClass} ${alignClass} ${className}`}
        {...props}
      >
        {children}
      </th>
    )
  }

  return (
    <td
      className={`${baseClass} ${cellClass} ${alignClass} ${className}`}
      {...props}
    >
      {children}
    </td>
  )
}
