import { PermissionsCardView } from './PermissionsCard.view'
import { Permission } from '../../../services/api'

export interface PermissionsCardProps {
  permissions: Permission[]
}

export function PermissionsCard({ permissions }: PermissionsCardProps) {
  if (permissions.length === 0) return null
  return PermissionsCardView({ permissions })
}
