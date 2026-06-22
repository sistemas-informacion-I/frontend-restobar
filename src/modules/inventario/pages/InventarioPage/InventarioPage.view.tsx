import { AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import Modal from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { InventarioItem, StockSucursal, EstadoLote, LoteRequest, StockInicialRequest } from '../../services/inventario.service'
import { 
  InventarioToolbar, 
  InventarioTable, 
  InsumoForm, 
  StockInitialForm, 
  StockDrawer 
} from './components'

interface InventarioPageViewProps {
  insumos: any[]
  loading: boolean
  search: string
  setSearch: (val: string) => void
  selectedSucursalId?: number
  setSelectedSucursalId: (id: number) => void
  sucursales: any[]
  feedbackMessage: string
  feedbackType: 'error' | 'success' | ''
  clearFeedback: () => void
  showCreateModal: boolean
  setShowCreateModal: (val: boolean) => void
  showEditModal: boolean
  setShowEditModal: (val: boolean) => void
  showStockDrawer: boolean
  setShowStockDrawer: (val: boolean) => void
  showStockInitialModal: boolean
  setShowStockInitialModal: (val: boolean) => void
  selectedInsumo: InventarioItem | null
  setSelectedInsumo: (val: InventarioItem | null) => void
  selectedStock: StockSucursal | null
  isSubmitting: boolean
  handleCreateInsumo: (data: any) => Promise<{ success: boolean, error?: string }>
  handleUpdateInsumo: (id: number, data: any) => Promise<{ success: boolean, error?: string }>
  handleAgregarLote: (data: LoteRequest) => Promise<{ success: boolean, error?: string }>
  handleCambiarEstadoLote: (idLote: number, estado: EstadoLote, mutateLotes: () => void) => Promise<void>
  handleConfigurarStockInicial: (data: StockInicialRequest) => Promise<{ success: boolean, error?: string }>
  openStockDetails: (insumo: any) => void
  openEditModal: (insumo: InventarioItem) => void
  openStockInitialModal: (insumo: InventarioItem) => void
  user: any
}

export function InventarioPageView(props: InventarioPageViewProps) {
  const {
    insumos, loading, search, setSearch,
    selectedSucursalId, setSelectedSucursalId, sucursales,
    feedbackMessage, feedbackType, clearFeedback,
    showStockDrawer, setShowStockDrawer,
    showStockInitialModal, setShowStockInitialModal,
    selectedInsumo,
    selectedStock,
    handleCreateInsumo, handleUpdateInsumo,
    handleAgregarLote, handleCambiarEstadoLote,
    handleConfigurarStockInicial,
    openStockDetails, openEditModal, openStockInitialModal,
    showCreateModal, setShowCreateModal,
    showEditModal, setShowEditModal,
    isSubmitting,
    user
  } = props

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 animate-in fade-in duration-700">
      
      <InventarioToolbar 
        search={search}
        setSearch={setSearch}
        selectedSucursalId={selectedSucursalId}
        setSelectedSucursalId={setSelectedSucursalId}
        sucursales={sucursales}
        onOpenCreateModal={() => setShowCreateModal(true)}
        user={user}
      />

      <div className="flex justify-end">
        <Link to="/inventario/alertas">
          <Button variant="secondary">Ver alertas</Button>
        </Link>
      </div>

      {/* Page-level Feedback */}
      {feedbackMessage && (
        <div className={`flex items-center gap-3 rounded-2xl border-2 px-6 py-4 animate-in slide-in-from-top-4 duration-500 ${
          feedbackType === 'success' 
            ? 'border-emerald-100 bg-emerald-50/50 text-emerald-800 dark:border-emerald-900/20 dark:bg-emerald-900/10 dark:text-emerald-400' 
            : 'border-rose-100 bg-rose-50/50 text-rose-800 dark:border-rose-900/20 dark:bg-rose-900/10 dark:text-rose-400'
        }`}>
          <AlertCircle size={20} />
          <p className="text-sm font-black uppercase tracking-widest">{feedbackMessage}</p>
          <button onClick={clearFeedback} className="ml-auto text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100">Cerrar</button>
        </div>
      )}

      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-100 border-t-wine-600 shadow-lg" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-wine-600 animate-pulse">Cargando Inventario</p>
          </div>
        </div>
      ) : (
        <InventarioTable 
          insumos={insumos}
          onOpenStockDetails={openStockDetails}
          onOpenEditModal={openEditModal}
          onOpenStockInitialModal={openStockInitialModal}
        />
      )}

      {/* Stock Detail Drawer */}
      {showStockDrawer && selectedInsumo && (
        <StockDrawer 
          insumo={selectedInsumo}
          stock={selectedStock}
          isOpen={showStockDrawer}
          onClose={() => setShowStockDrawer(false)}
          onAddLote={handleAgregarLote}
          onChangeEstado={handleCambiarEstadoLote}
          openStockInitialModal={openStockInitialModal}
        />
      )}

      {/* Create Insumo Modal */}
      <Modal.Root isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} size="lg">
        <Modal.Header>Crear Nuevo Insumo</Modal.Header>
        <Modal.Body>
          <InsumoForm 
            onSubmit={handleCreateInsumo} 
            onCancel={() => setShowCreateModal(false)} 
            isSubmitting={isSubmitting} 
          />
        </Modal.Body>
      </Modal.Root>

      {/* Edit Insumo Modal */}
      <Modal.Root isOpen={showEditModal} onClose={() => setShowEditModal(false)} size="lg">
        <Modal.Header>Editar Insumo</Modal.Header>
        <Modal.Body>
          <InsumoForm 
            insumo={selectedInsumo}
            onSubmit={(data) => handleUpdateInsumo(selectedInsumo?.idInventario!, data)} 
            onCancel={() => setShowEditModal(false)} 
            isSubmitting={isSubmitting} 
          />
        </Modal.Body>
      </Modal.Root>

      {/* Initial Stock Modal */}
      <Modal.Root isOpen={showStockInitialModal} onClose={() => setShowStockInitialModal(false)} size="md">
        <Modal.Header>Configurar Stock Inicial</Modal.Header>
        <Modal.Body>
          {selectedInsumo && (
            <StockInitialForm 
              insumo={selectedInsumo}
              idSucursal={selectedSucursalId!}
              onSubmit={handleConfigurarStockInicial}
              onCancel={() => setShowStockInitialModal(false)}
              isSubmitting={isSubmitting}
            />
          )}
        </Modal.Body>
      </Modal.Root>
    </div>
  )
}
