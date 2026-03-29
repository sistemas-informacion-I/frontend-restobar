import React from 'react'
import { Button } from '../Button'
import { EditIcon, TrashIcon } from '../Icons'

interface TableActionCellProps {
  onEdit?: () => void
  onDelete?: () => void
  editLabel?: string
  deleteLabel?: string
}

/**
 * TableActionCell - Componente para mostrar acciones (Edit/Delete) en una celda
 * Similar a td-action.blade.php en SI1-ferreteria
 */
export const TableActionCell: React.FC<TableActionCellProps> = ({
  onEdit,
  onDelete,
  editLabel = 'Edit',
  deleteLabel = 'Delete',
}) => {
  return (
    <td className="whitespace-nowrap border-b border-slate-200 px-3 py-3 text-sm dark:border-slate-700">
      <div className="flex items-center gap-1">
        {onEdit && (
          <Button
            variant="warning"
            size="sm"
            onClick={onEdit}
            title={editLabel}
            icon={<EditIcon className="w-4 h-4" />}
            className="!px-2 !py-1"
          />
        )}
        {onDelete && (
          <Button
            variant="danger"
            size="sm"
            onClick={onDelete}
            title={deleteLabel}
            icon={<TrashIcon className="w-4 h-4" />}
            className="!px-2 !py-1"
          />
        )}
      </div>
    </td>
  )
}
