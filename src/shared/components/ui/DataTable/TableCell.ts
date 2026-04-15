import React, { TdHTMLAttributes } from 'react'
import { TableCellView } from './TableCell.view'

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
  header?: boolean
}

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

  const baseClass = 'border-b border-wine-100/50 px-6 py-4 dark:border-wine-900/20'
  const headerClass = 'bg-wine-50/30 text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:bg-wine-950/20 dark:text-wine-300/60'
  const cellClass = 'text-sm font-medium text-slate-500 dark:text-slate-400'

  const classes = `${baseClass} ${header ? headerClass : cellClass} ${alignClass} ${className}`

  return TableCellView({ children, header, classes, ...props })
}
