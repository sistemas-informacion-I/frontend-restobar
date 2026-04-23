import { httpClient } from './http-client'

export interface Empleado {
  idEmpleado: number
  idUsuario: number
  ci: string
  nombre: string
  apellido: string
  username: string
  telefono?: string
  sexo: 'M' | 'F' | 'O'
  correo?: string
  direccion?: string
  activo: boolean
  estadoAcceso: string
  codigoEmpleado: string
  salario: number
  turno?: string
  fechaContratacion: string
  fechaFinalizacion?: string
  roles: string[]
}

export interface CreateEmpleadoData {
  ci: string
  nombre: string
  apellido: string
  username?: string
  password?: string
  telefono?: string
  sexo: string
  correo?: string
  direccion?: string
  activo?: boolean
  salario: number
  turno?: string
  roles?: number[]
}

export const EmpleadosService = {
  async getAll(): Promise<Empleado[]> {
    return await httpClient.get<Empleado[]>('/api/empleados')
  },

  async getById(id: number): Promise<Empleado> {
    return await httpClient.get<Empleado>(`/api/empleados/${id}`)
  },

  async create(empleado: CreateEmpleadoData): Promise<Empleado> {
    return await httpClient.post<Empleado>('/api/empleados', empleado)
  },

  async update(id: number, empleado: Partial<CreateEmpleadoData>): Promise<Empleado> {
    return await httpClient.put<Empleado>(`/api/empleados/${id}`, empleado)
  },

  async delete(id: number): Promise<void> {
    await httpClient.delete(`/api/empleados/${id}`)
  }
}
