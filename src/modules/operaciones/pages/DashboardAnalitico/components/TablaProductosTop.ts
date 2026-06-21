import { TablaProductosTopView } from './TablaProductosTop.view'
import type { ProductRanking } from '../../../types/dashboard.types'

export interface TablaProductosTopProps {
  data: ProductRanking[] | undefined
  isLoading: boolean
}

export function TablaProductosTop(props: TablaProductosTopProps) {
  return TablaProductosTopView(props)
}
