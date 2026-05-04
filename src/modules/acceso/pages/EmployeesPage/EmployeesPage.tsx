import { useState, useMemo, useCallback } from 'react'
import { Empleado, CreateEmpleadoData } from '../../services/empleados.service'
import { Role } from '@/modules/acceso/models'
import { useEmployees } from '../../hooks/useEmployees'
import { useRoles } from '../../hooks/useRoles'
import { getErrorMessage } from '@/core/api'
import { EmployeesPageView } from './EmployeesPage.view'
import { useAuth } from '@/modules/acceso/context/AuthContext'

export default function EmployeesPage() {
  const { 
    employees, 
    isLoading: employeesLoading, 
    isSubmitting: employeesSubmitting,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    loadError: employeesError
  } = useEmployees()

  const {
    roles: allRoles,
    isLoading: rolesLoading,
    loadError: rolesError
  } = useRoles()

  const [search, setSearch] = useState('')
  
  // Feedback state (Following project's pattern)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Empleado | null>(null)

  const { hasPermission } = useAuth()

  const canCreate = hasPermission('employees:create')
  const canUpdate = hasPermission('employees:update')
  const canDelete = hasPermission('employees:delete')

  const isLoading = employeesLoading || rolesLoading
  const loadError = employeesError || rolesError

  const showFeedback = useCallback((message: string, type: 'error' | 'success') => {
    setFeedbackMessage(message)
    setFeedbackType(type)
    if (type === 'success') {
      setTimeout(() => {
        setFeedbackMessage('')
        setFeedbackType('')
      }, 5000)
    }
  }, [])

  const roles = useMemo(() => {
    const employeeRoleNames = ['CAJERO', 'BARTENDER', 'COCINERO', 'MESERO']
    return allRoles.filter((role: Role) => 
      employeeRoleNames.includes(role.name.toUpperCase())
    )
  }, [allRoles])

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp: Empleado) => 
      emp.nombre.toLowerCase().includes(search.toLowerCase()) ||
      emp.apellido.toLowerCase().includes(search.toLowerCase()) ||
      emp.ci.includes(search) ||
      emp.codigoEmpleado.toLowerCase().includes(search.toLowerCase())
    )
  }, [employees, search])

  const handleCreate = () => {
    setSelectedEmployee(null)
    setFeedbackMessage('')
    setFeedbackType('')
    setIsFormModalOpen(true)
  }

  const handleEdit = (employee: Empleado) => {
    setSelectedEmployee(employee)
    setFeedbackMessage('')
    setFeedbackType('')
    setIsFormModalOpen(true)
  }

  const handleView = (employee: Empleado) => {
    setSelectedEmployee(employee)
    setIsViewModalOpen(true)
  }

  const handleDelete = async (employee: Empleado) => {
    if (!confirm(`¿Estás seguro de eliminar al empleado ${employee.nombre} ${employee.apellido}?`)) return
    
    try {
      await deleteEmployee(employee.idEmpleado)
      showFeedback('Empleado eliminado correctamente', 'success')
    } catch (error: any) {
      showFeedback(getErrorMessage(error, 'Eliminar empleado'), 'error')
    }
  }

  const onSubmit = async (data: CreateEmpleadoData) => {
    setFeedbackMessage('')
    setFeedbackType('')
    try {
      if (selectedEmployee) {
        await updateEmployee({ id: selectedEmployee.idEmpleado, data })
        showFeedback('Empleado actualizado correctamente', 'success')
      } else {
        await createEmployee(data)
        showFeedback('Empleado registrado correctamente', 'success')
      }
      setIsFormModalOpen(false)
    } catch (error: any) {
      showFeedback(getErrorMessage(error, 'Procesar contratación'), 'error')
    }
  }

  return (
    <EmployeesPageView
      employees={filteredEmployees}
      total={employees.length}
      roles={roles}
      isLoading={isLoading}
      isSubmitLoading={employeesSubmitting}
      search={search}
      onSearchChange={setSearch}
      feedbackMessage={feedbackMessage || (loadError ? getErrorMessage(loadError) : '')}
      feedbackType={feedbackType || (loadError ? 'error' : '')}
      canCreate={canCreate}
      canUpdate={canUpdate}
      canDelete={canDelete}
      isFormModalOpen={isFormModalOpen}
      setIsFormModalOpen={setIsFormModalOpen}
      isViewModalOpen={isViewModalOpen}
      setIsViewModalOpen={setIsViewModalOpen}
      selectedEmployee={selectedEmployee}
      onCreate={handleCreate}

      onEdit={handleEdit}
      onView={handleView}
      onDelete={handleDelete}
      onSubmit={onSubmit}
    />
  )
}
