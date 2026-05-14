import { useState } from 'react';
import useSWR from 'swr';
import { productosFinalesService } from '../services/productosFinales.service';

export interface ProductoSucursal {
  idProductoFinal: number;
  codigoProducto: string;
  nombreProducto: string;
  idSucursal: number;
  nombreSucursal: string;
  precio: number;
  disponible: boolean;
  activo: boolean;
}

interface ErrorDetail {
  message: string;
  code?: string;
  statusCode?: number;
}

const normalizeProductoSucursal = (item: any): ProductoSucursal => {
  const producto = item?.producto ?? {};
  const sucursal = item?.sucursal ?? {};

  return {
    idProductoFinal: Number(item?.idProductoFinal ?? item?.idProducto ?? producto?.idProductoFinal ?? 0),
    codigoProducto: String(item?.codigoProducto ?? item?.codigo ?? producto?.codigo ?? ''),
    nombreProducto: String(item?.nombreProducto ?? item?.nombre ?? producto?.nombre ?? ''),
    idSucursal: Number(item?.idSucursal ?? sucursal?.idSucursal ?? 0),
    nombreSucursal: String(item?.nombreSucursal ?? sucursal?.nombre ?? ''),
    precio: Number(item?.precio ?? 0),
    disponible: Boolean(item?.disponible ?? item?.stock ?? false),
    activo: Boolean(item?.activo ?? item?.disponibleBool ?? true),
  };
};

export const useProductosSucursales = (idSucursal?: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorDetail | null>(null);

  const { data: productosSucursal = [], mutate, isLoading } = useSWR<ProductoSucursal[]>(
    idSucursal ? ['productos-sucursal', idSucursal] : null,
    async () => {
      if (!idSucursal) return [];
      const response = await productosFinalesService.obtenerPorSucursal(idSucursal);
      return Array.isArray(response) ? response.map(normalizeProductoSucursal) : [];
    },
    { revalidateOnFocus: false }
  );

  const getErrorMessage = (err: any): ErrorDetail => {
    const status = err?.status ?? err?.response?.status;
    const message = err?.message;

    if (status === 403) {
        return { message: 'No tienes permiso para gestionar productos de esta sucursal', code: 'FORBIDDEN', statusCode: 403 };
    }
    if (status === 404) {
        return { message: 'Sucursal no encontrada', code: 'NOT_FOUND', statusCode: 404 };
    }
    if (status === 400) {
        return { message: message || 'Datos inválidos', code: 'BAD_REQUEST', statusCode: 400 };
    }
    return {
        message: message || 'Error al procesar la solicitud',
        statusCode: status || 500
    };
  };

  const asignarProducto = async (
    idProducto: number,
    idSucursalTarget: number,
    data: { precio: number; disponible: boolean; activo?: boolean }
  ) => {
    setLoading(true);
    setError(null);
    try {
      await productosFinalesService.asignarASucursal(idProducto, idSucursalTarget, data);
      if (idSucursal === idSucursalTarget) {
        mutate();
      }
    } catch (err) {
      const errorDetail = getErrorMessage(err);
      setError(errorDetail);
      throw errorDetail;
    } finally {
      setLoading(false);
    }
  };

  const actualizarAsignacion = async (
    idProducto: number,
    idSucursalTarget: number,
    data: { precio?: number; disponible?: boolean; activo?: boolean }
  ) => {
    setLoading(true);
    setError(null);
    try {
      await productosFinalesService.actualizarAsignacion(idProducto, idSucursalTarget, data);
      if (idSucursal === idSucursalTarget) {
        mutate();
      }
    } catch (err) {
      const errorDetail = getErrorMessage(err);
      setError(errorDetail);
      throw errorDetail;
    } finally {
      setLoading(false);
    }
  };

  return {
    productosSucursal,
    loading: loading || isLoading,
    error,
    asignarProducto,
    actualizarAsignacion,
    refresh: mutate
  };
};
