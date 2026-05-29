import { useCallback, useMemo, useState } from 'react'
import { CreditCard, PenSquare, Search, Sparkles, Percent, ShieldCheck } from 'lucide-react'
import { Button, Modal, Switch } from '@/shared/components/ui'
import { getErrorMessage } from '@/core/api'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { MetodoPago, MetodoPagoUpdateData } from '@/modules/electronico/services/metodosPago.service'
import { useMetodosPago } from '@/modules/electronico/hooks/useMetodosPago'

export default function MetodosPagoPage() {
  const { user } = useAuth()
  const { metodosPago, isLoading, isSubmitting, updateMetodoPago, loadError } = useMetodosPago()

  const [search, setSearch] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMetodo, setSelectedMetodo] = useState<MetodoPago | null>(null)
  const [formData, setFormData] = useState<MetodoPagoUpdateData>({})
  const [isSaving, setIsSaving] = useState(false)

  const canUpdate = user?.tipoUsuario === 'S' || user?.tipoUsuario === 'E'

  const filteredMetodos = useMemo(() => {
    if (!search) return metodosPago
    const q = search.toLowerCase()
    return metodosPago.filter((m: MetodoPago) =>
      m.nombre.toLowerCase().includes(q) ||
      (m.descripcion?.toLowerCase().includes(q) ?? false)
    )
  }, [metodosPago, search])

  const activeCount = metodosPago.filter((m: MetodoPago) => m.activo).length

  const showFeedback = useCallback((message: string, type: 'error' | 'success') => {
    setFeedbackMessage(message)
    setFeedbackType(type)
    if (type === 'success') setTimeout(() => { setFeedbackMessage(''); setFeedbackType('') }, 5000)
  }, [])

  const handleEdit = (metodo: MetodoPago) => {
    setSelectedMetodo(metodo)
    setFormData({
      descripcion: metodo.descripcion ?? '',
      comisionPorcentaje: metodo.comisionPorcentaje ?? 0,
      comisionFija: metodo.comisionFija ?? 0,
      activo: metodo.activo,
    })
    setFeedbackMessage('')
    setFeedbackType('')
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!selectedMetodo) return
    setIsSaving(true)
    try {
      await updateMetodoPago({
        id: selectedMetodo.idMetodoPago,
        data: {
          descripcion: formData.descripcion?.trim() || null,
          comisionPorcentaje: Number(formData.comisionPorcentaje ?? 0),
          comisionFija: Number(formData.comisionFija ?? 0),
          activo: Boolean(formData.activo),
        },
      })
      showFeedback('Método actualizado', 'success')
      setIsModalOpen(false)
      setSelectedMetodo(null)
    } catch (error: any) {
      showFeedback(getErrorMessage(error, 'Guardar'), 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleActivo = async (metodo: MetodoPago, checked: boolean) => {
    try {
      await updateMetodoPago({
        id: metodo.idMetodoPago,
        data: {
          descripcion: metodo.descripcion ?? null,
          comisionPorcentaje: metodo.comisionPorcentaje ?? null,
          comisionFija: metodo.comisionFija,
          activo: checked,
        },
      })
      showFeedback(checked ? 'Método activado' : 'Método desactivado', 'success')
    } catch (error: any) {
      showFeedback(getErrorMessage(error, 'Cambiar estado'), 'error')
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-wine-100/40 bg-gradient-to-br from-white via-wine-50/30 to-wine-100/20 p-8 shadow-[0_30px_80px_rgba(76,5,25,0.08)] dark:border-wine-900/20 dark:from-black/70 dark:via-black/55 dark:to-wine-950/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(159,18,57,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(159,18,57,0.08),transparent_30%)]" />
        <div className="relative flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg shadow-wine-900/20">
              <CreditCard size={26} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                Métodos de Pago
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {activeCount} activos de {metodosPago.length} métodos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatBadge icon={<ShieldCheck size={14} />} value={`${activeCount}`} label="Activos" />
            <StatBadge icon={<Percent size={14} />} value={String(metodosPago.length)} label="Totales" />
          </div>
        </div>
      </div>

      {/* Feedback */}
      {feedbackMessage && (
        <div className={`rounded-2xl border-2 px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-lg animate-in fade-in slide-in-from-top-2 duration-500 ${
          feedbackType === 'error'
            ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${feedbackType === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            {feedbackMessage}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar método..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-2xl border border-wine-100/40 bg-white/70 dark:bg-black/30 dark:border-wine-900/20 text-sm font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-wine-500/20 transition-all"
        />
      </div>

      {/* Loading / Error / Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-wine-200 border-t-wine-600" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Cargando...</p>
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 px-6 py-4 text-xs font-bold uppercase tracking-widest text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400">
          {getErrorMessage(loadError, 'Cargar métodos')}
        </div>
      ) : (
        <div className="rounded-[2.5rem] border border-wine-100/40 bg-white/70 shadow-2xl shadow-wine-900/5 dark:border-wine-900/20 dark:bg-black/35 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-wine-100/50 bg-wine-50/40 dark:border-wine-900/20 dark:bg-wine-950/20">
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Método</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60 hidden sm:table-cell">Comisión</th>
                <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Estado</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wine-50 dark:divide-wine-950/30">
              {filteredMetodos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Sparkles size={32} className="text-slate-300 dark:text-slate-600" />
                      <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">Sin resultados</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMetodos.map((metodo: MetodoPago) => (
                  <tr key={metodo.idMetodoPago} className="transition-colors hover:bg-wine-50/30 dark:hover:bg-wine-900/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${metodo.activo ? 'bg-wine-600 text-white' : 'bg-slate-200 text-slate-400 dark:bg-slate-800'}`}>
                          <CreditCard size={18} />
                        </div>
                        <span className="text-sm font-black text-slate-900 dark:text-white">{metodo.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300 hidden sm:table-cell">
                      {Number(metodo.comisionPorcentaje ?? 0).toFixed(1)}% + Bs {Number(metodo.comisionFija ?? 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                        metodo.activo
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${metodo.activo ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {metodo.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Switch
                          checked={metodo.activo}
                          onChange={(checked) => handleToggleActivo(metodo, checked)}
                          disabled={!canUpdate || isSubmitting}
                          label=""
                        />
                        <Button
                          variant="ghost"
                          className="!rounded-xl border border-wine-100/50 bg-white/70 p-2 dark:border-wine-900/20 dark:bg-black/20"
                          onClick={() => handleEdit(metodo)}
                          disabled={!canUpdate}
                          icon={<PenSquare size={16} />}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      <Modal.Root isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
        <Modal.Header>Editar {selectedMetodo?.nombre}</Modal.Header>
        <Modal.Body>
          {selectedMetodo && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">Comisión %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    value={formData.comisionPorcentaje ?? 0}
                    onChange={(e) => setFormData(c => ({ ...c, comisionPorcentaje: Number(e.target.value) }))}
                    className="w-full mt-1 rounded-xl border border-wine-100/50 bg-slate-50/50 py-3 px-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-wine-500/20 dark:bg-black/20 dark:text-white dark:border-wine-900/30"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">Comisión fija</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={formData.comisionFija ?? 0}
                    onChange={(e) => setFormData(c => ({ ...c, comisionFija: Number(e.target.value) }))}
                    className="w-full mt-1 rounded-xl border border-wine-100/50 bg-slate-50/50 py-3 px-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-wine-500/20 dark:bg-black/20 dark:text-white dark:border-wine-900/30"
                  />
                </div>
              </div>
              <Switch
                label="Activo"
                checked={Boolean(formData.activo)}
                onChange={(checked) => setFormData(c => ({ ...c, activo: checked }))}
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="!rounded-2xl">
                  Cancelar
                </Button>
                <Button onClick={handleSave} isLoading={isSaving} className="!rounded-2xl">
                  Guardar
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal.Root>
    </div>
  )
}

function StatBadge({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/60 dark:bg-black/30 backdrop-blur-sm border border-wine-100/40 dark:border-wine-900/20 px-4 py-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-wine-50 text-wine-600 dark:bg-wine-900/20 dark:text-wine-400">
        {icon}
      </div>
      <div>
        <div className="text-sm font-black text-slate-900 dark:text-white">{value}</div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
      </div>
    </div>
  )
}
