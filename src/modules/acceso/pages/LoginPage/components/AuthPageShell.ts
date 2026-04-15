import { ReactNode } from 'react'
import { AuthPageShellView } from './AuthPageShell.view'

export interface AuthPageShellProps {
  children: ReactNode
}

export function AuthPageShell(props: AuthPageShellProps) {
  return AuthPageShellView(props)
}
