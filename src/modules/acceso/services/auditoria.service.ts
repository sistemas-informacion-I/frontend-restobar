import { httpClient } from './http-client'
import { AuditLog, AuditPage, AuditFilters } from '../models'

class AuditoriaService {
  async getAll(filters: AuditFilters): Promise<AuditPage> {
    const params = new URLSearchParams()
    
    if (filters.tabla) params.append('tabla', filters.tabla)
    if (filters.operacion) params.append('operacion', filters.operacion)
    if (filters.idUsuario !== undefined) params.append('idUsuario', String(filters.idUsuario))
    if (filters.desde) params.append('desde', filters.desde)
    if (filters.hasta) params.append('hasta', filters.hasta)
    params.append('page', String(filters.page))
    params.append('size', String(filters.size))

    return httpClient.get<AuditPage>(`/api/auditoria?${params.toString()}`)
  }

  async getOne(id: number): Promise<AuditLog> {
    return httpClient.get<AuditLog>(`/api/auditoria/${id}`)
  }
}

export const auditoriaService = new AuditoriaService()
