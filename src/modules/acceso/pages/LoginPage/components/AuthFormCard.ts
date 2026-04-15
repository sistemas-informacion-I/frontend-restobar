import { ReactNode } from 'react'
import { AuthFormCardView } from './AuthFormCard.view'

export interface AuthFormCardProps {
  title: string
  description: string
  footerText: string
  footerLinkLabel: string
  footerLinkTo: string
  children: ReactNode
}

export function AuthFormCard(props: AuthFormCardProps) {
  return AuthFormCardView(props)
}
