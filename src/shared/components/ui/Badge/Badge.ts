import type { ReactNode } from 'react'
import { BadgeView } from './Badge.view'

export interface BadgeProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'outline'
}

export function Badge(props: BadgeProps) {
  return BadgeView(props)
}
