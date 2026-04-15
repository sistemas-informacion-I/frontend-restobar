import { User } from '../../../services/api'
import { UserViewView } from './UserView.view'

export interface UserViewProps {
  user: User
}

export function UserView({ user }: UserViewProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return UserViewView({ user, formatDate })
}
