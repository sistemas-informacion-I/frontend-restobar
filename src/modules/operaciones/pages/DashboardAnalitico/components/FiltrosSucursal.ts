import { FiltrosSucursalView } from './FiltrosSucursal.view'

export interface FiltrosSucursalProps {
  fechaInicio: string
  fechaFin: string
  idSucursal: number | undefined
  sucursales: { idSucursal: number; nombre: string }[]
  showSucursalFilter: boolean
  onFechaInicioChange: (val: string) => void
  onFechaFinChange: (val: string) => void
  onSucursalChange: (val: number | undefined) => void
}

export function FiltrosSucursal(props: FiltrosSucursalProps) {
  return FiltrosSucursalView(props)
}
