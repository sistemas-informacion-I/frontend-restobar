import { useEffect, useRef } from 'react'
import useSWR from 'swr'
import { inventarioService } from '../services/inventario.service'

// SWR keys must match the actual API paths to ensure correct cache invalidation
const KEYS = {
  insumos: '/api/inventario',
  stock: (id: number) => `/api/inventario/stock/sucursal/${id}`,
  lotes: (id: number) => `/api/inventario/stock/${id}/lotes`,
}

export function useInventario() {
  const { data: insumos, error, mutate, isLoading } = useSWR(
    KEYS.insumos,
    inventarioService.listarInsumos
  )

  return {
    insumos: insumos ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}

export function useStock(idSucursal?: number) {
  const { data: stock, error, mutate, isLoading } = useSWR(
    idSucursal ? KEYS.stock(idSucursal) : null,
    () => inventarioService.listarStockPorSucursal(idSucursal!)
  )

  return {
    stock: stock ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}

export function useLotes(idStock?: number, page: number = 0, size: number = 5) {
  const { data: pageData, error, mutate, isLoading } = useSWR(
    idStock ? `/api/inventario/stock/${idStock}/lotes?page=${page}&size=${size}` : null,
    () => inventarioService.listarLotes(idStock!, page, size)
  )

  return {
    lotes: pageData?.content ?? [],
    totalElements: pageData?.totalElements ?? 0,
    totalPages: pageData?.totalPages ?? 0,
    isLoading,
    isError: !!error,
    mutate,
  }
}

/** Llama a `mutate()` cuando el componente se monta si la clave es válida  */
export function useRevalidateOnMount(idStock?: number) {
  const { mutate } = useLotes(idStock)
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current && idStock) {
      mounted.current = true
      mutate()
    }
  }, [idStock, mutate])
}
