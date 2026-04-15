import { Trash2, Shield, AlertCircle } from 'lucide-react'
import { Layout } from '@/shared/components/layout/Layout'
import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { RoleForm, RoleView, RolesTable, RolesToolbar } from '../../components/roles'

interface RolesPageViewProps {
  canViewRoles: boolean
  canCreateRoles: boolean
  canUpdateRoles: boolean
  canDeleteRoles: boolean
  loading: boolean
  search: string
  setSearch: (v: string) => void
  feedbackMessage: string
  feedbackType: 'error' | 'success' | ''
  showCreateModal: boolean
  setShowCreateModal: (v: boolean) => void
  showEditModal: boolean
  setShowEditModal: (v: boolean) => void
  showViewModal: boolean
  setShowViewModal: (v: boolean) => void
  showDeleteModal: boolean
  setShowDeleteModal: (v: boolean) => void
  selectedRole: any
  setSelectedRole: (v: any) => void
  isSubmitting: boolean
  permissions: any[]
  handleCreate: (data: any) => Promise<void>
  handleUpdate: (data: any) => Promise<void>
  handleDelete: () => Promise<void>
  filteredRoles: any[]
  openView: (role: any) => void
  openEdit: (role: any) => void
  openDelete: (role: any) => void
}

export function RolesPageView({
  canViewRoles,
  canCreateRoles,
  canUpdateRoles,
  canDeleteRoles,
  loading,
  search,
  setSearch,
  feedbackMessage,
  feedbackType,
  showCreateModal,
  setShowCreateModal,
  showEditModal,
  setShowEditModal,
  showViewModal,
  setShowViewModal,
  showDeleteModal,
  setShowDeleteModal,
  selectedRole,
  setSelectedRole,
  isSubmitting,
  permissions,
  handleCreate,
  handleUpdate,
  handleDelete,
  filteredRoles,
  openView,
  openEdit,
  openDelete
}: RolesPageViewProps) {
  if (!canViewRoles) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/10 py-16 dark:border-wine-900/20 dark:bg-black/20">
          <div className="rounded-2xl bg-rose-500/10 p-4 text-rose-600 shadow-lg shadow-rose-900/10 mb-6">
            <AlertCircle size={48} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Acceso Restringido</h2>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">No posees los privilegios necesarios para administrar roles</p>
        </div>
      </Layout>
    )
  }

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

        <RolesToolbar
          search={search}
          onSearchChange={setSearch}
          total={filteredRoles.length}
          canCreateRoles={canCreateRoles}
          onCreateRole={() => setShowCreateModal(true)}
        />

        {loading ? (
          <div className="rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/5 py-24 text-center dark:border-wine-900/20 dark:bg-black/10">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Sincronizando privilegios...</p>
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/10 py-16 dark:border-wine-900/20 dark:bg-black/20">
            <div className="rounded-2xl bg-gradient-to-br from-wine-600 to-wine-900 p-4 text-white shadow-lg shadow-wine-900/20 mb-6">
              <Shield size={48} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Cátalogo Desierto</h3>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {search 
                ? 'No se hallaron resultados para el filtro aplicado'
                : 'Inicia la configuración de seguridad creando un rol'
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
