import { httpClient } from './http-client';
import { PerfilPersonalResponse, PerfilPersonalUpdate, CambioPasswordRequest } from '../models/perfil-personal.model';

export const perfilPersonalService = {
  getMiPerfil: async (): Promise<PerfilPersonalResponse> => {
    return httpClient.get<PerfilPersonalResponse>('/api/perfil');
  },
  actualizarMiPerfil: async (data: PerfilPersonalUpdate): Promise<PerfilPersonalResponse> => {
    return httpClient.put<PerfilPersonalResponse>('/api/perfil', data);
  },
  cambiarPassword: async (data: CambioPasswordRequest): Promise<void> => {
    return httpClient.put<void>('/api/perfil/password', data);
  },
  eliminarMiPerfil: async (): Promise<void> => {
    return httpClient.delete<void>('/api/perfil');
  }
};
