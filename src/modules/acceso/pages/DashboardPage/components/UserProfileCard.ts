import { User as AppUser, Role } from '../../../services/api'
import { UserProfileCardView } from './UserProfileCard.view'

export interface UserProfileCardProps {
  user: AppUser | null
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  const roleText = user?.roles && user.roles.length > 0 ? user.roles.map((role: Role) => role.name).join(', ') : 'Sin rol'
  
  return UserProfileCardView({ user, roleText })
}
