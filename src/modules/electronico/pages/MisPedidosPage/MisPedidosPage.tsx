import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Clock, ArrowRight, Search, Filter, X, ReceiptText, Truck } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { PasarelaPagoService, NotaVentaDetail } from '../../services/pasarelaPago.service'
import { toast } from 'sonner'

type TabKey = 'todos' | 'pagada' | 'pendiente' | 'cancelada'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'pagada', label: 'Pagados' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'cancelada', label: 'Cancelados' },
]

const estadoColors: Record<string, string> = {
  PAGADA: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  EMITIDA: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  ANULADA: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  DEVUELTA: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400 border-slate-200 dark:border-slate-800',
}

const deliveryLabels: Record<string, string> = {
  PENDIENTE: 'Pendiente de repartidor',
  ASIGNADO: 'Repartidor asignado',
  EN_CAMINO: 'En camino',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

const deliveryColors: Record<string, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  ASIGNADO: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  EN_CAMINO: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  ENTREGADO: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  CANCELADO: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
}

const timelineDots: Record<string, string> = {
  PAGADA: 'bg-emerald-500 ring-emerald-200 dark:ring-emerald-800',
  EMITIDA: 'bg-amber-500 ring-amber-200 dark:ring-amber-800',
  ANULADA: 'bg-rose-500 ring-rose-200 dark:ring-rose-800',
  DEVUELTA: 'bg-slate-500 ring-slate-200 dark:ring-slate-800',
}

