import { GraficoCategoriasView } from './GraficoCategorias.view'
import type { CategorySales } from '../../../types/dashboard.types'

export interface GraficoCategoriasProps {
  data: CategorySales[] | undefined
  isLoading: boolean
}

export function GraficoCategorias(props: GraficoCategoriasProps) {
  return GraficoCategoriasView(props)
}
