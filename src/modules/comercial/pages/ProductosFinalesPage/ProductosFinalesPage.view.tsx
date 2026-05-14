import { useEffect, useState } from 'react'
import { Modal } from '@/shared/components/ui/Modal'
import { Select } from '@/shared/components/ui'
import { MapPin, Search, Plus, Store } from 'lucide-react'
import { ProductosFinalesToolbar } from './components/ProductosFinalesToolbar.view'
import { ProductosFinalesTable } from './components/ProductosFinalesTable.view'
import { ProductoFinalForm } from './components/ProductoFinalForm.view'
import { ProductoFinalView } from './components/ProductoFinalView.view'
import { ProductosSucursalesTable } from '../ProductosSucursalesPage/components/ProductosSucursalesTable.view'
import { ProductoSucursalForm } from '../ProductosSucursalesPage/components/ProductoSucursalForm.view'
import { ProductoSucursal } from '../../hooks/useProductosSucursales'
import { ProductoFinal, ProductoFinalRequest } from '../../services/productosFinales.service'
import { Categoria } from '../../services/categorias.service'

interface ProductosFinalesPageViewProps {
  productos: ProductoFinal[]
  total: number
  isLoading: boolean
  isSubmitLoading: boolean
  search: string
  onSearchChange: (search: string) => void
  feedbackMessage: string
  feedbackType: 'error' | 'success' | ''
  isFormModalOpen: boolean
  setIsFormModalOpen: (open: boolean) => void
  isViewModalOpen: boolean
  setIsViewModalOpen: (open: boolean) => void
  canManageMaster: boolean
  canSelectSucursal: boolean
  canAssignSucursal: boolean
  canEditSucursal: boolean
  selectedSucursalId?: number
  setSelectedSucursalId: (id: number) => void
  sucursales: Array<{ idSucursal: number; nombre: string }>
  selectedProducto: ProductoFinal | null
  selectedProductoSucursal: ProductoSucursal | null
  categorias: Categoria[]
  searchSucursal: string
  onSearchSucursalChange: (search: string) => void
  productosSucursal: ProductoSucursal[]
  totalSucursal: number
  isSucursalLoading: boolean
  isSucursalFormModalOpen: boolean
  setIsSucursalFormModalOpen: (open: boolean) => void
  isSucursalEditModalOpen: boolean
  setIsSucursalEditModalOpen: (open: boolean) => void
  productosDisponibles: ProductoFinal[]
  productosDisponiblesLoading: boolean
  onCreate: () => void
  onCreateSucursal: () => void
  onEditSucursal: (producto: ProductoSucursal) => void
  onEdit: (producto: ProductoFinal) => void
  onView: (producto: ProductoFinal) => void
  onDelete: (producto: ProductoFinal) => Promise<void>
  onSubmit: (data: ProductoFinalRequest) => Promise<void>
  onAssignSucursal: (idProducto: number, precio: number, disponible: boolean) => Promise<void>
  onUpdateSucursal: (precio: number, disponible: boolean, activo: boolean) => Promise<void>
  isSucursalSubmitLoading: boolean
  sucursalErrorMessage: string
}

