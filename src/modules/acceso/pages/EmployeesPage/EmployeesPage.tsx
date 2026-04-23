import { useState, useEffect, useMemo, useCallback } from 'react'
import { EmpleadosService, Empleado, CreateEmpleadoData } from '../../services/empleados.service'
import { rolesService, Role, getErrorMessage } from '@/modules/acceso/services/api'
import { EmployeesPageView } from './EmployeesPage.view'
import { useAuth } from '@/modules/acceso/context/AuthContext'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Empleado[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)
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

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [empData, rolesData] = await Promise.all([
        EmpleadosService.getAll(),
        rolesService.getAll()
      ])
      const employeeRoleNames = ['CAJERO', 'BARTENDER', 'COCINERO', 'MESERO']
      const filteredRoles = rolesData.filter(role => 
        employeeRoleNames.includes(role.name.toUpperCase())
      )
      
      setEmployees(empData)
      setRoles(filteredRoles)
    } catch (error) {
      showFeedback(getErrorMessage(error, 'Cargar datos'), 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => 
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
      await EmpleadosService.delete(employee.idEmpleado)
      showFeedback('Empleado eliminado correctamente', 'success')
      loadData()
    } catch (error: any) {
      showFeedback(getErrorMessage(error, 'Eliminar empleado'), 'error')
    }
  }

  const onSubmit = async (data: CreateEmpleadoData) => {
    setIsSubmitLoading(true)
    setFeedbackMessage('')
    setFeedbackType('')
    try {
      if (selectedEmployee) {
        await EmpleadosService.update(selectedEmployee.idEmpleado, data)
        showFeedback('Empleado actualizado correctamente', 'success') // This will be shown on the main page after modal close if intended
      } else {
        await EmpleadosService.create(data)
        showFeedback('Empleado registrado correctamente', 'success')
      }
      setIsFormModalOpen(false)
      loadData()
    } catch (error: any) {
      showFeedback(getErrorMessage(error, 'Procesar contratación'), 'error')
    } finally {
      setIsSubmitLoading(false)
    }
  }

  return (
    <EmployeesPageView
      employees={filteredEmployees}
      total={employees.length}
      roles={roles}
      isLoading={isLoading}
      isSubmitLoading={isSubmitLoading}
      search={search}
      onSearchChange={setSearch}
      feedbackMessage={feedbackMessage}
      feedbackType={feedbackType}
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
