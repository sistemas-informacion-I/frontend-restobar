import React, { HTMLAttributes } from 'react'
import { TableRowView } from './TableRow.view'

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
  header?: boolean
  hover?: boolean
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  header = false,
  hover = true,
  className = '',
  ...props
}) => {
  const backgroundClass = header
    ? 'bg-wine-50/30 dark:bg-wine-950/20'
    : `bg-transparent ${hover ? 'hover:bg-wine-50/30 dark:hover:bg-wine-900/10' : ''}`

  const classes = `${backgroundClass} transition-colors ${className}`

  return TableRowView({ children, classes, ...props })
}
