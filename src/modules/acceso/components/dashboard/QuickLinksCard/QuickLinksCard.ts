import { ComponentType } from 'react'
import { QuickLinksCardView } from './QuickLinksCard.view'

export interface QuickLink {
  title: string
  description: string
  icon: ComponentType<{ size?: string | number }>
  href: string
  color: string
}

export interface QuickLinksCardProps {
  links: QuickLink[]
}

export function QuickLinksCard(props: QuickLinksCardProps) {
  return QuickLinksCardView(props)
}
