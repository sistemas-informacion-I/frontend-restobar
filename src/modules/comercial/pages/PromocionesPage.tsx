import { useCallback, useMemo, useState } from 'react'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { useSucursales } from '@/modules/operaciones/hooks/useSucursales'
import { useProductosFinales } from '../hooks/useProductosFinales'
import { usePromociones } from '../hooks/usePromociones'
import { PromocionModal } from '../components/PromocionModal'
import { PromocionTable } from '../components/PromocionTable'
import { PromocionesStatsCards } from '../components/PromocionesStatsCards'
import type { Promocion, PromocionRequest } from '../models/Promocion'

export default function PromocionesPage() {
  const { user, canRead } = useAuth()
  const { sucursales } = useSucursales()
  const { productos } = useProductosFinales({ activo: true })
  const { promociones, dashboard, loading, error, success, crear, editar, eliminar, activar, desactivar, buscarPorId } = usePromociones()

  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('')
  const [tipo, setTipo] = useState('')
  const [idSucursal, setIdSucursal] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create')
  const [selectedPromocion, setSelectedPromocion] = useState<Promocion | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')

  const canManagePromociones = canRead('producto') || user?.tipoUsuario === 'S' || user?.tipoUsuario === 'E'

  const showFeedback = useCallback((message: string, type: 'error' | 'success') => {
    setFeedbackMessage(message)
    setFeedbackType(type)
    if (type === 'success') {
      setTimeout(() => {
        setFeedbackMessage('')
        setFeedbackType('')
      }, 4000)
    }
  }, [])

  const filteredPromociones = useMemo(() => {
    return promociones.filter((promocion) => {
      const matchesSearch = !search || promocion.nombre.toLowerCase().includes(search.toLowerCase())
      const matchesEstado = !estado || promocion.estado === estado
      const matchesTipo = !tipo || promocion.tipo === tipo
      const matchesSucursal = !idSucursal || String(promocion.idSucursal) === idSucursal
      return matchesSearch && matchesEstado && matchesTipo && matchesSucursal
    })
  }, [promociones, search, estado, tipo, idSucursal])

  const sucursalesById = useMemo(() => {
    return sucursales.reduce<Record<number, string>>((accumulator, sucursal) => {
      accumulator[sucursal.idSucursal] = sucursal.nombre
      return accumulator
    }, {})
  }, [sucursales])

  const openCreateModal = () => {
    setModalMode('create')
    setSelectedPromocion(null)
    setDetailError(null)
    setIsDetailLoading(false)
    setIsModalOpen(true)
  }

  const openViewModal = async (promocion: Promocion) => {
    setModalMode('view')
    setIsModalOpen(true)
    setSelectedPromocion(null)
    setDetailError(null)
    setIsDetailLoading(true)
    try {
      const detalle = await buscarPorId(promocion.id)
      setSelectedPromocion(detalle)
    } catch (err: any) {
      setDetailError(err?.message || 'No se pudo cargar la promoción')
      setSelectedPromocion(promocion)
    } finally {
      setIsDetailLoading(false)
    }
  }

  const openEditModal = async (promocion: Promocion) => {
    setModalMode('edit')
    setDetailError(null)
    try {
      const detalle = await buscarPorId(promocion.id)
      setSelectedPromocion(detalle)
    } catch {
      setSelectedPromocion(promocion)
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (data: PromocionRequest) => {
    setIsSubmitting(true)
    try {
      if (selectedPromocion) {
        await editar(selectedPromocion.id, data)
        showFeedback('Promoción actualizada correctamente', 'success')
      } else {
        await crear(data)
        showFeedback('Promoción creada correctamente', 'success')
      }
      setIsModalOpen(false)
    } catch (err: any) {
      showFeedback(err?.message || 'No se pudo guardar la promoción', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (promocion: Promocion) => {
    if (!window.confirm(`¿Eliminar la promoción "${promocion.nombre}"?`)) return
    try {
      await eliminar(promocion.id)
      showFeedback('Promoción eliminada correctamente', 'success')
    } catch (err: any) {
      showFeedback(err?.message || 'No se pudo eliminar la promoción', 'error')
    }
  }

  const handleActivate = async (promocion: Promocion) => {
    if (promocion.editable === false) return
    if (promocion.estado === 'FINALIZADA') return
    const canActivateByState = promocion.estado === 'INACTIVA' || (promocion.estado === 'PROGRAMADA' && promocion.activo !== true)
    if (!canActivateByState) return
    try {
      await activar(promocion.id)
      showFeedback('Promoción activada correctamente', 'success')
    } catch (err: any) {
      showFeedback(err?.message || 'No se pudo activar la promoción', 'error')
    }
  }

  const handleDeactivate = async (promocion: Promocion) => {
    if (promocion.editable === false) return
    if (promocion.estado === 'FINALIZADA') return
    const canDeactivateByState = promocion.estado === 'ACTIVA' || (promocion.estado === 'PROGRAMADA' && promocion.activo === true)
    if (!canDeactivateByState) return
    try {
      await desactivar(promocion.id)
      showFeedback('Promoción desactivada correctamente', 'success')
    } catch (err: any) {
      showFeedback(err?.message || 'No se pudo desactivar la promoción', 'error')
    }
  }

  if (!canManagePromociones) {
    return (
      <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-lg dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400">
        No tienes permisos para gestionar promociones.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {(feedbackMessage || error || success) && (
        <div className={`rounded-2xl border-2 px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-lg ${feedbackType === 'error' || error ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400' : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400'}`}>
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${feedbackType === 'error' || error ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            {feedbackMessage || error || success}
          </div>
        </div>
      )}

      <section className="rounded-[1.75rem] border border-wine-100/30 bg-white/70 p-6 shadow-[0_12px_40px_-18px_rgba(69,10,10,0.18)] backdrop-blur dark:border-wine-900/20 dark:bg-black/30">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-wine-600 dark:text-wine-400">Comercial</p>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Gestión de promociones</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Administra promociones vigentes por sucursal y producto.</p>
          </div>

          <button onClick={openCreateModal} className="inline-flex h-14 items-center justify-center rounded-2xl bg-wine-600 px-5 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-wine-900/20 transition hover:bg-wine-700 active:scale-95">
            Nueva promoción
          </button>
        </div>

        <PromocionesStatsCards stats={dashboard} />

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="grid gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Buscar</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre" className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          </label>

          <label className="grid gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Estado</span>
            <select value={estado} onChange={(event) => setEstado(event.target.value)} className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
              <option value="">Todos</option>
              <option value="PROGRAMADA">Programadas</option>
              <option value="ACTIVA">Activa</option>
              <option value="INACTIVA">Inactiva</option>
              <option value="FINALIZADA">Finalizada</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Sucursal</span>
            <select value={idSucursal} onChange={(event) => setIdSucursal(event.target.value)} className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
              <option value="">Todas</option>
              {sucursales.map((sucursal) => (
                <option key={sucursal.idSucursal} value={sucursal.idSucursal}>{sucursal.nombre}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Tipo</span>
            <select value={tipo} onChange={(event) => setTipo(event.target.value)} className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
              <option value="">Todos</option>
              <option value="PORCENTAJE">Porcentaje</option>
              <option value="MONTO_FIJO">Monto fijo</option>
              <option value="COMPRA_MINIMA">Compra mínima</option>
              <option value="DOS_POR_UNO">2x1</option>
              <option value="COMBO">Combo</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-wine-100/40 bg-wine-50/30 py-20 dark:border-wine-900/20 dark:bg-wine-950/10">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Cargando promociones...</p>
          </div>
        ) : (
          <PromocionTable
            promociones={filteredPromociones}
            sucursalesById={sucursalesById}
            onView={openViewModal}
            onEdit={openEditModal}
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
            onDelete={handleDelete}
            isSubmitting={isSubmitting}
          />
        )}
      </section>

      <PromocionModal
        mode={modalMode}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setIsDetailLoading(false)
          setDetailError(null)
        }}
        promocion={selectedPromocion}
        sucursales={sucursales}
        productos={productos}
        isLoading={modalMode === 'view' ? isDetailLoading : isSubmitting}
        viewError={modalMode === 'view' ? detailError : null}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
