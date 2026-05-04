import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { EmpleadosService, Empleado, CreateEmpleadoData } from '../services/empleados.service'

export const useEmployees = () => {
  // Query for fetching all employees
  const { 
    data: employees = [], 
    error: loadError, 
    isLoading, 
    mutate 
  } = useSWR<Empleado[]>('/api/empleados', () => EmpleadosService.getAll())

  // Mutation for creating an employee
  const { trigger: createEmployee, isMutating: isCreating } = useSWRMutation(
    '/api/empleados',
    async (_, { arg }: { arg: CreateEmpleadoData }) => {
      return EmpleadosService.create(arg)
    },
    {
      onSuccess: () => mutate() // Revalidate employee list
    }
  )

  // Mutation for updating an employee
  const { trigger: updateEmployee, isMutating: isUpdating } = useSWRMutation(
    '/api/empleados/update',
    async (_, { arg }: { arg: { id: number, data: Partial<CreateEmpleadoData> } }) => {
      return EmpleadosService.update(arg.id, arg.data)
    },
    {
      onSuccess: () => mutate() // Revalidate employee list
    }
  )

  // Mutation for deleting an employee
  const { trigger: deleteEmployee, isMutating: isDeleting } = useSWRMutation(
    '/api/empleados/delete',
    async (_, { arg }: { arg: number }) => {
      return EmpleadosService.delete(arg)
    },
    {
      onSuccess: () => mutate() // Revalidate employee list
    }
  )

  return {
    employees,
    isLoading,
    loadError,
    isCreating,
    isUpdating,
    isDeleting,
    isSubmitting: isCreating || isUpdating || isDeleting,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    refreshEmployees: mutate
  }
}
