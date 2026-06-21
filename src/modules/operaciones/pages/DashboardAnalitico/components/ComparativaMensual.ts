import { ComparativaMensualView } from './ComparativaMensual.view'
import type { MonthComparison } from '../../../types/dashboard.types'

export interface ComparativaMensualProps {
  data: MonthComparison | undefined
  isLoading: boolean
}

export function ComparativaMensual(props: ComparativaMensualProps) {
  return ComparativaMensualView(props)
}
