import { TablaEmpleadosView } from './TablaEmpleados.view'
import type { EmployeeRanking } from '../../../types/dashboard.types'

export interface TablaEmpleadosProps {
  data: EmployeeRanking[] | undefined
  isLoading: boolean
}

export function TablaEmpleados(props: TablaEmpleadosProps) {
  return TablaEmpleadosView(props)
}
