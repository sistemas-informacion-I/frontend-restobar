import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { mutate } from 'swr'
import { notaSalidaService, NotaSalidaRequest } from '../../services/notaSalidaService'
import { sucursalService } from '../../../operaciones/services/sucursal.service'
import { inventarioService, StockSucursal } from '../../services/inventario.service'
import { ALERTAS_KEYS } from '../../hooks/useAlertas'
import { toast } from 'sonner'
import Modal from '@/shared/components/ui/Modal'

export function NotasSalidaPage() {
  const [notas, setNotas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [sucursales, setSucursales] = useState<any[]>([])
  const [stockList, setStockList] = useState<StockSucursal[]>([])
  
  // Form state
  const [idSucursal, setIdSucursal] = useState<number>(0)
  const [tipoGasto, setTipoGasto] = useState<string>('SERVICIOS')
  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState<number>(0)
  const [cantidad, setCantidad] = useState<number>(1)
  const [idStockSucursal, setIdStockSucursal] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tiposGasto = ['SERVICIOS', 'ALQUILER', 'SUELDOS', 'MANTENIMIENTO', 'TRANSPORTE', 'IMPUESTOS', 'PERDIDA', 'OTROS']

  useEffect(() => {
    fetchSucursales()
  }, [])

  useEffect(() => {
    if (idSucursal) {
      fetchNotas()
      fetchStock()
    }
  }, [idSucursal])

  const fetchSucursales = async () => {
    try {
      const res = await sucursalService.getAll()
      setSucursales(res)
      if (res.length > 0) setIdSucursal(res[0].idSucursal)
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar sucursales')
    }
  }

  const fetchStock = async () => {
    try {
      const res = await inventarioService.listarStockPorSucursal(idSucursal)
      setStockList(Array.isArray(res) ? res : [])
    } catch (error) {
      console.error(error)
    }
  }

  const fetchNotas = async () => {
    try {
      setLoading(true)
      const res = await notaSalidaService.listar(idSucursal)
      setNotas(res?.content || [])
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar notas de salida')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload: NotaSalidaRequest = {
      idSucursal,
      tipoGasto,
      descripcion,
      detalles: [
        {
          descripcion: descripcion || tipoGasto,
          monto,
          cantidad,
          ...(tipoGasto === 'PERDIDA' && idStockSucursal ? { idStockSucursal } : {})
        }
      ]
    }

    try {
      await notaSalidaService.crear(payload)
      toast.success('Nota de salida creada')
      setShowModal(false)
      setTipoGasto('SERVICIOS')
      setDescripcion('')
      setMonto(0)
      setCantidad(1)
      setIdStockSucursal(0)
      fetchNotas()
      if (idSucursal) {
        await Promise.all([
          mutate(ALERTAS_KEYS.alertas(idSucursal)),
          mutate(ALERTAS_KEYS.alertasPendientesCount(idSucursal)),
        ])
      }
    } catch (error) {
      console.error(error)
      toast.error('Error al crear la nota')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAnular = async (id: number) => {
    if (!window.confirm('¿Seguro que desea anular esta nota de salida?')) return
    try {
      await notaSalidaService.anular(id)
      toast.success('Nota anulada')
      fetchNotas()
      if (idSucursal) {
        await Promise.all([
          mutate(ALERTAS_KEYS.alertas(idSucursal)),
          mutate(ALERTAS_KEYS.alertasPendientesCount(idSucursal)),
        ])
      }
    } catch (error) {
      console.error(error)
      toast.error('Error al anular la nota')
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <select 
            value={idSucursal} 
            onChange={(e) => setIdSucursal(Number(e.target.value))}
            className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium focus:border-wine-500 focus:ring-wine-500"
          >
            {sucursales.map(s => (
              <option key={s.idSucursal} value={s.idSucursal}>{s.nombre}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-wine-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-wine-600/20 hover:bg-wine-700"
        >
          <Plus size={18} />
          Nueva Nota
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-black tracking-wider">Fecha</th>
                <th className="px-6 py-4 font-black tracking-wider">Tipo</th>
                <th className="px-6 py-4 font-black tracking-wider">Monto Total</th>
                <th className="px-6 py-4 font-black tracking-wider">Estado</th>
                <th className="px-6 py-4 font-black tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Cargando...</td></tr>
              ) : notas.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No hay notas de salida.</td></tr>
              ) : notas.map(nota => (
                <tr key={nota.idNotaSalida} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium">{new Date(nota.fecha).toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium">{nota.tipoGasto}</td>
                  <td className="px-6 py-4 font-bold text-wine-600">{nota.montoTotal}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                      nota.estado === 'REGISTRADO' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {nota.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {nota.estado === 'REGISTRADO' && (
                      <button 
                        onClick={() => handleAnular(nota.idNotaSalida)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 uppercase tracking-wider"
                      >
                        Anular
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal.Root isOpen={showModal} onClose={() => setShowModal(false)} size="md">
        <Modal.Header>Registrar Nota de Salida</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Tipo de Gasto</label>
              <select 
                value={tipoGasto} 
                onChange={(e) => setTipoGasto(e.target.value)}
                className="mt-1 w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2 text-sm focus:border-wine-500 focus:ring-wine-500"
              >
                {tiposGasto.map(t => <option key={t} value={t} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">{t}</option>)}
              </select>
            </div>

            {tipoGasto === 'PERDIDA' && (
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Insumo Perdido</label>
                <select 
                  value={idStockSucursal} 
                  onChange={(e) => setIdStockSucursal(Number(e.target.value))}
                  required
                  className="mt-1 w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2 text-sm focus:border-wine-500 focus:ring-wine-500"
                >
                  <option value={0} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Seleccione un insumo...</option>
                  {stockList.map(stock => (
                    <option key={stock.idStock} value={stock.idStock} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                      {stock.nombreInventario || `Stock #${stock.idStock}`} (Disp: {stock.cantidad})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Monto Bs.</label>
                <input 
                  type="number" step="0.01" min="0" required 
                  value={monto} onChange={e => setMonto(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2 text-sm focus:border-wine-500 focus:ring-wine-500"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Cantidad</label>
                <input 
                  type="number" step="0.01" min="0" required 
                  value={cantidad} onChange={e => setCantidad(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2 text-sm focus:border-wine-500 focus:ring-wine-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Descripción / Motivo</label>
              <textarea 
                rows={3} 
                value={descripcion} onChange={e => setDescripcion(e.target.value)}
                className="mt-1 w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2 text-sm focus:border-wine-500 focus:ring-wine-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting || (tipoGasto === 'PERDIDA' && !idStockSucursal)}
                className="flex-1 rounded-xl bg-wine-600 px-4 py-2 text-sm font-bold text-white hover:bg-wine-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal.Root>
    </div>
  )
}
