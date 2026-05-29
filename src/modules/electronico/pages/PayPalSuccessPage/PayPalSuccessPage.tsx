import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, MapPin, ArrowLeft, Download, Package, Loader2, Sparkles, ShoppingBag } from 'lucide-react'
import ReactConfetti from 'react-confetti'
import { Button } from '@/shared/components/ui'
import { PasarelaPagoService, NotaVentaDetail } from '../../services/pasarelaPago.service'
import { httpClient } from '@/core/api/http-client'
import { toast } from 'sonner'

const steps = [
  { key: 'capturing', label: 'Procesando pago' },
  { key: 'verifying', label: 'Verificando' },
  { key: 'done', label: 'Confirmado' },
]

export default function PayPalSuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const invoiceRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [notaVenta, setNotaVenta] = useState<NotaVentaDetail | null>(null)
  const [captureError, setCaptureError] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  const [animatedTotal, setAnimatedTotal] = useState(0)

  const handleResize = useCallback(() => {
    setWindowSize({ w: window.innerWidth, h: window.innerHeight })
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  useEffect(() => {
    const token = searchParams.get('token')
    const PayerID = searchParams.get('PayerID')

    if (!token || !PayerID) {
      toast.error('Parámetros de pago inválidos')
      navigate('/catalogo')
      return
    }

    const captureAndShow = async () => {
      try {
        setActiveStep(0)
        await new Promise(r => setTimeout(r, 800))
        setActiveStep(1)

        const captureData = await httpClient.get<any>(`/api/paypal/success?token=${encodeURIComponent(token)}&PayerID=${encodeURIComponent(PayerID || '')}`)

        const transaccion = captureData.transaccion
        const idNotaVenta = transaccion?.idNotaVenta

        if (!idNotaVenta) {
          throw new Error('No se encontró la nota de venta')
        }

        sessionStorage.setItem('ultimaNotaVentaId', String(idNotaVenta))

        const notaVentaData = await PasarelaPagoService.getNotaVenta(idNotaVenta)
        setNotaVenta(notaVentaData)
        setActiveStep(2)
        setShowConfetti(true)

        setTimeout(() => setShowConfetti(false), 6000)
        animateTotal(notaVentaData.total)
      } catch (error: any) {
        setCaptureError(error.message || 'Error al procesar el pago')
      }
    }

    captureAndShow()
  }, [searchParams, navigate])

  const animateTotal = (target: number) => {
    const duration = 1500
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedTotal(Math.round(target * eased * 100) / 100)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  const handleDownloadPDF = async () => {
    if (!notaVenta?.idNotaVenta) {
      toast.error('No se encontró la nota de venta')
      return
    }

    setIsDownloading(true)
    try {
      const blob = await httpClient.get<any>(`/api/notas-venta/${notaVenta.idNotaVenta}/pdf`, {
        responseType: 'blob',
        timeout: 30000
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Factura-${notaVenta.numeroComanda || notaVenta.idNotaVenta}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('Factura descargada correctamente')
    } catch (error: any) {
      console.error('PDF Error:', error)
      toast.error('Error al descargar el PDF')
    } finally {
      setIsDownloading(false)
    }
  }

  if (captureError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="rounded-[2.5rem] border border-rose-200 bg-rose-50 p-12 text-center shadow-2xl dark:border-rose-900/30 dark:bg-rose-950/30">
          <h2 className="text-2xl font-black text-rose-700 dark:text-rose-400 mb-2">Error en el pago</h2>
          <p className="text-sm text-rose-600 dark:text-rose-400 mb-6">{captureError}</p>
          <Button onClick={() => navigate('/checkout')} icon={<ArrowLeft size={16} />}>
            Volver al checkout
          </Button>
        </div>
      </div>
    )
  }

  if (!notaVenta) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-wine-50 to-emerald-50 dark:from-wine-950/50 dark:to-emerald-950/50 flex items-center justify-center">
            <Loader2 size={40} className="animate-spin text-wine-600 dark:text-wine-400" />
          </div>
          <div className="absolute inset-0 animate-ping rounded-full border-2 border-wine-200 dark:border-wine-800 opacity-30" />
        </div>
        <div className="space-y-4 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-300/40">{steps[activeStep]?.label || 'Procesando...'}</p>
          <div className="flex items-center justify-center gap-3">
            {steps.map((step, idx) => (
              <div key={step.key} className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${idx < activeStep ? 'bg-emerald-500' : idx === activeStep ? 'bg-wine-500 animate-pulse' : 'bg-slate-200 dark:bg-slate-700'}`} />
                <span className={`text-[10px] font-semibold uppercase tracking-wider transition-colors duration-500 ${idx <= activeStep ? 'text-slate-700 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600'}`}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const fechaEmision = notaVenta.fechaEmision ? new Date(notaVenta.fechaEmision).toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'
  const fechaPago = notaVenta.fechaPago ? new Date(notaVenta.fechaPago).toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {showConfetti && <ReactConfetti width={windowSize.w} height={windowSize.h} recycle={false} numberOfPieces={400} colors={['#ac111a', '#10b981', '#fbbf24', '#3b82f6', '#ec4899', '#8b5cf6']} />}

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-200/40 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/20 p-8 sm:p-12 shadow-[0_30px_80px_rgba(16,185,129,0.1)] dark:border-emerald-900/20 dark:from-emerald-950/30 dark:via-black/70 dark:to-black/55">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_30%)]" />
        <div className="absolute top-4 right-4 opacity-10">
          <Sparkles size={120} className="text-emerald-500" />
        </div>
        <div className="relative flex flex-col items-center gap-5 text-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl shadow-emerald-900/30">
              <CheckCircle2 size={48} className="animate-in zoom-in duration-500" />
            </div>
            <div className="absolute -inset-3 rounded-full border-2 border-emerald-200 dark:border-emerald-800 animate-ping opacity-30" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              ¡Pago Procesado!
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Tu pedido ha sido confirmado y está siendo preparado. Recibirás una notificación cuando esté listo.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Order Info Card */}
          <div ref={invoiceRef} className="rounded-[2.5rem] border border-wine-100/40 bg-white p-6 sm:p-8 shadow-2xl shadow-wine-900/5 dark:border-wine-900/20 dark:bg-black relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-wine-50 to-transparent dark:from-wine-950/20 rounded-bl-full opacity-50" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg shadow-wine-900/20">
                  <ShoppingBag size={22} />
                </div>
                <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">Recibo Digital</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-600/60 dark:text-wine-400/60">Comanda</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{notaVenta.numeroComanda || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-600/60 dark:text-wine-400/60">Factura</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{notaVenta.invoiceNumber || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-600/60 dark:text-wine-400/60">Emitido</span>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{fechaEmision}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-600/60 dark:text-wine-400/60">Pagado</span>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{fechaPago}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-600/60 dark:text-wine-400/60">Estado</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> {notaVenta.estado}
                  </span>
                </div>
                {notaVenta.nitCliente && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-600/60 dark:text-wine-400/60">NIT</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{notaVenta.nitCliente}</p>
                  </div>
                )}
              </div>

              {notaVenta.detalles && notaVenta.detalles.length > 0 && (
                <div className="mt-6 pt-6 border-t border-wine-100/30 dark:border-wine-900/30">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-600/60 dark:text-wine-400/60">Productos</span>
                  <div className="mt-3 space-y-2">
                    {notaVenta.detalles.map((d, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-wine-50 dark:border-wine-900/10 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-wine-50 text-[10px] font-bold text-wine-700 dark:bg-wine-900/20 dark:text-wine-400">{d.cantidad}x</span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{d.nombreProducto}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">Bs {d.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Data Card */}
          {(notaVenta.shippingAddress || notaVenta.customerName) && (
            <div className="rounded-[2.5rem] border border-wine-100/40 bg-white/75 p-6 sm:p-8 shadow-2xl shadow-wine-900/5 dark:border-wine-900/20 dark:bg-black/35">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg shadow-wine-900/20">
                  <MapPin size={20} />
                </div>
                <h2 className="text-lg font-black tracking-tighter text-slate-900 dark:text-white">Datos del Cliente</h2>
              </div>
              <div className="space-y-3">
                {notaVenta.customerName && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-wine-500 to-wine-800 flex items-center justify-center text-white font-bold text-sm">
                      {notaVenta.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{notaVenta.customerName}</p>
                      {notaVenta.customerEmail && <p className="text-xs text-slate-500 dark:text-slate-400">{notaVenta.customerEmail}</p>}
                    </div>
                  </div>
                )}
                {notaVenta.shippingAddress && (
                  <div className="bg-wine-50/50 dark:bg-wine-950/20 rounded-2xl p-4 mt-3">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{notaVenta.shippingAddress}</p>
                    {(notaVenta.shippingCity || notaVenta.shippingZip) && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {[notaVenta.shippingCity, notaVenta.shippingState, notaVenta.shippingZip].filter(Boolean).join(', ')}
                      </p>
                    )}
                    {notaVenta.shippingNotes && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-2">"{notaVenta.shippingNotes}"</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary Sidebar */}
        <div className="space-y-6">
          <div className="rounded-[2.5rem] border border-wine-100/40 bg-white/75 p-6 sm:p-8 shadow-2xl shadow-wine-900/5 dark:border-wine-900/20 dark:bg-black/35 sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg shadow-wine-900/20">
                <Package size={20} />
              </div>
              <h2 className="text-lg font-black tracking-tighter text-slate-900 dark:text-white">Resumen</h2>
            </div>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto custom-scrollbar">
              {notaVenta.detalles && notaVenta.detalles.map((detalle, idx) => (
                <div key={idx} className="flex justify-between items-start py-2 border-b border-wine-100/20 dark:border-wine-900/20 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{detalle.nombreProducto}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">x{detalle.cantidad} · Bs {detalle.precioUnitario.toFixed(2)} c/u</p>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white ml-3">Bs {detalle.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6 pt-4 border-t-2 border-wine-100/30 dark:border-wine-900/30">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">Bs {notaVenta.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Impuestos (13%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">Bs {notaVenta.impuesto.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t-2 border-wine-100/30 dark:border-wine-900/30">
                <span className="text-base font-black text-slate-900 dark:text-white">TOTAL</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Bs {animatedTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                fullWidth
                className="!rounded-2xl"
                icon={<Download size={16} />}
                onClick={handleDownloadPDF}
                isLoading={isDownloading}
              >
                Descargar Factura PDF
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => navigate('/catalogo')}
                className="!rounded-2xl"
                icon={<ArrowLeft size={16} />}
              >
                Seguir Comprando
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={() => navigate('/mis-pedidos')}
                className="!rounded-2xl"
                icon={<Package size={16} />}
              >
                Ver mis pedidos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
