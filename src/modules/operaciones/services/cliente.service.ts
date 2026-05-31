import { httpClient } from '../../../core/api/http-client'
import { Cliente } from './types'

class ClienteService {
  async getAll(): Promise<Cliente[]> {
    return httpClient.get<Cliente[]>('/api/clientes')
  }

  async buscar(termino: string): Promise<Cliente[]> {
    return httpClient.get<Cliente[]>(`/api/clientes?buscar=${encodeURIComponent(termino)}`)
  }
}

export const clienteService = new ClienteService()
