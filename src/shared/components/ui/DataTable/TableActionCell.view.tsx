import React from 'react'
import { Button } from '../Button'
import { EditIcon, TrashIcon } from '../Icons'

interface TableActionCellViewProps {
  onEdit?: () => void
  onDelete?: () => void
  editLabel: string
  deleteLabel: string
}

export const TableActionCellView: React.FC<TableActionCellViewProps> = ({
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}) => (
  <td className="whitespace-nowrap border-b border-wine-100/50 px-6 py-4 text-sm dark:border-wine-900/20">
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
