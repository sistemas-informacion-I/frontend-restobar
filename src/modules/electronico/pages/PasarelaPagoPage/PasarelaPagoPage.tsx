import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle2, XCircle, Sparkles, CreditCard, RefreshCw, ReceiptText, AlertTriangle, Banknote, Loader2 } from 'lucide-react'
import { Button, Input, Select, Switch } from '@/shared/components/ui'
import { getErrorMessage } from '@/core/api'
import { usePasarelaPago } from '@/modules/electronico/hooks/usePasarelaPago'
import { MetodoPagoOnline, TransaccionOnlineResumen } from '@/modules/electronico/services/pasarelaPago.service'

export default function PasarelaPagoPage() {
  const { idComanda } = useParams()
  const comandaId = idComanda ? Number(idComanda) : undefined
  const { contexto, transacciones, isLoading, iniciarPago, confirmarPago, loadError } = usePasarelaPago(comandaId)

  const [idMetodoPago, setIdMetodoPago] = useState<number | ''>('')
  const [nitCliente, setNitCliente] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [propina, setPropina] = useState('0')
  const [descuento, setDescuento] = useState('0')
  const [sandbox, setSandbox] = useState(true)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null)

  const metodosOnline = useMemo(() => {
    return (contexto?.metodosOnline ?? contexto?.metodosPago ?? []).filter((metodo: MetodoPagoOnline) => {
      const nombre = metodo.nombre.toLowerCase()
      return metodo.activo && !nombre.includes('efectivo')
    })
  }, [contexto])

  const selectedMetodo = metodosOnline.find((metodo: MetodoPagoOnline) => metodo.idMetodoPago === idMetodoPago)
  const totalBase = contexto?.notaVenta?.total ?? contexto?.comanda?.total ?? 0
  const transaccionActual = contexto?.transaccionActual ?? transacciones[0] ?? null

  const showFeedback = (message: string, type: 'error' | 'success') => {
    setFeedbackMessage(message)
    setFeedbackType(type)
    if (type === 'success') {
      setTimeout(() => {
        setFeedbackMessage('')
        setFeedbackType('')
      }, 5000)
    }
  }

  const handleIniciarPago = async () => {
    if (!comandaId) {
      showFeedback('Debes abrir la pasarela con un id de comanda válido.', 'error')
      return
    }

    if (!idMetodoPago) {
      showFeedback('Selecciona un método de pago online.', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      await iniciarPago({
        idComanda: comandaId,
        idMetodoPago: Number(idMetodoPago),
        nitCliente: nitCliente.trim() || null,
        observaciones: observaciones.trim() || null,
        propina: Number(propina || 0),
        descuento: Number(descuento || 0),
        moneda: 'BOB',
        sandbox,
      })
      showFeedback('Transacción inicializada correctamente en modo sandbox.', 'success')
    } catch (error: any) {
      showFeedback(getErrorMessage(error, 'Iniciar pago'), 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmar = async (estado: 'APROBADA' | 'RECHAZADA') => {
    const target = selectedTransactionId
      ? transacciones.find((tx: TransaccionOnlineResumen) => tx.idTransaccion === selectedTransactionId) ?? transaccionActual
      : transaccionActual

    if (!target) {
      showFeedback('No hay una transacción seleccionada para confirmar.', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      await confirmarPago(target.idTransaccion, {
        estado,
        codigoAutorizacion: estado === 'APROBADA' ? `SBX-${target.numeroTransaccion}` : null,
        codigoError: estado === 'RECHAZADA' ? 'sandbox_rejected' : null,
        datosAdicionales: {
          sandbox,
          metodoPago: selectedMetodo?.nombre ?? target.numeroTransaccion,
          idComanda: comandaId,
        },
      })
      showFeedback(estado === 'APROBADA' ? 'Pago aprobado y comanda liberada para cocina.' : 'Pago rechazado. El cliente puede reintentar.', estado === 'APROBADA' ? 'success' : 'error')
    } catch (error: any) {
      showFeedback(getErrorMessage(error, 'Confirmar pago'), 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-wine-100/40 bg-gradient-to-br from-white via-wine-50/30 to-wine-100/20 p-8 shadow-[0_30px_80px_rgba(76,5,25,0.08)] dark:border-wine-900/20 dark:from-black/70 dark:via-black/55 dark:to-wine-950/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(159,18,57,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(159,18,57,0.08),transparent_30%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="space-y-3">
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-5xl">
                Checkout sandbox con PayPal / Stripe
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Esta pantalla prepara la venta online, inicia la transacción con el método seleccionado y deja visibles los estados de webhook para simular la confirmación o el rechazo sin tocar todavía el flujo productivo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[34rem]">
            <StatCard icon={<ReceiptText size={18} />} label="Comanda" value={contexto?.comanda?.numeroComanda ?? 'Pendiente'} />
            <StatCard icon={<CreditCard size={18} />} label="Métodos" value={metodosOnline.length} />
            <StatCard icon={<Banknote size={18} />} label="Total" value={`Bs ${totalBase.toFixed(2)}`} />
            <StatCard icon={<Sparkles size={18} />} label="Sandbox" value={sandbox ? 'Activo' : 'Off'} />
          </div>
        </div>
      </div>

      {feedbackMessage && (
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

      {loadError && (
        <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 px-6 py-4 text-xs font-bold uppercase tracking-widest text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400">
          {getErrorMessage(loadError, 'Cargar contexto de pasarela')}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/10 py-20 dark:border-wine-900/20 dark:bg-black/10">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Cargando contexto de pasarela...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2.5rem] border border-wine-100/40 bg-white/75 p-6 shadow-2xl shadow-wine-900/5 dark:border-wine-900/20 dark:bg-black/35">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">Datos del checkout</h2>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-wine-900/35 dark:text-wine-300/35">Selección online sin efectivo</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-300">
              <AlertTriangle size={14} />
              Idempotencia y firma webhook pendientes en backend
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="NIT del cliente"
              value={nitCliente}
              onChange={(event) => setNitCliente(event.target.value)}
              placeholder="Opcional para factura futura"
            />
            <Input
              label="Propina"
              type="number"
              min={0}
              step="0.01"
              value={propina}
              onChange={(event) => setPropina(event.target.value)}
            />
            <Input
              label="Descuento"
              type="number"
              min={0}
              step="0.01"
              value={descuento}
              onChange={(event) => setDescuento(event.target.value)}
            />
            <div className="flex items-end">
              <Switch
                label="Modo sandbox"
                description="Usa cuentas de prueba"
                checked={sandbox}
                onChange={setSandbox}
                icon={<Sparkles size={18} />}
              />
            </div>
          </div>

          <div className="mt-4">
            <Input
              label="Observaciones de cobro"
              value={observaciones}
              onChange={(event) => setObservaciones(event.target.value)}
              placeholder="Notas para la transacción o la factura futura"
            />
          </div>

          <div className="mt-6 rounded-[2rem] border border-wine-100/40 bg-wine-50/30 p-5 dark:border-wine-900/20 dark:bg-wine-950/20">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-wine-600 text-white shadow-lg shadow-wine-900/20">
                <CreditCard size={18} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">Método de pago online</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-wine-900/35 dark:text-wine-300/35">Se excluye efectivo automáticamente</p>
              </div>
            </div>

            {metodosOnline.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-wine-200 bg-white/70 p-8 text-center dark:border-wine-900/20 dark:bg-black/20">
                <Loader2 className="mx-auto mb-3 animate-spin text-wine-500" size={24} />
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">No hay métodos online disponibles</p>
              </div>
            ) : (
              <Select
                value={idMetodoPago}
                onChange={(value) => setIdMetodoPago(Number(value))}
                placeholder="Elegir método online"
                options={metodosOnline.map((metodo: MetodoPagoOnline) => ({ value: metodo.idMetodoPago, label: `${metodo.nombre} · ${Number(metodo.comisionPorcentaje ?? 0).toFixed(2)}%` }))}
              />
            )}

            {selectedMetodo && (
              <div className="mt-4 rounded-[1.75rem] border border-wine-100/40 bg-white/80 p-4 dark:border-wine-900/20 dark:bg-black/25">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">{selectedMetodo.nombre}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{selectedMetodo.descripcion || 'Sin descripción'}</p>
                  </div>
                  <span className="rounded-full border border-wine-100/40 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-wine-800 dark:border-wine-900/20 dark:text-wine-300">
                    {selectedMetodo.comisionPorcentaje ?? 0}% + Bs {Number(selectedMetodo.comisionFija ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              className="!rounded-2xl bg-gradient-to-r from-wine-600 to-wine-950 px-6 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-wine-900/20"
              onClick={handleIniciarPago}
              isLoading={isSubmitting}
              icon={<RefreshCw size={16} />}
            >
              Iniciar pago sandbox
            </Button>
            <Button
              variant="ghost"
              className="!rounded-2xl border border-wine-100/50 bg-white/70 px-6 text-[10px] font-black uppercase tracking-widest dark:border-wine-900/20 dark:bg-black/20"
              onClick={() => void 0}
              icon={<ReceiptText size={16} />}
            >
              Vista previa de nota de venta
            </Button>
          </div>
        </section>

        <aside className="flex flex-col gap-6">
          <section className="rounded-[2.5rem] border border-wine-100/40 bg-white/75 p-6 shadow-2xl shadow-wine-900/5 dark:border-wine-900/20 dark:bg-black/35">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">Estado de la transacción</h2>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-wine-900/35 dark:text-wine-300/35">Webhook / callback / reintento</p>
              </div>
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)]" />
            </div>

            {transaccionActual ? (
              <div className="space-y-4">
                <StatusItem label="Transacción" value={transaccionActual.numeroTransaccion} />
                <StatusItem label="Estado" value={transaccionActual.estado} />
                <StatusItem label="Monto" value={`Bs ${Number(transaccionActual.monto).toFixed(2)}`} />
                <StatusItem label="Moneda" value={transaccionActual.moneda} />
                <StatusItem label="Fecha inicio" value={transaccionActual.fechaInicio} />
                <StatusItem label="Fecha completado" value={transaccionActual.fechaCompletado || 'Pendiente'} />
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-wine-200 bg-wine-50/30 p-6 dark:border-wine-900/20 dark:bg-wine-950/20">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Aún no hay transacción iniciada para esta comanda.</p>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                className="!rounded-2xl bg-emerald-600 px-4 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20"
                onClick={() => {
                  void handleConfirmar('APROBADA')
                }}
                isLoading={isSubmitting}
                icon={<CheckCircle2 size={16} />}
              >
                Aprobar sandbox
              </Button>
              <Button
                className="!rounded-2xl bg-rose-600 px-4 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-900/20"
                onClick={() => {
                  void handleConfirmar('RECHAZADA')
                }}
                isLoading={isSubmitting}
                icon={<XCircle size={16} />}
              >
                Rechazar sandbox
              </Button>
            </div>
          </section>

          <section className="rounded-[2.5rem] border border-wine-100/40 bg-white/75 p-6 shadow-2xl shadow-wine-900/5 dark:border-wine-900/20 dark:bg-black/35">
            <h2 className="mb-4 text-xl font-black tracking-tighter text-slate-900 dark:text-white">Transacciones recientes</h2>
            <div className="flex flex-col gap-3">
              {transacciones.length === 0 ? (
                <div className="rounded-[1.75rem] border border-dashed border-wine-200 bg-wine-50/30 p-6 dark:border-wine-900/20 dark:bg-wine-950/20">
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No hay movimientos todavía.</p>
                </div>
              ) : (
                transacciones.map((transaccion: TransaccionOnlineResumen) => (
                  <button
                    key={transaccion.idTransaccion}
                    type="button"
                    onClick={() => setSelectedTransactionId(transaccion.idTransaccion)}
                    className={`rounded-[1.75rem] border p-4 text-left transition-all duration-300 ${
                      selectedTransactionId === transaccion.idTransaccion
                        ? 'border-wine-500 bg-wine-50/80 shadow-lg shadow-wine-900/10 dark:border-wine-500/40 dark:bg-wine-900/20'
                        : 'border-wine-100/40 bg-white/70 hover:bg-wine-50/50 dark:border-wine-900/20 dark:bg-black/20 dark:hover:bg-black/35'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{transaccion.numeroTransaccion}</p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-wine-900/35 dark:text-wine-300/35">{transaccion.estado}</p>
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">Bs {Number(transaccion.monto).toFixed(2)}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>
        </aside>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="rounded-[1.75rem] border border-white/60 bg-white/80 p-4 shadow-lg shadow-wine-900/5 backdrop-blur dark:border-wine-900/20 dark:bg-black/35">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-wine-50 text-wine-600 dark:bg-wine-900/20 dark:text-wine-400">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{label}</span>
        <span className="text-lg font-black tracking-tighter text-slate-900 dark:text-white">{value}</span>
      </div>
    </div>
  )
}

function StatusItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-wine-100/40 bg-wine-50/30 px-4 py-3 dark:border-wine-900/20 dark:bg-wine-950/20">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/35 dark:text-wine-300/35">{label}</span>
      <span className="max-w-[70%] truncate text-sm font-black text-slate-900 dark:text-white">{value}</span>
    </div>
  )
}