export function ProductosFinalesPageView({
  productos,
  total,
  isLoading,
  isSubmitLoading,
  search,
  onSearchChange,
  feedbackMessage,
  feedbackType,
  isFormModalOpen,
  setIsFormModalOpen,
  isViewModalOpen,
  setIsViewModalOpen,
  canManageMaster,
  canSelectSucursal,
  canAssignSucursal,
  canEditSucursal,
  selectedSucursalId,
  setSelectedSucursalId,
  sucursales,
  selectedProducto,
  selectedProductoSucursal,
  categorias,
  searchSucursal,
  onSearchSucursalChange,
  productosSucursal,
  totalSucursal,
  isSucursalLoading,
  isSucursalFormModalOpen,
  setIsSucursalFormModalOpen,
  isSucursalEditModalOpen,
  setIsSucursalEditModalOpen,
  productosDisponibles,
  productosDisponiblesLoading,
  onCreate,
  onCreateSucursal,
  onEditSucursal,
  onEdit,
  onView,
  onDelete,
  onSubmit,
  onAssignSucursal,
  onUpdateSucursal,
  isSucursalSubmitLoading,
  sucursalErrorMessage,
}: ProductosFinalesPageViewProps) {
  const [editPrecio, setEditPrecio] = useState('')
  const [editDisponible, setEditDisponible] = useState(true)
  const [editActivo, setEditActivo] = useState(true)

  useEffect(() => {
    if (!selectedProductoSucursal) return
    setEditPrecio(String(selectedProductoSucursal.precio ?? 0))
    setEditDisponible(Boolean(selectedProductoSucursal.disponible))
    setEditActivo(Boolean(selectedProductoSucursal.activo))
  }, [selectedProductoSucursal])

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {feedbackMessage && !isFormModalOpen && !isViewModalOpen && (
        <div
          className={`rounded-2xl border px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-lg animate-in fade-in slide-in-from-top-2 duration-500 ${
            feedbackType === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400 shadow-rose-900/5'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400 shadow-emerald-900/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${feedbackType === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            {feedbackMessage}
          </div>
        </div>
      )}

      {canManageMaster && (
        <>
          <ProductosFinalesToolbar
            search={search}
            onSearchChange={onSearchChange}
            total={total}
            onCreate={onCreate}
          />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-wine-100/40 bg-wine-50/30 py-20 dark:border-wine-900/20 dark:bg-wine-950/10">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">
                Cargando productos...
              </p>
            </div>
          ) : (
            <ProductosFinalesTable
              productos={productos}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}
        </>
      )}

      <section className="rounded-[1.75rem] border border-wine-100/30 bg-white/70 p-6 shadow-[0_12px_40px_-18px_rgba(69,10,10,0.18)] backdrop-blur dark:border-wine-900/20 dark:bg-black/30">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-wine-600 dark:text-wine-400">Comercial</p>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{canManageMaster ? 'Precio y Disponibilidad por Sucursal' : 'Mis productos'}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {canManageMaster
                ? `Gestiona ${totalSucursal} producto(s) asignado(s) a la sucursal seleccionada`
                : `Gestiona ${totalSucursal} producto(s) de tu sucursal`}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            {canSelectSucursal && (
              <div className="w-full sm:min-w-[260px]">
                <Select
                  value={selectedSucursalId}
                  onChange={(val) => setSelectedSucursalId(Number(val))}
                  options={sucursales.map((s) => ({ value: s.idSucursal, label: s.nombre }))}
                  placeholder="Seleccionar sucursal"
                  icon={<MapPin size={18} />}
                />
              </div>
            )}

            {canAssignSucursal && (
              <button
                onClick={onCreateSucursal}
                disabled={!selectedSucursalId}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-wine-600 px-5 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-wine-900/20 transition hover:bg-wine-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-wine-500 dark:hover:bg-wine-600"
              >
                <Plus className="h-4 w-4" />
                Asignar
              </button>
            )}
          </div>
        </div>

        <div className="mb-5 group relative max-w-xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-wine-600" />
          <input
            type="text"
            placeholder="Buscar por código, nombre..."
            value={searchSucursal}
            onChange={(e) => onSearchSucursalChange(e.target.value)}
            className="w-full rounded-2xl border border-wine-100/50 bg-white/90 pl-10 pr-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400/70 outline-none transition-all duration-300 focus:border-wine-500 focus:bg-white focus:ring-4 focus:ring-wine-500/10 hover:border-wine-300 dark:border-wine-900/30 dark:bg-black/20 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-wine-600 dark:focus:bg-black/40"
          />
        </div>

        {!!selectedSucursalId && (
          <div className="mb-5 rounded-xl border border-wine-200/50 bg-wine-50/50 px-4 py-3 dark:border-wine-900/30 dark:bg-wine-900/10">
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-wine-700 dark:text-wine-300" />
              <p className="text-xs font-bold text-wine-800 dark:text-wine-200">
                Sucursal #{selectedSucursalId} seleccionada para gestionar precios y disponibilidad.
              </p>
            </div>
          </div>
        )}

        {isSucursalLoading ? (
          <div className="flex flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-wine-100/40 bg-wine-50/30 py-16 dark:border-wine-900/20 dark:bg-wine-950/10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Cargando asignaciones...</p>
          </div>
        ) : (
          <ProductosSucursalesTable productos={productosSucursal} canEdit={canEditSucursal} onEdit={onEditSucursal} />
        )}
      </section>

      {/* Modal Crear / Editar */}
      {canManageMaster && (
        <Modal.Root isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} size="lg">
          <Modal.Header>{selectedProducto ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Header>
          <Modal.Body>
            {feedbackMessage && feedbackType === 'error' && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-[10px] font-black uppercase tracking-widest text-rose-600 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-400 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  {feedbackMessage}
                </div>
              </div>
            )}
            <ProductoFinalForm
              producto={selectedProducto}
              categorias={categorias}
              isLoading={isSubmitLoading}
              onCancel={() => setIsFormModalOpen(false)}
              onSubmit={onSubmit}
            />
          </Modal.Body>
        </Modal.Root>
      )}

      {/* Modal Ver detalle */}
      {canManageMaster && (
        <Modal.Root isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} size="lg">
          <Modal.Header>Detalle del Producto</Modal.Header>
          <Modal.Body>{selectedProducto && <ProductoFinalView producto={selectedProducto} />}</Modal.Body>
        </Modal.Root>
      )}

      <Modal.Root isOpen={isSucursalFormModalOpen} onClose={() => setIsSucursalFormModalOpen(false)} size="lg">
        <Modal.Header>Asignar Producto a Sucursal</Modal.Header>
        <Modal.Body>
          {(feedbackType === 'error' || sucursalErrorMessage) && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-[10px] font-black uppercase tracking-widest text-rose-600 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-400 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                {sucursalErrorMessage || feedbackMessage}
              </div>
            </div>
          )}
          <ProductoSucursalForm
            productosDisponibles={productosDisponibles}
            productosLoading={productosDisponiblesLoading}
            isLoading={isSucursalSubmitLoading}
            onCancel={() => setIsSucursalFormModalOpen(false)}
            onSubmit={onAssignSucursal}
          />
        </Modal.Body>
      </Modal.Root>

      <Modal.Root isOpen={isSucursalEditModalOpen} onClose={() => setIsSucursalEditModalOpen(false)} size="md">
        <Modal.Header>Actualizar precio y estado</Modal.Header>
        <Modal.Body>
          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault()
              await onUpdateSucursal(Number(editPrecio || 0), editDisponible, editActivo)
            }}
          >
            <label className="grid gap-2">
              <span className="text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">Precio (Bs) *</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={editPrecio}
                onChange={(e) => setEditPrecio(e.target.value)}
                required
                className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-wine-400 dark:focus:ring-wine-900/30"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">Disponible</span>
                <select
                  value={editDisponible ? 'true' : 'false'}
                  onChange={(e) => setEditDisponible(e.target.value === 'true')}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-wine-400 dark:focus:ring-wine-900/30"
                >
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">Estado</span>
                <select
                  value={editActivo ? 'true' : 'false'}
                  onChange={(e) => setEditActivo(e.target.value === 'true')}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-wine-400 dark:focus:ring-wine-900/30"
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSucursalEditModalOpen(false)}
                className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold uppercase tracking-widest text-slate-700 transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                disabled={isSucursalSubmitLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-wine-600 px-4 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-wine-700 active:scale-95 disabled:opacity-50 dark:bg-wine-500 dark:hover:bg-wine-600"
                disabled={isSucursalSubmitLoading}
              >
                {isSucursalSubmitLoading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal.Root>
    </div>
  )
}
