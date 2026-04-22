import { httpClient } from './http-client'
import { Empleado, CreateEmpleadoData, UpdateEmpleadoData } from './types'

interface EmpleadoApiResponse {
  idEmpleado: number
  idUsuario?: number
  ci: string
  nombre: string
  apellido: string
  username?: string
  telefono?: string
  sexo?: 'M' | 'F' | 'O'
  correo?: string
  direccion?: string
  codigoEmpleado?: string
  salario?: number
  turno?: 'AM' | 'PM'
  fechaContratacion?: string
  fechaFinalizacion?: string
  estadoAcceso?: string
  activo?: boolean
  usuario?: any
}

const mapEmpleado = (empleado: EmpleadoApiResponse): Empleado => {
  const firstName = empleado.nombre || ''
  const lastName = empleado.apellido || ''
  return {
    id: String(empleado.idEmpleado),
    ci: empleado.ci,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    username: empleado.username,
    email: empleado.correo || '',
    phone: empleado.telefono,
    gender: empleado.sexo,
    address: empleado.direccion,
    codigoEmpleado: empleado.codigoEmpleado,
    salary: empleado.salario,
    turno: empleado.turno,
    hireDate: empleado.fechaContratacion,
    endDate: empleado.fechaFinalizacion,
    isActive: empleado.activo ?? true,
    estadoAcceso: empleado.estadoAcceso,
    usuario: empleado.usuario,
  }
}

class EmpleadosService {
  async getAll(): Promise<Empleado[]> {
    const response = await httpClient.get<EmpleadoApiResponse[]>('/api/empleados')
    return response.map(mapEmpleado)
  }

  async getOne(id: string): Promise<Empleado> {
    const response = await httpClient.get<EmpleadoApiResponse>(`/api/empleados/${id}`)
    return mapEmpleado(response)
  }

  async create(data: CreateEmpleadoData): Promise<Empleado> {
    const response = await httpClient.post<EmpleadoApiResponse>('/api/empleados', data)
    return mapEmpleado(response)
  }

  async update(id: string, data: UpdateEmpleadoData): Promise<Empleado> {
    const response = await httpClient.put<EmpleadoApiResponse>(`/api/empleados/${id}`, data)
    return mapEmpleado(response)
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/api/empleados/${id}`)
  }
}

// Export singleton instance
export const empleadosService = new EmpleadosService()
