import { Modal } from '@/shared/components/ui/Modal'
import { PromocionForm } from './PromocionForm'
import { PromocionDetailView } from './PromocionDetailView'
import type { Promocion, PromocionRequest } from '../models/Promocion'
import type { ProductoFinal } from '../services/productosFinales.service'

interface PromocionModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit' | 'view'
  promocion?: Promocion | null
  sucursales: Array<{ idSucursal: number; nombre: string }>
  productos: ProductoFinal[]
  isLoading?: boolean
  viewError?: string | null
  onSubmit: (data: PromocionRequest) => Promise<void>
}

export function PromocionModal({ isOpen, onClose, mode, promocion, sucursales, productos, isLoading = false, viewError = null, onSubmit }: PromocionModalProps) {
  const headerTitle = mode === 'view' ? 'Ver promoción' : mode === 'edit' ? 'Editar promoción' : 'Nueva promoción'

  return (
    <Modal.Root isOpen={isOpen} onClose={onClose} size={mode === 'view' ? 'xl' : 'lg'}>
      <Modal.Header>{headerTitle}</Modal.Header>
      <Modal.Body>
        {mode === 'view' ? (
          <PromocionDetailView promocion={promocion} isLoading={isLoading} error={viewError} />
        ) : (
          <PromocionForm
            mode={mode}
            promocion={promocion}
            sucursales={sucursales}
            productos={productos}
            isLoading={isLoading}
            onCancel={onClose}
            onSubmit={onSubmit}
          />
        )}
      </Modal.Body>
      {mode === 'view' && (
        <Modal.Footer>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            Cerrar
          </button>
        </Modal.Footer>
      )}
    </Modal.Root>
  )
}
