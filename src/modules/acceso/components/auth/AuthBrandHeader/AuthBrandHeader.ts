import { AuthBrandHeaderView } from './AuthBrandHeader.view'

export interface AuthBrandHeaderProps {
  subtitle: string
}

export function AuthBrandHeader(props: AuthBrandHeaderProps) {
  return AuthBrandHeaderView(props)
}
