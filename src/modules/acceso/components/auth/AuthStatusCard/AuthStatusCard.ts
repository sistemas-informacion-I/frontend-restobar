import { ReactNode } from 'react'
import { AuthStatusCardView } from './AuthStatusCard.view'

export interface AuthStatusCardProps {
  icon: ReactNode
  title: string
  message: string
  action?: ReactNode
}

export function AuthStatusCard(props: AuthStatusCardProps) {
  return AuthStatusCardView(props)
}
