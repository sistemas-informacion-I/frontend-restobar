import { useParams } from 'react-router-dom'
import {
  MapPin,
  Truck,
  Package,
  Clock,
  AlertTriangle,
  Home,
  User,
  Phone,
  Navigation,
  DollarSign,
  ExternalLink,
} from 'lucide-react'
import { useSeguimientoEntrega } from '../../hooks/useEntregas'
import { useSucursalesMapa } from '../../hooks/useSucursales'
import { MapaEntrega } from '../../components/MapaEntrega'
import { Badge } from '@/shared/components/ui/Badge'
import { Loader } from '@/shared/components/ui/Loader'

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  ASIGNADO: 'Asignada',
  EN_CAMINO: 'En Camino',
  ENTREGADO: 'Entregada',
  CANCELADO: 'Cancelada',
}

const ESTADO_COLORS: Record<string, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  ASIGNADO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  EN_CAMINO: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  ENTREGADO: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  CANCELADO: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
}

export function SeguimientoEntregaPage() {
  const { id } = useParams<{ id: string }>()
  const idEntrega = id ? Number(id) : undefined

  const { entrega, isLoading, loadError } = useSeguimientoEntrega(idEntrega)
  const { sucursales } = useSucursalesMapa()

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (loadError || !entrega) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">Entrega no encontrada</p>
        </div>
      </div>
    )
  }

  const osmRouteUrl = entrega.sucursalLatitud && entrega.sucursalLongitud
    ? `https://www.openstreetmap.org/directions?from=${entrega.sucursalLatitud},${entrega.sucursalLongitud}&to=${entrega.latitud},${entrega.longitud}`
    : null

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-wider text-wine-800 dark:text-wine-300">
          Seguimiento de Entrega
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            {entrega.numeroComanda}
          </Badge>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${ESTADO_COLORS[entrega.estado]}`}>
            {ESTADO_LABELS[entrega.estado]}
          </span>
        </div>
      </div>

      <div className="mb-8 rounded-[2rem] border border-wine-100/40 bg-white/70 p-6 shadow-lg dark:border-wine-900/20 dark:bg-black/35">
        <div className="flex items-center justify-between">
          <PasoEntrega
            label="Pendiente" active={true} completed={entrega.estado !== 'PENDIENTE'}
          />
          <div className={`h-0.5 flex-1 ${entrega.estado !== 'PENDIENTE' ? 'bg-wine-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
          <PasoEntrega
            label="Asignado" active={['ASIGNADO', 'EN_CAMINO', 'ENTREGADO'].includes(entrega.estado)}
            completed={['EN_CAMINO', 'ENTREGADO'].includes(entrega.estado)}
          />
          <div className={`h-0.5 flex-1 ${['EN_CAMINO', 'ENTREGADO'].includes(entrega.estado) ? 'bg-wine-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
          <PasoEntrega
            label="En Camino" active={['EN_CAMINO', 'ENTREGADO'].includes(entrega.estado)}
            completed={entrega.estado === 'ENTREGADO'}
          />
          <div className={`h-0.5 flex-1 ${entrega.estado === 'ENTREGADO' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
          <PasoEntrega
            label="Entregado" active={entrega.estado === 'ENTREGADO'} completed={false}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-[2rem] border border-wine-100/40 bg-white/70 p-4 shadow-lg dark:border-wine-900/20 dark:bg-black/35">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-wine-700 dark:text-wine-300">
              <Truck className="h-4 w-4" />
              Mapa de Seguimiento
            </h3>
            <div className="h-[450px] w-full overflow-hidden rounded-2xl">
              <MapaEntrega
                sucursalLat={entrega.sucursalLatitud}
                sucursalLng={entrega.sucursalLongitud}
                sucursalLabel={entrega.nombreSucursal}
                destinoLat={entrega.latitud}
                destinoLng={entrega.longitud}
                destinoLabel="Destino"
                repartidorLat={entrega.latitudActual}
                repartidorLng={entrega.longitudActual}
                repartidorLabel={entrega.nombreEmpleado ?? 'Repartidor'}
                sucursales={sucursales.map((s) => ({ id: s.idSucursal, nombre: s.nombre, lat: s.latitud ?? 0, lng: s.longitud ?? 0 })).filter((s) => s.lat !== 0 && s.lng !== 0)}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-600" />
                Sucursal (origen)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-600" />
                Destino
              </span>
              {entrega.latitudActual != null && (
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-violet-600" />
                  Repartidor
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4 bg-violet-500 opacity-70" style={{ height: 2, borderTop: '1.5px dashed #7c3aed' }} />
                Ruta
              </span>
            </div>
            {(entrega.estado === 'EN_CAMINO' || entrega.estado === 'ASIGNADO')}
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-[2rem] border border-wine-100/40 bg-white/70 p-5 shadow-lg dark:border-wine-900/20 dark:bg-black/35">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-wine-700 dark:text-wine-300">
              Detalles
            </h3>
            <div className="space-y-3">
              <InfoRow icon={MapPin} label="Destino" value={entrega.direccionEntrega} />
              <InfoRow icon={Home} label="Sucursal" value={entrega.nombreSucursal} />
              <InfoRow icon={Navigation} label="Distancia" value={`${entrega.distanciaKm} km`} />
              <InfoRow icon={Clock} label="Tiempo est." value={`~${entrega.tiempoEstimadoMin} min`} />
              <InfoRow icon={DollarSign} label="Costo envio" value={`Bs ${entrega.costoEnvio}`} />
            </div>
          </div>

          {entrega.nombreEmpleado && (
            <div className="rounded-[2rem] border border-wine-100/40 bg-white/70 p-5 shadow-lg dark:border-wine-900/20 dark:bg-black/35">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-wine-700 dark:text-wine-300">
                Repartidor
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wine-100 text-wine-700 dark:bg-wine-900/40 dark:text-wine-300">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{entrega.nombreEmpleado}</p>
                  <p className="text-xs text-slate-500">Repartidor asignado</p>
                </div>
              </div>
            </div>
          )}

          {entrega.nombreCliente && (
            <div className="rounded-[2rem] border border-wine-100/40 bg-white/70 p-5 shadow-lg dark:border-wine-900/20 dark:bg-black/35">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-wine-700 dark:text-wine-300">
                Cliente
              </h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <User className="h-4 w-4 text-slate-400" />
                  {entrega.nombreCliente}
                </p>
                {entrega.telefonoCliente && (
                  <p className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Phone className="h-4 w-4 text-slate-400" />
                    {entrega.telefonoCliente}
                  </p>
                )}
              </div>
            </div>
          )}

          {osmRouteUrl && (
            <a
              href={osmRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-wine-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-wine-700 hover:-translate-y-0.5"
            >
              <ExternalLink className="h-4 w-4" />
              Ver ruta completa en OpenStreetMap
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function PasoEntrega({ label, active, completed }: { label: string; active: boolean; completed: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
          completed
            ? 'bg-emerald-500 text-white'
            : active
            ? 'bg-wine-600 text-white'
            : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
        }`}
      >
        {completed ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <Package className="h-4 w-4" />
        )}
      </div>
      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-sm text-slate-700 dark:text-slate-300">{value}</p>
      </div>
    </div>
  )
}
