import { Role } from '../../../models'
import { RolesTableView } from './RolesTable.view'

export interface RolesTableProps {
  roles: Role[]
  canUpdateRoles: boolean
  canDeleteRoles: boolean
  onView: (role: Role) => void
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}

export function RolesTable(props: RolesTableProps) {
  return RolesTableView(props)
}
