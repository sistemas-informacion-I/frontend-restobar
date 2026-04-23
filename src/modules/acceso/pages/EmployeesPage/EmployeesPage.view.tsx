import { Layout } from '@/shared/components/layout'
import { Modal } from '@/shared/components/ui/Modal'
import { EmployeesToolbar } from './components/EmployeesToolbar.view'
import { EmployeesTable } from './components/EmployeesTable.view'
import { EmployeeForm } from './components/EmployeeForm.view'
import { EmployeeView } from './components/EmployeeView.view'
import { Empleado, CreateEmpleadoData } from '@/modules/acceso/services/empleados.service'
import { Role } from '@/modules/acceso/services/api'

interface EmployeesPageViewProps {
  employees: Empleado[]
  roles: Role[]
  isLoading: boolean
  isSubmitLoading: boolean
  search: string
  onSearchChange: (search: string) => void
  feedbackMessage: string
  feedbackType: 'error' | 'success' | ''
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
  isFormModalOpen: boolean
  setIsFormModalOpen: (open: boolean) => void
  isViewModalOpen: boolean
  setIsViewModalOpen: (open: boolean) => void
  selectedEmployee: Empleado | null
  onCreate: () => void
  onEdit: (employee: Empleado) => void
  onView: (employee: Empleado) => void
  onDelete: (employee: Empleado) => void
  onSubmit: (data: CreateEmpleadoData) => Promise<void>
}

export function EmployeesPageView({
  employees,
  roles,
  isLoading,
  isSubmitLoading,
  search,
  onSearchChange,
  feedbackMessage,
  feedbackType,
  canCreate,
  canUpdate,
  canDelete,
  isFormModalOpen,
  setIsFormModalOpen,
  isViewModalOpen,
  setIsViewModalOpen,
  selectedEmployee,
  onCreate,
  onEdit,
  onView,
  onDelete,
  onSubmit,
}: EmployeesPageViewProps) {
  return (
    <Layout>
      <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
        {/* Feedback Section (Following Project Pattern) */}
        {feedbackMessage && !isFormModalOpen && !isViewModalOpen && (
          <div className={`rounded-2xl border-2 px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-lg animate-in fade-in slide-in-from-top-2 duration-500 ${
            feedbackType === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400 shadow-rose-900/5'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400 shadow-emerald-900/5'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${feedbackType === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              {feedbackMessage}
            </div>
          </div>
        )}

        <EmployeesToolbar
          search={search}
          onSearchChange={onSearchChange}
          canCreate={canCreate}
          onCreate={onCreate}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-wine-50/10 rounded-[2.5rem] border-2 border-dashed border-wine-100/50 dark:bg-black/10 dark:border-wine-900/20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Sincronizando nómina...</p>
          </div>
        ) : (
          <EmployeesTable
            employees={employees}
            canUpdate={canUpdate}
            canDelete={canDelete}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}

        {/* Create/Edit Modal */}
        <Modal.Root
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          size="lg"
        >
          <Modal.Header>
            {selectedEmployee ? 'Actualizar Expediente' : 'Nueva Contratación'}
          </Modal.Header>
          <Modal.Body>
            {/* Feedback inside Modal */}
            {feedbackMessage && feedbackType === 'error' && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-[10px] font-black uppercase tracking-widest text-rose-600 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-400 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  {feedbackMessage}
                </div>
              </div>
            )}
            <EmployeeForm
              employee={selectedEmployee}
              roles={roles}
              isLoading={isSubmitLoading}
              onCancel={() => setIsFormModalOpen(false)}
              onSubmit={onSubmit}
            />
          </Modal.Body>
        </Modal.Root>

        {/* View Modal */}
        <Modal.Root
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          size="lg"
        >
          <Modal.Header>Expediente de Personal</Modal.Header>
          <Modal.Body>
            {selectedEmployee && <EmployeeView employee={selectedEmployee} />}
          </Modal.Body>
        </Modal.Root>
      </div>
    </Layout>
  )
}