export default function MisPedidosPage() {
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState<NotaVentaDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>('todos')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await PasarelaPagoService.getMisPedidos()
        setPedidos(data)
      } catch (error: any) {
        toast.error(error.message || 'Error al cargar tus pedidos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPedidos()
  }, [])

  const filteredPedidos = useMemo(() => {
    let result = pedidos

    if (activeTab !== 'todos') {
      const estadoMap: Record<TabKey, string[]> = {
        todos: [],
        pagada: ['PAGADA'],
        pendiente: ['EMITIDA'],
        cancelada: ['ANULADA', 'DEVUELTA'],
      }
      result = result.filter(p => estadoMap[activeTab].includes(p.estado))
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      result = result.filter(p =>
        (p.numeroComanda && p.numeroComanda.toLowerCase().includes(q)) ||
        (p.invoiceNumber && p.invoiceNumber.toLowerCase().includes(q)) ||
        (p.customerName && p.customerName.toLowerCase().includes(q)) ||
        p.idNotaVenta.toString().includes(q)
      )
    }

    return result
  }, [pedidos, activeTab, searchTerm])

  const counts = useMemo(() => ({
    todos: pedidos.length,
    pagada: pedidos.filter(p => p.estado === 'PAGADA').length,
    pendiente: pedidos.filter(p => p.estado === 'EMITIDA').length,
    cancelada: pedidos.filter(p => p.estado === 'ANULADA' || p.estado === 'DEVUELTA').length,
  }), [pedidos])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-300">
        <div className="h-32 rounded-[2.5rem] bg-wine-50/50 dark:bg-wine-950/20 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 rounded-[2rem] bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-wine-100/40 bg-gradient-to-br from-white via-wine-50/30 to-wine-100/20 p-8 shadow-[0_30px_80px_rgba(76,5,25,0.08)] dark:border-wine-900/20 dark:from-black/70 dark:via-black/55 dark:to-wine-950/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(159,18,57,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(159,18,57,0.08),transparent_30%)]" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg shadow-wine-900/20">
            <ShoppingBag size={24} />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Mis Pedidos</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'} realizados
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs + Search */}
      {pedidos.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-2xl">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${activeTab === tab.key ? 'bg-white dark:bg-slate-700 text-wine-700 dark:text-wine-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                {tab.label}
                <span className={`ml-1.5 text-[10px] ${activeTab === tab.key ? 'opacity-100' : 'opacity-50'}`}>({counts[tab.key]})</span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar pedido..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-wine-100/40 bg-white/75 dark:bg-black/35 dark:border-wine-900/20 text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-wine-500/20 transition-all"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {pedidos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-6 rounded-[2.5rem] border border-wine-100/40 bg-white/75 p-12 text-center shadow-2xl shadow-wine-900/5 dark:border-wine-900/20 dark:bg-black/35">
          <div className="relative">
            <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-wine-50 to-wine-100 dark:from-wine-950/50 dark:to-wine-900/30">
              <ReceiptText size={56} className="text-wine-200 dark:text-wine-700" />
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <ShoppingBag size={18} className="text-emerald-500" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No tienes pedidos aún</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">Explora nuestro catálogo y haz tu primer pedido. ¡Te va a encantar!</p>
          </div>
          <Button onClick={() => navigate('/catalogo')} icon={<ArrowRight size={16} />}>
            Ver Catálogo
          </Button>
        </div>
      ) : filteredPedidos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 rounded-[2.5rem] border border-wine-100/40 bg-white/75 p-12 text-center shadow-2xl shadow-wine-900/5 dark:border-wine-900/20 dark:bg-black/35">
          <Filter size={40} className="text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No se encontraron pedidos con estos filtros</p>
          <Button variant="ghost" size="sm" onClick={() => { setActiveTab('todos'); setSearchTerm('') }}>
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPedidos.map((pedido, idx) => (
            <PedidoCard
              key={pedido.idNotaVenta}
              pedido={pedido}
              onClick={() => navigate(`/mis-pedidos/${pedido.idNotaVenta}`)}
              animationDelay={idx * 80}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface PedidoCardProps {
  pedido: NotaVentaDetail
  onClick: () => void
  animationDelay?: number
}

function PedidoCard({ pedido, onClick, animationDelay = 0 }: PedidoCardProps) {
  const navigate = useNavigate()
  const estadoColor = estadoColors[pedido.estado] || estadoColors.EMITIDA
  const dotColor = timelineDots[pedido.estado] || timelineDots.EMITIDA
  const fecha = pedido.fechaEmision
    ? new Date(pedido.fechaEmision).toLocaleDateString('es-BO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '-'
  const estadoEntrega = (pedido as any).estadoEntrega as string | undefined
  const idEntrega = (pedido as any).idEntrega as number | undefined

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[2rem] border border-wine-100/50 bg-white/75 p-5 sm:p-6 text-left shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-wine-900/10 hover:-translate-y-0.5 dark:border-wine-900/20 dark:bg-black/35 hover:dark:bg-black/45 animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: timeline dot + info */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center pt-1">
            <div className={`h-3.5 w-3.5 rounded-full ring-4 ${dotColor}`} />
            <div className="w-0.5 flex-1 min-h-[calc(100%-1rem)] bg-slate-200 dark:bg-slate-700 mt-1 rounded-full" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                {pedido.invoiceNumber || pedido.numeroComanda || `Pedido #${pedido.idNotaVenta}`}
              </h3>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border ${estadoColor}`}>
                {pedido.estado}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {fecha}
              </span>
              {pedido.customerName && (
                <span className="text-slate-400 dark:text-slate-500">{pedido.customerName}</span>
              )}
            </div>
            {pedido.detalles && pedido.detalles.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {pedido.detalles.slice(0, 3).map((d, i) => (
                  <span key={i} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-wine-600 dark:text-wine-400">{d.cantidad}x</span> {d.nombreProducto}
                  </span>
                ))}
                {pedido.detalles.length > 3 && (
                  <span className="text-[10px] text-slate-400">+{pedido.detalles.length - 3} más</span>
                )}
            {estadoEntrega && (
              <div className="flex items-center gap-2 mt-2">
                <Truck size={12} className={estadoEntrega === 'EN_CAMINO' ? 'text-indigo-500' : 'text-slate-400'} />
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${deliveryColors[estadoEntrega] || 'bg-slate-100 text-slate-600'}`}>
                  {deliveryLabels[estadoEntrega] || estadoEntrega}
                </span>
                {idEntrega && (
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/entregas/${idEntrega}/seguimiento`) }}
                    className="ml-auto rounded-lg bg-wine-50 px-2.5 py-1 text-[10px] font-bold text-wine-700 transition-colors hover:bg-wine-100 dark:bg-wine-900/20 dark:text-wine-300 dark:hover:bg-wine-900/40"
                  >
                    Ver seguimiento
                  </button>
                )}
              </div>
            )}
          </div>
            )}
          </div>
        </div>

        {/* Right: total + arrow */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white whitespace-nowrap">
            Bs {pedido.total.toFixed(2)}
          </span>
          <ArrowRight size={18} className="text-slate-300 dark:text-slate-600" />
        </div>
      </div>
    </button>
  )
}
