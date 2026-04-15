import React from 'react'

interface TableCellViewProps {
  children: React.ReactNode
  header: boolean
  classes: string
  [key: string]: any
}

export const TableCellView: React.FC<TableCellViewProps> = ({
  children,
  header,
  classes,
  ...props
}) => {
  if (header) {
    return (
      <th className={classes} {...props}>
        {children}
      </th>
    )
  }

  return (
    <td className={classes} {...props}>
      {children}
    </td>
  )
}
