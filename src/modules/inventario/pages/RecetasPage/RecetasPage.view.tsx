import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { Modal, Select } from '@/shared/components/ui'
import type { InventarioItem } from '@/modules/inventario/services/inventario.service'
import type { ProductoFinal } from '@/modules/comercial/services/productosFinales.service'
import type { Receta, RecetaDuplicarData, RecetaUpsertData } from '../../services/recetas.service'
import { RecetaForm } from './components/RecetaForm.view'
import { RecetasTable } from './components/RecetasTable.view'
import { RecetasToolbar } from './components/RecetasToolbar.view'
import { RecetaView } from './components/RecetaView.view'

interface RecetasPageViewProps {
  recetas: Receta[]
  total: number
  isLoading: boolean
  isSubmitLoading: boolean
  search: string
  onSearchChange: (value: string) => void
  feedbackMessage: string
  feedbackType: 'error' | 'success' | ''
  canReadRecetas: boolean
  canCreateRecetas: boolean
  canUpdateRecetas: boolean
  canDeleteRecetas: boolean
  canSelectSucursal: boolean
  selectedSucursalId?: number
  setSelectedSucursalId: (id: number) => void
  sucursales: Array<{ idSucursal: number; nombre: string }>
  productosFinales: ProductoFinal[]
  insumos: InventarioItem[]
  selectedReceta: Receta | null
  isFormModalOpen: boolean
  setIsFormModalOpen: (open: boolean) => void
  isViewModalOpen: boolean
  setIsViewModalOpen: (open: boolean) => void
  isDuplicateModalOpen: boolean
  setIsDuplicateModalOpen: (open: boolean) => void
  onCreate: () => void
  onEdit: (receta: Receta) => void
  onView: (receta: Receta) => void
  onOpenDuplicate: (receta: Receta) => void
  onDeactivate: (receta: Receta) => Promise<void>
  onDelete: (receta: Receta) => Promise<void>
  onSubmit: (data: RecetaUpsertData) => Promise<void>
  onDuplicate: (data: RecetaDuplicarData) => Promise<void>
  onRecalculateCosto: (receta: Receta) => Promise<void>
}

const toDateInput = (value?: string) => {
  if (!value) return ''
  return value.slice(0, 10)
}

