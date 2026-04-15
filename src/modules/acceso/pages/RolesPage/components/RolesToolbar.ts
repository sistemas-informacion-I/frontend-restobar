import { RolesToolbarView } from './RolesToolbar.view'

export interface RolesToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  total: number
  canCreateRoles: boolean
  onCreateRole: () => void
}

export function RolesToolbar(props: RolesToolbarProps) {
  return RolesToolbarView(props)
}
