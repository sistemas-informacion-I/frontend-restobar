import { ContainerView } from './Container.view'
import { ReactNode } from 'react'

export interface ContainerProps {
  children: ReactNode
  className?: string
  clean?: boolean
}

export function Container(props: ContainerProps) {
  return ContainerView(props)
}
