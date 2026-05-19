import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { catalogoService } from '../services/catalogo.service'
import { CatalogoProducto, CatalogoUpdateRequest } from '../models/catalogo.model'
import { getErrorMessage } from '@/core/api'

export const useCatalogo = (idSucursal?: number, isAdmin = false) => {
  const key = idSucursal
    ? isAdmin
      ? ['catalogo-admin', idSucursal]
      : ['catalogo', idSucursal]
    : null

  const { data: productos = [], isLoading, error: loadError, mutate } = useSWR<CatalogoProducto[]>(
    key,
    async () => {
      if (!idSucursal) return []
      return isAdmin
        ? catalogoService.getCatalogoAdmin(idSucursal)
        : catalogoService.getCatalogo(idSucursal)
    },
    { revalidateOnFocus: false }
  )

  const { trigger: updateTrigger, isMutating: isSubmitting } = useSWRMutation(
    key,
    async (
      _key: any,
      { arg }: { arg: { idProducto: number; data: CatalogoUpdateRequest } }
    ) => {
      if (!idSucursal) throw new Error('Sucursal no definida')
      const result = await catalogoService.actualizarDisponibilidad(
        idSucursal,
        arg.idProducto,
        arg.data
      )
      mutate()
      return result
    }
  )

  const actualizarProducto = async (idProducto: number, data: CatalogoUpdateRequest) => {
    return updateTrigger({ idProducto, data })
  }

  return {
    productos,
    isLoading,
    isSubmitting,
    loadError,
    actualizarProducto,
    refresh: mutate,
  }
}
