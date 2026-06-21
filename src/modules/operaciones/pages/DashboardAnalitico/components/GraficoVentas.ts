import { GraficoVentasView } from './GraficoVentas.view'
import type { SalesPoint } from '../../../types/dashboard.types'

export interface GraficoVentasProps {
  data: SalesPoint[] | undefined
  isLoading: boolean
}

export function GraficoVentas(props: GraficoVentasProps) {
  return GraficoVentasView(props)
}
