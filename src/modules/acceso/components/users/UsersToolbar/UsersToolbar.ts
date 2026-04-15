import { UsersToolbarView } from './UsersToolbar.view'

export interface UsersToolbarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  canCreateUsers: boolean
  onCreateUser: () => void
}

export function UsersToolbar(props: UsersToolbarProps) {
  return UsersToolbarView(props)
}
