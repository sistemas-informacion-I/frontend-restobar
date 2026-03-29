import { useState, useEffect, useCallback } from 'react'
import { Layout } from '@/shared/components/layout/Layout'
import { Modal } from '@/shared/components/ui/Modal'
import { RoleForm, RoleView, RolesTable, RolesToolbar } from '../components/roles'
import { rolesService, permissionsService, Role, Permission, CreateRoleData, UpdateRoleData, getErrorMessage } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Trash2, Shield, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'

export default function RolesPage() {
  const { canCreate, canRead, canUpdate, canDelete } = useAuth()
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [rolesData, permissionsData] = await Promise.all([
        rolesService.getAll(),
        permissionsService.getAll(),
      ])
      setRoles(rolesData)
      setPermissions(permissionsData)
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'cargar roles y permisos'))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(search.toLowerCase()))
  )

  // Handlers
  const handleCreate = async (data: CreateRoleData | UpdateRoleData) => {
    try {
      setIsSubmitting(true)
      await rolesService.create(data as CreateRoleData)
      setFeedbackType('success')
      setFeedbackMessage('Rol creado exitosamente')
      setShowCreateModal(false)
      loadData()
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'crear el rol'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (data: CreateRoleData | UpdateRoleData) => {
    if (!selectedRole) return
    try {
      setIsSubmitting(true)
      await rolesService.update(selectedRole.id, data as UpdateRoleData)
      setFeedbackType('success')
      setFeedbackMessage('Rol actualizado exitosamente')
      setShowEditModal(false)
      setSelectedRole(null)
      loadData()
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'actualizar el rol'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedRole) return
    try {
      setIsSubmitting(true)
      await rolesService.delete(selectedRole.id)
      setFeedbackType('success')
      setFeedbackMessage('Rol eliminado exitosamente')
      setShowDeleteModal(false)
      setSelectedRole(null)
      loadData()
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'eliminar el rol'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const openView = (role: Role) => {
    setSelectedRole(role)
    setShowViewModal(true)
  }

  const openEdit = (role: Role) => {
    setSelectedRole(role)
    setShowEditModal(true)
  }

  const openDelete = (role: Role) => {
    setSelectedRole(role)
    setShowDeleteModal(true)
  }

  // Permission checks
  const canViewRoles = canRead('roles')
  const canCreateRoles = canCreate('roles')
  const canUpdateRoles = canUpdate('roles')
  const canDeleteRoles = canDelete('roles')

  if (!canViewRoles) {
    return (
      <Layout>
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <AlertCircle size={48} />
          <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Acceso Denegado</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">No tienes permiso para ver los roles</p>
        </div>
      </Layout>
    )
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

        <RolesToolbar
          search={search}
          onSearchChange={setSearch}
          total={filteredRoles.length}
          canCreateRoles={canCreateRoles}
          onCreateRole={() => setShowCreateModal(true)}
        />

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Cargando roles...
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
            <Shield size={48} />
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">No hay roles</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {search 
                ? 'No se encontraron roles con ese criterio de búsqueda'
                : 'Comienza creando un nuevo rol'
              }
            </p>
          </div>
        ) : (
          <RolesTable
            roles={filteredRoles}
            canUpdateRoles={canUpdateRoles}
            canDeleteRoles={canDeleteRoles}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}

        {/* Create Modal */}
        <Modal.Root
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          size="lg"
        >
          <Modal.Header>Crear Nuevo Rol</Modal.Header>
          <Modal.Body>
            <RoleForm
              permissions={permissions}
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
            setSelectedRole(null)
          }}
          size="lg"
        >
          <Modal.Header>Editar Rol</Modal.Header>
          <Modal.Body>
            {selectedRole && (
              <RoleForm
                role={selectedRole}
                permissions={permissions}
                onSubmit={handleUpdate}
                onCancel={() => {
                  setShowEditModal(false)
                  setSelectedRole(null)
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
            setSelectedRole(null)
          }}
          size="md"
        >
          <Modal.Header>Detalles del Rol</Modal.Header>
          <Modal.Body>
            {selectedRole && <RoleView role={selectedRole} />}
          </Modal.Body>
        </Modal.Root>

        {/* Delete Confirmation Modal */}
        <Modal.Root
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedRole(null)
          }}
          size="sm"
        >
          <Modal.Header>Confirmar Eliminación</Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
                <Trash2 size={24} />
              </div>
              <p>
                ¿Estás seguro de que deseas eliminar el rol <strong>{selectedRole?.name}</strong>?
              </p>
              <p className="mt-2 text-sm text-rose-500">
                Esta acción no se puede deshacer. Los usuarios con este rol perderán sus permisos.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedRole(null)
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
