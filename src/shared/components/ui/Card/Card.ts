import { CardView, CardHeaderView, CardContentView, CardFooterView } from './Card.view'
import { ReactNode } from 'react'

export interface CardProps {
  children: ReactNode
  className?: string
}

export function Card(props: CardProps) {
  return CardView(props)
}

export function CardHeader(props: CardProps) {
  return CardHeaderView(props)
}

export function CardContent(props: CardProps) {
  return CardContentView(props)
}

export function CardFooter(props: CardProps) {
  return CardFooterView(props)
}
