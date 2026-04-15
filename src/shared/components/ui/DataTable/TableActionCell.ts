import React from 'react'
import { TableActionCellView } from './TableActionCell.view'

export interface TableActionCellProps {
  onEdit?: () => void
  onDelete?: () => void
  editLabel?: string
  deleteLabel?: string
}

export const TableActionCell: React.FC<TableActionCellProps> = ({
  onEdit,
  onDelete,
  editLabel = 'Edit',
  deleteLabel = 'Delete',
}) => {
  return TableActionCellView({
    onEdit,
    onDelete,
    editLabel,
    deleteLabel
  })
}
