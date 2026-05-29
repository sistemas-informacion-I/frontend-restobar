import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Loader2, MapPin, RotateCcw, CheckCircle2, Clock, XCircle, ShoppingCart, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { PasarelaPagoService, NotaVentaDetail } from '../../services/pasarelaPago.service'
import { httpClient } from '@/core/api/http-client'
import { toast } from 'sonner'
import { useCarrito } from '../../hooks/useCarrito'

const estadoColors: Record<string, string> = {
  PAGADA: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  EMITIDA: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  ANULADA: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  DEVUELTA: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400 border-slate-200 dark:border-slate-800',
}

const stepIcons: Record<string, typeof CheckCircle2> = {
  PAGADA: CheckCircle2,
  EMITIDA: Clock,
  ANULADA: XCircle,
  DEVUELTA: XCircle,
}

const stepColors: Record<string, string> = {
  PAGADA: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
  EMITIDA: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30',
  ANULADA: 'text-rose-500 bg-rose-50 dark:bg-rose-950/30',
  DEVUELTA: 'text-slate-500 bg-slate-50 dark:bg-slate-950/30',
}

export default function PedidoDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { agregarItem } = useCarrito()
  const [pedido, setPedido] = useState<NotaVentaDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isReordering, setIsReordering] = useState(false)

  useEffect(() => {
    const fetchPedido = async () => {
      if (!id) return
      try {
        const idNotaVenta = Number(id)
        const data = await PasarelaPagoService.getNotaVenta(idNotaVenta)
        setPedido(data)
      } catch (error: any) {
        toast.error(error.message || 'Error al cargar el pedido')
        navigate('/mis-pedidos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPedido()
  }, [id, navigate])

  const handleDownloadPDF = async () => {
    if (!pedido?.idNotaVenta) {
      toast.error('No se encontró la nota de venta')
      return
    }

    setIsDownloading(true)
    try {
      const blob = await httpClient.get<any>(`/api/notas-venta/${pedido.idNotaVenta}/pdf`, {
        responseType: 'blob',
        timeout: 30000
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Factura-${pedido.numeroComanda || pedido.idNotaVenta}.pdf`
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

  const handleReordenar = async () => {
    if (!pedido?.detalles) return

    setIsReordering(true)
    try {
      for (const d of pedido.detalles) {
        await agregarItem({
          idProductoFinal: d.idProductoFinal,
          cantidad: d.cantidad,
          notasEspeciales: ''
        })
      }
      toast.success('Productos agregados al carrito')
      navigate('/carrito')
    } catch (error: any) {
      toast.error('Error al reordenar productos')
    } finally {
      setIsReordering(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="h-12 w-12 rounded-full bg-wine-50 dark:bg-wine-950/50 flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-wine-600 dark:text-wine-400" />
        </div>
        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Cargando pedido...</p>
      </div>
    )
  }

  if (!pedido) return null

  const estadoColor = estadoColors[pedido.estado] || estadoColors.EMITIDA
  const StepIcon = stepIcons[pedido.estado] || Clock
  const stepColor = stepColors[pedido.estado] || stepColors.EMITIDA

  const fechaStr = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-wine-100/40 bg-gradient-to-br from-white via-wine-50/30 to-wine-100/20 p-6 sm:p-8 shadow-[0_30px_80px_rgba(76,5,25,0.08)] dark:border-wine-900/20 dark:from-black/70 dark:via-black/55 dark:to-wine-950/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(159,18,57,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(159,18,57,0.05),transparent_30%)]" />
        <div className="relative">
          <button
            onClick={() => navigate('/mis-pedidos')}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-wine-100/50 bg-white/50 text-slate-500 hover:bg-wine-50 dark:border-wine-900/30 dark:bg-black/20 transition-all hover:scale-105 mb-4"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                {pedido.invoiceNumber || pedido.numeroComanda || `Pedido #${pedido.idNotaVenta}`}
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Realizado el {pedido.fechaEmision ? new Date(pedido.fechaEmision).toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
              </p>
            </div>
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider border shrink-0 ${estadoColor}`}>
              <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
              {pedido.estado}
            </span>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className={`rounded-2xl border p-5 flex items-center gap-4 ${stepColor}`}>
        <StepIcon size={28} />
        <div>
          <p className="text-sm font-black uppercase tracking-wider">
            {pedido.estado === 'PAGADA' ? 'Pago Confirmado' : pedido.estado === 'EMITIDA' ? 'Pendiente de Pago' : pedido.estado === 'ANULADA' ? 'Pedido Cancelado' : 'Pedido Devuelto'}
          </p>
          <p className="text-xs mt-0.5 opacity-60">
            {pedido.estado === 'PAGADA' ? 'Tu pedido está siendo preparado' : pedido.estado === 'EMITIDA' ? 'Completa el pago para confirmar' : 'Este pedido no será procesado'}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Order Info Card */}
          <div className="rounded-[2.5rem] border border-wine-100/40 bg-white p-6 sm:p-8 shadow-2xl shadow-wine-900/5 dark:border-wine-900/20 dark:bg-black">
            <h2 className="text-lg font-black tracking-tighter text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="h-8 w-1 rounded-full bg-wine-600" />
              Información del Pedido
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Comanda" value={pedido.numeroComanda || '-'} />
              <InfoRow label="Factura" value={pedido.invoiceNumber || '-'} />
              <InfoRow label="Emitido" value={fechaStr(pedido.fechaEmision)} />
              <InfoRow label="Pagado" value={fechaStr(pedido.fechaPago) || 'Pendiente'} />
              {pedido.nitCliente && <InfoRow label="NIT" value={pedido.nitCliente} />}
              {pedido.nombreMetodoPago && <InfoRow label="Método de pago" value={pedido.nombreMetodoPago} />}
            </div>
            {pedido.observaciones && (
              <div className="mt-4 p-4 bg-wine-50/50 dark:bg-wine-950/20 rounded-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-wine-600/60 dark:text-wine-400/60 mb-1">Observaciones</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{pedido.observaciones}</p>
              </div>
            )}
          </div>

          {/* Customer Card */}
          {(pedido.customerName || pedido.shippingAddress) && (
            <div className="rounded-[2.5rem] border border-wine-100/40 bg-white p-6 sm:p-8 shadow-2xl shadow-wine-900/5 dark:border-wine-900/20 dark:bg-black">
              <h2 className="text-lg font-black tracking-tighter text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="h-8 w-1 rounded-full bg-wine-600" />
                Datos del Cliente
              </h2>
              {pedido.customerName && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-wine-500 to-wine-800 flex items-center justify-center text-white font-bold text-lg">
                    {pedido.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{pedido.customerName}</p>
                    {pedido.customerEmail && <p className="text-xs text-slate-500">{pedido.customerEmail}</p>}
                    {pedido.customerPhone && <p className="text-xs text-slate-500">{pedido.customerPhone}</p>}
                  </div>
                </div>
              )}
              {pedido.shippingAddress && (
                <div className="flex items-start gap-3 mt-4 p-4 bg-slate-50 dark:bg-slate-900/20 rounded-2xl">
                  <MapPin size={16} className="text-wine-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{pedido.shippingAddress}</p>
                    {(pedido.shippingCity || pedido.shippingZip) && (
                      <p className="text-xs text-slate-500 mt-1">
                        {[pedido.shippingCity, pedido.shippingState, pedido.shippingZip].filter(Boolean).join(', ')}
                      </p>
                    )}
                    {pedido.shippingNotes && (
                      <p className="text-xs text-slate-400 italic mt-2">{pedido.shippingNotes}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <div className="rounded-[2.5rem] border border-wine-100/40 bg-white/75 p-6 sm:p-8 shadow-2xl shadow-wine-900/5 dark:border-wine-900/20 dark:bg-black/35 sticky top-6">
            <h2 className="text-lg font-black tracking-tighter text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="h-8 w-1 rounded-full bg-wine-600" />
              Resumen
            </h2>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto custom-scrollbar">
              {pedido.detalles && pedido.detalles.map((d, i) => (
                <div key={i} className="flex justify-between items-start py-2 border-b border-wine-100/20 dark:border-wine-900/20 last:border-0">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-wine-50 text-[10px] font-bold text-wine-700 dark:bg-wine-900/20 dark:text-wine-400 shrink-0">{d.cantidad}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{d.nombreProducto}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Bs {d.precioUnitario.toFixed(2)} c/u</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white ml-3">Bs {d.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t-2 border-wine-100/30 dark:border-wine-900/30">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">Bs {pedido.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Impuestos (13%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">Bs {pedido.impuesto.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t-2 border-wine-100/30 dark:border-wine-900/30">
                <span className="text-base font-black text-slate-900 dark:text-white">TOTAL</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Bs {pedido.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <Button
                fullWidth
                onClick={handleDownloadPDF}
                isLoading={isDownloading}
                className="!rounded-2xl"
                icon={<Download size={16} />}
              >
                Descargar Factura PDF
              </Button>
              <Button
                fullWidth
                variant="secondary"
                onClick={handleReordenar}
                isLoading={isReordering}
                className="!rounded-2xl"
                icon={<RotateCcw size={16} />}
              >
                Volver a Pedir
              </Button>
              <div className="flex gap-2">
                <Button
                  fullWidth
                  variant="ghost"
                  onClick={() => navigate('/catalogo')}
                  className="!rounded-2xl"
                  icon={<ShoppingCart size={14} />}
                >
                  Catálogo
                </Button>
                <Button
                  fullWidth
                  variant="ghost"
                  onClick={() => navigate('/mis-pedidos')}
                  className="!rounded-2xl"
                  icon={<ChevronRight size={14} />}
                >
                  Mis Pedidos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3 border-b border-wine-100/20 dark:border-wine-900/20 last:border-0">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-600/60 dark:text-wine-400/60">{label}</span>
      <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{value}</p>
    </div>
  )
}
