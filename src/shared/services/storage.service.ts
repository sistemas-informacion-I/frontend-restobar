import { httpClient } from '@/core/api/http-client'

export interface UploadResponse {
  filename: string;
  url: string;
}

export const StorageService = {
  /**
   * Sube una imagen al servidor.
   * El servidor decidirá si guardarla en Local o en GCS según su configuración.
   */
  upload: async (file: File, folder: string = 'products'): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    const response = await httpClient.post<UploadResponse>('/api/storage/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response
  },

  /**
   * Elimina un archivo.
   */
  delete: async (filename: string): Promise<void> => {
    await httpClient.delete(`/api/storage/${filename}`)
  }
}
