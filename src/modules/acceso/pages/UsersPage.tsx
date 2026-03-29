import { useState, useEffect } from 'react'
import { Layout } from '@/shared/components/layout'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import { useAuth } from '../context/AuthContext'
import { User, CreateUserData, UpdateUserData, usersService, getErrorMessage } from '../services/api'
import { UserForm, UserView, UsersTable, UsersToolbar } from '../components/users'

export default function UsersPage() {
  const { canCreate, canUpdate, canDelete, user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const usersData = await usersService.getAll()
      setUsers(usersData)
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'cargar la lista de usuarios'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (data: CreateUserData | UpdateUserData) => {
    setIsSubmitting(true)
    try {
      await usersService.create(data as CreateUserData)
      setFeedbackType('success')
      setFeedbackMessage('Usuario creado exitosamente')
      setShowCreateModal(false)
      loadData()
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'crear el usuario'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (data: CreateUserData | UpdateUserData) => {
    if (!selectedUser) return
    setIsSubmitting(true)
    try {
      await usersService.update(selectedUser.id, data as UpdateUserData)
      setFeedbackType('success')
      setFeedbackMessage('Usuario actualizado exitosamente')
      setShowEditModal(false)
      setSelectedUser(null)
      loadData()
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'actualizar el usuario'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    setIsSubmitting(true)
    try {
      await usersService.delete(selectedUser.id)
      setFeedbackType('success')
      setFeedbackMessage('Usuario eliminado exitosamente')
      setShowDeleteModal(false)
      setSelectedUser(null)
      loadData()
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'eliminar el usuario'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.ci || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.roles?.some(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const openView = (user: User) => {
    setSelectedUser(user)
    setShowViewModal(true)
  }

  const openEdit = (user: User) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const openDelete = (user: User) => {
    setSelectedUser(user)
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

        <UsersToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          canCreateUsers={canCreate('users')}
          onCreateUser={() => setShowCreateModal(true)}
        />

        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">Cargando usuarios...</div>
        ) : (
          <UsersTable
            users={filteredUsers}
            canUpdateUsers={canUpdate('users')}
            canDeleteUsers={canDelete('users')}
            currentUserId={currentUser?.id}
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
          <Modal.Header>Crear Usuario</Modal.Header>
          <Modal.Body>
            <UserForm
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
            setSelectedUser(null)
          }}
          size="md"
        >
          <Modal.Header>Editar Usuario</Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <UserForm
                user={selectedUser}
                onSubmit={handleEdit}
                onCancel={() => {
                  setShowEditModal(false)
                  setSelectedUser(null)
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
            setSelectedUser(null)
          }}
          size="md"
        >
          <Modal.Header>Detalles del Usuario</Modal.Header>
          <Modal.Body>
            {selectedUser && <UserView user={selectedUser} />}
          </Modal.Body>
        </Modal.Root>

        {/* Delete Modal */}
        <Modal.Root
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedUser(null)
          }}
          size="sm"
        >
          <Modal.Header>Eliminar Usuario</Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <p>¿Estás seguro de que deseas eliminar a <strong>{selectedUser?.name}</strong>?</p>
              <p className="mt-2 text-sm text-rose-500">Esta acción no se puede deshacer.</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedUser(null)
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
