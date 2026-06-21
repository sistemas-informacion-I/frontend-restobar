import { TarjetasKpiView } from './TarjetasKpi.view'
import type { KpiDTO } from '../../../types/dashboard.types'

export interface TarjetasKpiProps {
  kpis: KpiDTO | undefined
  isLoading: boolean
}

export function TarjetasKpi(props: TarjetasKpiProps) {
  return TarjetasKpiView(props)
}
