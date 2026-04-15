import React from 'react'

interface TableRowViewProps {
  children: React.ReactNode
  classes: string
  [key: string]: any
}

export const TableRowView: React.FC<TableRowViewProps> = ({
  children,
  classes,
  ...props
}) => (
  <tr className={classes} {...props}>
    {children}
  </tr>
)
