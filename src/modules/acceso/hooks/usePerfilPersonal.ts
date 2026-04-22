import useSWR from 'swr';
import { perfilPersonalService } from '../services/perfil-personal.service';
import { PerfilPersonalUpdate, CambioPasswordRequest } from '../models/perfil-personal.model';

export const usePerfilPersonal = () => {
  const { data: perfil, error, isLoading, mutate } = useSWR('/api/perfil', perfilPersonalService.getMiPerfil);

  const actualizarPerfil = async (update: PerfilPersonalUpdate) => {
    const updated = await perfilPersonalService.actualizarMiPerfil(update);
    mutate(updated);
    return updated;
  };

  const cambiarPassword = async (request: CambioPasswordRequest) => {
    await perfilPersonalService.cambiarPassword(request);
  };

  const eliminarPerfil = async () => {
    await perfilPersonalService.eliminarMiPerfil();
  };

  return {
    perfil,
    isLoading,
    error,
    actualizarPerfil,
    cambiarPassword,
    eliminarPerfil,
    mutate
  };
};
