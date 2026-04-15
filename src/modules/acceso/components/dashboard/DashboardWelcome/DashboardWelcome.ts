import { DashboardWelcomeView } from './DashboardWelcome.view'

export interface DashboardWelcomeProps {
  userName?: string
}

export function DashboardWelcome(props: DashboardWelcomeProps) {
  return DashboardWelcomeView(props)
}