export function RecetasPageView({
  recetas,
  total,
  isLoading,
  isSubmitLoading,
  search,
  onSearchChange,
  feedbackMessage,
  feedbackType,
  canReadRecetas,
  canCreateRecetas,
  canUpdateRecetas,
  canDeleteRecetas,
  canSelectSucursal,
  selectedSucursalId,
  setSelectedSucursalId,
  sucursales,
  productosFinales,
  insumos,
  selectedReceta,
  isFormModalOpen,
  setIsFormModalOpen,
  isViewModalOpen,
  setIsViewModalOpen,
  isDuplicateModalOpen,
  setIsDuplicateModalOpen,
  onCreate,
  onEdit,
  onView,
  onOpenDuplicate,
  onDeactivate,
  onDelete,
  onSubmit,
  onDuplicate,
  onRecalculateCosto,
}: RecetasPageViewProps) {
  const [duplicateName, setDuplicateName] = useState('')
  const [duplicateVersion, setDuplicateVersion] = useState('')
  const [duplicateSucursal, setDuplicateSucursal] = useState<number>(selectedSucursalId || sucursales[0]?.idSucursal || 0)
  const [duplicateInicio, setDuplicateInicio] = useState('')
  const [duplicateFin, setDuplicateFin] = useState('')

  useEffect(() => {
    if (!selectedReceta || !isDuplicateModalOpen) return
    setDuplicateName(`${selectedReceta.nombre} (Copia)`)
    setDuplicateVersion(selectedReceta.versionEtiqueta || '')
    setDuplicateSucursal(selectedSucursalId || selectedReceta.idSucursalReferencia)
    setDuplicateInicio(toDateInput(selectedReceta.fechaVigenciaInicio))
    setDuplicateFin(toDateInput(selectedReceta.fechaVigenciaFin))
  }, [selectedReceta, isDuplicateModalOpen, selectedSucursalId])

  if (!canReadRecetas) {
    return (
      <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 px-6 py-4 text-xs font-bold uppercase tracking-widest text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400">
        No tienes permisos para ver recetas
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {feedbackMessage && (
        <div
          className={`rounded-2xl border px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-lg ${
            feedbackType === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400'
          }`}
        >
          {feedbackMessage}
        </div>
      )}

      <RecetasToolbar
        search={search}
        onSearchChange={onSearchChange}
        total={total}
        canCreate={canCreateRecetas}
        onCreate={onCreate}
      />

      <div className="rounded-[1.75rem] border border-wine-100/30 bg-white/80 p-4 shadow-[0_10px_35px_-18px_rgba(69,10,10,0.2)] backdrop-blur dark:border-wine-900/20 dark:bg-black/25">
        <p className="mb-3 text-xs font-black uppercase tracking-widest text-wine-700 dark:text-wine-300">Sucursal para costos</p>
        <div className="max-w-md">
          <Select
            value={selectedSucursalId}
            onChange={(val) => setSelectedSucursalId(Number(val))}
            options={sucursales.map((s) => ({ value: s.idSucursal, label: s.nombre }))}
            placeholder="Seleccionar sucursal"
            icon={<MapPin size={16} />}
            disabled={!canSelectSucursal}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-wine-100/40 bg-wine-50/30 py-20 dark:border-wine-900/20 dark:bg-wine-950/10">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Cargando recetas...</p>
        </div>
      ) : (
        <RecetasTable
          recetas={recetas}
          canUpdate={canUpdateRecetas}
          canDelete={canDeleteRecetas}
          hasSucursalForCosto={!!selectedSucursalId}
          onView={onView}
          onEdit={onEdit}
          onDuplicate={onOpenDuplicate}
          onDeactivate={onDeactivate}
          onDelete={onDelete}
          onRecalculateCosto={onRecalculateCosto}
        />
      )}

      <Modal.Root isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} size="xl">
        <Modal.Header>{selectedReceta ? 'Editar Receta' : 'Nueva Receta'}</Modal.Header>
        <Modal.Body>
          <RecetaForm
            receta={selectedReceta}
            productosFinales={productosFinales}
            insumos={insumos}
            sucursales={sucursales}
            canSelectSucursal={canSelectSucursal}
            defaultSucursalId={selectedSucursalId}
            isLoading={isSubmitLoading}
            onCancel={() => setIsFormModalOpen(false)}
            onSubmit={onSubmit}
          />
        </Modal.Body>
      </Modal.Root>

      <Modal.Root isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} size="xl">
        <Modal.Header>Detalle de Receta</Modal.Header>
        <Modal.Body>{selectedReceta && <RecetaView receta={selectedReceta} />}</Modal.Body>
      </Modal.Root>

      <Modal.Root isOpen={isDuplicateModalOpen} onClose={() => setIsDuplicateModalOpen(false)} size="md">
        <Modal.Header>Duplicar Receta</Modal.Header>
        <Modal.Body>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault()
              await onDuplicate({
                nombre: duplicateName,
                versionEtiqueta: duplicateVersion || undefined,
                idSucursalReferencia: duplicateSucursal,
                fechaVigenciaInicio: duplicateInicio || undefined,
                fechaVigenciaFin: duplicateFin || undefined,
              })
            }}
          >
            <label className="grid gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Nombre *</span>
              <input
                type="text"
                required
                maxLength={150}
                value={duplicateName}
                onChange={(e) => setDuplicateName(e.target.value)}
                className="rounded-xl border border-wine-100/50 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/20 dark:text-white"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Version</span>
              <input
                type="text"
                maxLength={80}
                value={duplicateVersion}
                onChange={(e) => setDuplicateVersion(e.target.value)}
                className="rounded-xl border border-wine-100/50 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/20 dark:text-white"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Sucursal referencia *</span>
              <select
                value={duplicateSucursal}
                onChange={(e) => setDuplicateSucursal(Number(e.target.value))}
                required
                className="rounded-xl border border-wine-100/50 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/20 dark:text-white"
              >
                {sucursales.map((s) => (
                  <option key={s.idSucursal} value={s.idSucursal}>{s.nombre}</option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Vigencia inicio</span>
                <input
                  type="date"
                  value={duplicateInicio}
                  onChange={(e) => setDuplicateInicio(e.target.value)}
                  className="rounded-xl border border-wine-100/50 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/20 dark:text-white"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Vigencia fin</span>
                <input
                  type="date"
                  value={duplicateFin}
                  onChange={(e) => setDuplicateFin(e.target.value)}
                  className="rounded-xl border border-wine-100/50 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/20 dark:text-white"
                />
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDuplicateModalOpen(false)}
                className="flex-1 rounded-xl border border-wine-100/50 bg-wine-50/40 px-4 py-3 text-sm font-bold uppercase tracking-widest text-wine-700 transition hover:bg-wine-100/60 dark:border-wine-900/30 dark:bg-wine-900/20 dark:text-wine-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitLoading}
                className="flex-1 rounded-xl bg-wine-600 px-4 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-wine-900/20 transition hover:bg-wine-700 disabled:opacity-50 dark:bg-wine-500 dark:hover:bg-wine-600"
              >
                {isSubmitLoading ? 'Duplicando...' : 'Duplicar'}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal.Root>
    </div>
  )
}
