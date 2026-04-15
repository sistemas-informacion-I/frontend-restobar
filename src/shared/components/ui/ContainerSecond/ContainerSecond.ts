import { ContainerSecondView } from './ContainerSecond.view'
import { ReactNode } from 'react'

export interface ContainerSecondProps {
  children: ReactNode
  className?: string
}

export function ContainerSecond(props: ContainerSecondProps) {
  return ContainerSecondView(props)
}
