import { useState, useEffect } from 'react'
import { Layout } from '@/shared/components/layout'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import { useAuth } from '../context/AuthContext'
import { Empleado, CreateEmpleadoData, UpdateEmpleadoData, empleadosService, getErrorMessage } from '../services/api'
import { EmpleadoForm, EmpleadoView, EmpleadosTable, EmpleadosToolbar } from '../components/empleados'

export default function EmpleadosPage() {
  const { canCreate, canUpdate, canDelete } = useAuth()
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const empleadosData = await empleadosService.getAll()
      setEmpleados(empleadosData)
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'cargar la lista de empleados'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (data: CreateEmpleadoData | UpdateEmpleadoData) => {
    setIsSubmitting(true)
    try {
      await empleadosService.create(data as CreateEmpleadoData)
      setFeedbackType('success')
      setFeedbackMessage('Empleado creado exitosamente')
      setShowCreateModal(false)
      loadData()
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'crear el empleado'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (data: CreateEmpleadoData | UpdateEmpleadoData) => {
    if (!selectedEmpleado) return
    setIsSubmitting(true)
    try {
      await empleadosService.update(selectedEmpleado.id, data as UpdateEmpleadoData)
      setFeedbackType('success')
      setFeedbackMessage('Empleado actualizado exitosamente')
      setShowEditModal(false)
      setSelectedEmpleado(null)
      loadData()
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'actualizar el empleado'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedEmpleado) return
    setIsSubmitting(true)
    try {
      await empleadosService.delete(selectedEmpleado.id)
      setFeedbackType('success')
      setFeedbackMessage('Empleado eliminado exitosamente')
      setShowDeleteModal(false)
      setSelectedEmpleado(null)
      loadData()
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'eliminar el empleado'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredEmpleados = empleados.filter(empleado => 
    empleado.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (empleado.ci || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (empleado.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (empleado.codigoEmpleado || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openView = (empleado: Empleado) => {
    setSelectedEmpleado(empleado)
    setShowViewModal(true)
  }

  const openEdit = (empleado: Empleado) => {
    setSelectedEmpleado(empleado)
    setShowEditModal(true)
  }

  const openDelete = (empleado: Empleado) => {
    setSelectedEmpleado(empleado)
    setShowDeleteModal(true)
  }

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-1">
        {feedbackMessage && (
          <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${feedbackType === 'error'
            ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300'
            }`}>
            {feedbackMessage}
          </div>
        )}

        <EmpleadosToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          canCreateEmpleados={canCreate('employees')}
          onCreateEmpleado={() => setShowCreateModal(true)}
        />

        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">Cargando empleados...</div>
        ) : (
          <EmpleadosTable
            empleados={filteredEmpleados}
            canUpdateEmpleados={canUpdate('employees')}
            canDeleteEmpleados={canDelete('employees')}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}

        {/* Create Modal */}
        <Modal.Root
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          size="md"
        >
          <Modal.Header>Crear Empleado</Modal.Header>
          <Modal.Body>
            <EmpleadoForm
              onSubmit={handleCreate}
              onCancel={() => setShowCreateModal(false)}
              isLoading={isSubmitting}
            />
          </Modal.Body>
        </Modal.Root>

        {/* Edit Modal */}
        <Modal.Root
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedEmpleado(null)
          }}
          size="md"
        >
          <Modal.Header>Editar Empleado</Modal.Header>
          <Modal.Body>
            {selectedEmpleado && (
              <EmpleadoForm
                empleado={selectedEmpleado}
                onSubmit={handleEdit}
                onCancel={() => {
                  setShowEditModal(false)
                  setSelectedEmpleado(null)
                }}
                isLoading={isSubmitting}
              />
            )}
          </Modal.Body>
        </Modal.Root>

        {/* View Modal */}
        <Modal.Root
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false)
            setSelectedEmpleado(null)
          }}
          size="md"
        >
          <Modal.Header>Detalles del Empleado</Modal.Header>
          <Modal.Body>
            {selectedEmpleado && <EmpleadoView empleado={selectedEmpleado} />}
          </Modal.Body>
        </Modal.Root>

        {/* Delete Modal */}
        <Modal.Root
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedEmpleado(null)
          }}
          size="sm"
        >
          <Modal.Header>Eliminar Empleado</Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <p>¿Estás seguro de que deseas eliminar a <strong>{selectedEmpleado?.name}</strong>?</p>
              <p className="mt-2 text-sm text-rose-500">Esta acción no se puede deshacer.</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedEmpleado(null)
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isSubmitting}
            >
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal.Root>
      </div>
    </Layout>
  )
}
