import { Layout } from '@/shared/components/layout'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import { UserForm, UserView, UsersTable, UsersToolbar } from '../../components/users'

interface UsersPageViewProps {
  canCreate: (p: string) => boolean
  canUpdate: (p: string) => boolean
  canDelete: (p: string) => boolean
  currentUser: any
  isLoading: boolean
  searchTerm: string
  setSearchTerm: (v: string) => void
  feedbackMessage: string
  feedbackType: 'error' | 'success' | ''
  showCreateModal: boolean
  showEditModal: boolean
  showViewModal: boolean
  showDeleteModal: boolean
  selectedUser: any
  isSubmitting: boolean
  handleCreate: (data: any) => Promise<void>
  handleEdit: (data: any) => Promise<void>
  handleDelete: () => Promise<void>
  filteredUsers: any[]
  openCreate: () => void
  openView: (user: any) => void
  openEdit: (user: any) => void
  openDelete: (user: any) => void
  closeModals: () => void
}

export function UsersPageView({
  canCreate,
  canUpdate,
  canDelete,
  currentUser,
  isLoading,
  searchTerm,
  setSearchTerm,
  feedbackMessage,
  feedbackType,
  showCreateModal,
  showEditModal,
  showViewModal,
  showDeleteModal,
  selectedUser,
  isSubmitting,
  handleCreate,
  handleEdit,
  handleDelete,
  filteredUsers,
  openCreate,
  openView,
  openEdit,
  openDelete,
  closeModals
}: UsersPageViewProps) {
  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
        {feedbackMessage && (
          <div className={`mb-6 rounded-2xl border-2 px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-lg ${feedbackType === 'error'
            ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400 shadow-rose-900/5'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400 shadow-emerald-900/5'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${feedbackType === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              {feedbackMessage}
            </div>
          </div>
        )}

        <UsersToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          canCreateUsers={canCreate('users')}
          onCreateUser={openCreate}
        />

        {isLoading ? (
          <div className="rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/5 py-24 text-center dark:border-wine-900/20 dark:bg-black/10">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Sincronizando nómina...</p>
          </div>
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
          onClose={closeModals}
          size="md"
        >
          <Modal.Header>Crear Usuario</Modal.Header>
          <Modal.Body>
            <UserForm
              onSubmit={handleCreate}
              onCancel={closeModals}
              isLoading={isSubmitting}
            />
          </Modal.Body>
        </Modal.Root>

        {/* Edit Modal */}
        <Modal.Root
          isOpen={showEditModal}
          onClose={closeModals}
          size="md"
        >
          <Modal.Header>Editar Usuario</Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <UserForm
                user={selectedUser}
                onSubmit={handleEdit}
                onCancel={closeModals}
                isLoading={isSubmitting}
              />
            )}
          </Modal.Body>
        </Modal.Root>

        {/* View Modal */}
        <Modal.Root
          isOpen={showViewModal}
          onClose={closeModals}
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
          onClose={closeModals}
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
              onClick={closeModals}
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
