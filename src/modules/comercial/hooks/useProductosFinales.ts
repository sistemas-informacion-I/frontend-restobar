import { useState } from 'react';
import useSWR from 'swr';
import { productosFinalesService, type ProductoFinal, type ProductoFinalRequest } from '../services/productosFinales.service';

interface ProductosFilter {
  idCategoria?: number;
  activo?: boolean;
}

interface ErrorDetail {
  message: string;
  code?: string;
  statusCode?: number;
}

export const useProductosFinales = (filters?: ProductosFilter) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorDetail | null>(null);

  const { data: productos = [], mutate, isLoading } = useSWR<ProductoFinal[]>(
    ['productos-finales', filters],
    () => productosFinalesService.getAll(filters),
    { revalidateOnFocus: false }
  );

  const getErrorMessage = (err: any): ErrorDetail => {
    // El httpClient transforma el error: usa err.status, no err?.response?.status
    const status = err?.status ?? err?.response?.status;
    const message = err?.message;

    if (status === 403) {
      return { message: 'Solo el administrador global puede gestionar productos', code: 'FORBIDDEN', statusCode: 403 };
    }
    if (status === 409) {
      return { message: 'El código del producto ya existe', code: 'CONFLICT', statusCode: 409 };
    }
    if (status === 400) {
      return { message: message || 'Datos inválidos', code: 'BAD_REQUEST', statusCode: 400 };
    }
    return {
      message: message || 'Error al procesar la solicitud',
      statusCode: status || 500
    };
  };

  const createProducto = async (data: ProductoFinalRequest, file?: File) => {
    setLoading(true);
    setError(null);
    try {
      const nuevo = await productosFinalesService.create(data);
      if (file) {
        await productosFinalesService.uploadImagen(nuevo.idProductoFinal, file);
      }
      mutate();
    } catch (err) {
      const errorDetail = getErrorMessage(err);
      setError(errorDetail);
      throw errorDetail;
    } finally {
      setLoading(false);
    }
  };

  const updateProducto = async (id: number, data: Partial<ProductoFinalRequest>, file?: File) => {
    setLoading(true);
    setError(null);
    try {
      await productosFinalesService.update(id, data);
      if (file) {
        await productosFinalesService.uploadImagen(id, file);
      }
      mutate();
    } catch (err) {
      const errorDetail = getErrorMessage(err);
      setError(errorDetail);
      throw errorDetail;
    } finally {
      setLoading(false);
    }
  };

  const deleteProducto = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await productosFinalesService.delete(id);
      mutate();
    } catch (err) {
      const errorDetail = getErrorMessage(err);
      setError(errorDetail);
      throw errorDetail;
    } finally {
      setLoading(false);
    }
  };

  return {
    productos,
    loading: loading || isLoading,
    error,
    createProducto,
    updateProducto,
    deleteProducto,
    refresh: mutate
  };
};