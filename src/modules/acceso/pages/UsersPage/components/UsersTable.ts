import { User } from '../../../models'
import { UsersTableView } from './UsersTable.view'

export interface UsersTableProps {
  users: User[]
  canUpdateUsers: boolean
  canDeleteUsers: boolean
  currentUserId?: string
  onView: (user: User) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UsersTable(props: UsersTableProps) {
  return UsersTableView(props)
}
