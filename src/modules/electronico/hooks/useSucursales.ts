import useSWR from 'swr'
import { httpClient } from '@/core/api'
import type { SucursalMapa } from '../models/sucursal.model'

export function useSucursalesMapa() {
  const {
    data: sucursales = [],
    isLoading,
  } = useSWR<SucursalMapa[]>('/api/sucursal', () => httpClient.get<SucursalMapa[]>('/api/sucursal'))

  return { sucursales, isLoading }
}
