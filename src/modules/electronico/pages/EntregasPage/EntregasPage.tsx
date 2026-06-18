import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package,
  MapPin,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Navigation,
  Loader2,
  AlertTriangle,
  DollarSign,
  User,
  Phone,
  ChevronRight,
  Satellite,
  SatelliteDish,
  MapPinned,
  Store,
  Crosshair,
  Map,
} from 'lucide-react'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import {
  useEntregasPendientes,
  useMisEntregas,
  useAceptarEntrega,
  useIniciarViaje,
  useMarcarEntregado,
} from '../../hooks/useEntregas'
import { useGeolocation } from '../../hooks/useGeolocation'
import { useSucursalesMapa } from '../../hooks/useSucursales'
import { entregaService } from '../../services/entrega.service'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { Loader } from '@/shared/components/ui/Loader'
import { toast } from 'sonner'
import { LeafletMapModal } from '../../components/LeafletMapModal'
import { MapaEntrega } from '../../components/MapaEntrega'
import type { EntregaResponse, DisponibilidadResponse } from '../../models/entrega.model'
import type { SucursalMapa } from '../../models/sucursal.model'

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

export function EntregasPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'pendientes' | 'mias'>('pendientes')
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [availabilityMap, setAvailabilityMap] = useState<Record<number, DisponibilidadResponse | null>>({})
  const [mapModalOpen, setMapModalOpen] = useState(false)

  const esCliente = user?.tipoUsuario === 'C'

  useEffect(() => {
    if (esCliente) {
      navigate('/mis-pedidos', { replace: true })
    }
  }, [esCliente, navigate])

  const esAdmin = useMemo(() => {
    if (!user?.roles) return false
    return user.roles.some((r) => r.name === 'SUPERUSER' || r.name === 'ADMIN')
  }, [user])

  const {
    entregas: pendientes,
    isLoading: loadingPendientes,
    refresh: refreshPendientes,
  } = useEntregasPendientes()

  const {
    entregas: misEntregas,
    isLoading: loadingMias,
    refresh: refreshMias,
  } = useMisEntregas()

  const { aceptarEntrega, isAceptando } = useAceptarEntrega()
  const { iniciarViaje, isIniciando } = useIniciarViaje()
  const { marcarEntregado, isMarcando } = useMarcarEntregado()

  const geo = useGeolocation()
  const { sucursales } = useSucursalesMapa()

  if (esCliente) return null

  const handleVerificarDisponibilidad = async (idEntrega: number) => {
    try {
      const result = await entregaService.verificarDisponibilidad(idEntrega, geo.latitude ?? undefined, geo.longitude ?? undefined)
      setAvailabilityMap((prev) => ({ ...prev, [idEntrega]: result }))
      return result
    } catch {
      toast.error('Error al verificar disponibilidad')
      return null
    }
  }

  const handleAceptar = async (idEntrega: number) => {
    setProcessingId(idEntrega)
    try {
      await aceptarEntrega({ idEntrega, latitud: geo.latitude ?? undefined, longitud: geo.longitude ?? undefined })
      toast.success('Entrega aceptada')
      refreshPendientes()
      refreshMias()
    } catch (e: any) {
      toast.error(e?.message || 'Error al aceptar la entrega')
    } finally {
      setProcessingId(null)
    }
  }

  const handleIniciarViaje = async (idEntrega: number) => {
    setProcessingId(idEntrega)
    try {
      await iniciarViaje({ idEntrega })
      toast.success('Viaje iniciado')
      refreshMias()
    } catch (e: any) {
      toast.error(e?.message || 'Error al iniciar el viaje')
    } finally {
      setProcessingId(null)
    }
  }

  const handleMarcarEntregado = async (idEntrega: number) => {
    setProcessingId(idEntrega)
    try {
      await marcarEntregado({ idEntrega })
      toast.success('Entrega completada')
      refreshMias()
    } catch (e: any) {
      toast.error(e?.message || 'Error al completar la entrega')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-wider text-wine-800 dark:text-wine-300">
          Gestion de Entregas
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Administra las entregas pendientes y realiza el seguimiento de tus pedidos asignados.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {geo.permission === 'granted' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <Satellite className="h-3.5 w-3.5" />
              {geo.isManual ? 'GPS manual' : 'GPS activo'}
              {geo.latitude != null && (
                <span className="ml-1 opacity-60">
                  {geo.latitude.toFixed(4)}, {geo.longitude?.toFixed(4)}
                </span>
              )}
            </span>
          ) : geo.permission === 'denied' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
              <SatelliteDish className="h-3.5 w-3.5" />
              GPS denegado
            </span>
          ) : geo.permission === 'unavailable' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              <AlertTriangle className="h-3.5 w-3.5" />
              GPS no disponible
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Solicitando ubicacion...
            </span>
          )}
        </div>
      </div>

      {esAdmin && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-800/30 dark:bg-amber-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
              <Crosshair className="h-4 w-4" />
              Simular ubicacion GPS (Admin)
            </div>
            <button
              onClick={() => setMapModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-wine-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-wine-700"
            >
              <Map className="h-4 w-4" />
              Abrir mapa
            </button>
          </div>
          <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
            Haz click en el mapa o arrastra el marcador para simular la ubicacion del repartidor.
          </p>
          {geo.latitude != null && geo.longitude != null && (
            <p className="mt-1 font-mono text-[10px] text-slate-400">
              Posicion actual: {geo.latitude.toFixed(6)}, {geo.longitude.toFixed(6)}
            </p>
          )}
        </div>
      )}

      <LeafletMapModal
        open={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        onConfirm={(lat, lng) => {
          geo.setManualPosition(lat, lng)
          toast.success(`GPS simulado: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
        }}
        initialLat={geo.latitude ?? -17.783327}
        initialLng={geo.longitude ?? -63.1821404}
        sucursales={sucursales.map((s) => ({ id: s.idSucursal, nombre: s.nombre, lat: s.latitud ?? 0, lng: s.longitud ?? 0 })).filter((s) => s.lat !== 0 && s.lng !== 0)}
      />

      <div className="mb-6 flex gap-1 rounded-2xl bg-wine-100/50 p-1 dark:bg-wine-900/20">
        <button
          onClick={() => setTab('pendientes')}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
            tab === 'pendientes'
              ? 'bg-white text-wine-700 shadow-lg dark:bg-wine-800 dark:text-wine-200'
              : 'text-slate-600 hover:text-wine-700 dark:text-slate-400'
          }`}
        >
          <Package className="mr-2 inline h-4 w-4" />
          Pendientes ({pendientes.length})
        </button>
        <button
          onClick={() => setTab('mias')}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
            tab === 'mias'
              ? 'bg-white text-wine-700 shadow-lg dark:bg-wine-800 dark:text-wine-200'
              : 'text-slate-600 hover:text-wine-700 dark:text-slate-400'
          }`}
        >
          <Truck className="mr-2 inline h-4 w-4" />
          Mis Entregas ({misEntregas.filter((e) => e.estado !== 'ENTREGADO' && e.estado !== 'CANCELADO').length})
        </button>
      </div>

      {tab === 'pendientes' && (
        <div className="space-y-4">
          {loadingPendientes ? (
            <Loader />
          ) : pendientes.length === 0 ? (
            <EmptyState icon={Package} message="No hay entregas pendientes" />
          ) : (
            pendientes.map((entrega) => (
              <EntregaCard
                key={entrega.idEntrega}
                entrega={entrega}
                sucursales={sucursales}
                availability={availabilityMap[entrega.idEntrega] ?? null}
                onVerificar={() => handleVerificarDisponibilidad(entrega.idEntrega)}
                onAceptar={() => handleAceptar(entrega.idEntrega)}
                loading={processingId === entrega.idEntrega && isAceptando}
                repartidorLat={geo.latitude}
                repartidorLng={geo.longitude}
              />
            ))
          )}
        </div>
      )}

      {tab === 'mias' && (
        <div className="space-y-4">
          {loadingMias ? (
            <Loader />
          ) : misEntregas.filter((e) => e.estado !== 'ENTREGADO' && e.estado !== 'CANCELADO').length === 0 ? (
            <EmptyState icon={Truck} message="No tienes entregas activas" />
          ) : (
            misEntregas
              .filter((e) => e.estado !== 'ENTREGADO' && e.estado !== 'CANCELADO')
              .map((entrega) => (
                <MisEntregaCard
                  key={entrega.idEntrega}
                  entrega={entrega}
                  onIniciar={() => handleIniciarViaje(entrega.idEntrega)}
                  onCompletar={() => handleMarcarEntregado(entrega.idEntrega)}
                  loading={processingId === entrega.idEntrega}
                  isIniciando={isIniciando}
                  isMarcando={isMarcando}
                />
              ))
          )}
        </div>
      )}
    </div>
  )
}

function EntregaCard({
  entrega,
  sucursales,
  availability,
  onVerificar,
  onAceptar,
  loading,
  repartidorLat,
  repartidorLng,
}: {
  entrega: EntregaResponse
  sucursales: SucursalMapa[]
  availability: DisponibilidadResponse | null
  onVerificar: () => void
  onAceptar: () => void
  loading: boolean
  repartidorLat?: number | null
  repartidorLng?: number | null
}) {
  const [showDetail, setShowDetail] = useState(false)

  return (
    <div className="rounded-[2rem] border border-wine-100/40 bg-white/70 p-5 shadow-lg dark:border-wine-900/20 dark:bg-black/35">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              {entrega.numeroComanda}
            </Badge>
            <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {ESTADO_LABELS[entrega.estado]}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            <MapPin className="mr-1 inline h-3.5 w-3.5" />
            {entrega.direccionEntrega}
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Navigation className="h-3 w-3" /> {entrega.distanciaKm} km
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> ~{entrega.tiempoEstimadoMin} min
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> Bs {entrega.costoEnvio}
            </span>
          </div>
          {entrega.nombreCliente && (
            <p className="mt-1 text-xs text-slate-500">
              <User className="mr-1 inline h-3 w-3" />
              {entrega.nombreCliente}
              {entrega.telefonoCliente && (
                <span className="ml-2">
                  <Phone className="mr-1 inline h-3 w-3" />
                  {entrega.telefonoCliente}
                </span>
              )}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowDetail(!showDetail)}
          className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-wine-50 hover:text-wine-600 dark:hover:bg-wine-900/20"
        >
          <ChevronRight className={`h-5 w-5 transition-transform ${showDetail ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {showDetail && (
        <div className="mt-4 space-y-3 border-t border-wine-100/30 pt-4 dark:border-wine-900/20">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Store className="h-3.5 w-3.5 text-wine-600 dark:text-wine-400" />
            <strong>Punto A:</strong> {entrega.nombreSucursal} &mdash; {entrega.direccionSucursal}
            {entrega.sucursalLatitud != null && (
              <span className="ml-auto font-mono text-[10px] text-slate-400">
                {entrega.sucursalLatitud.toFixed(4)}, {entrega.sucursalLongitud?.toFixed(4)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPinned className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <strong>Punto B:</strong> {entrega.direccionEntrega}
            <span className="ml-auto font-mono text-[10px] text-slate-400">
              {entrega.latitud.toFixed(4)}, {entrega.longitud.toFixed(4)}
            </span>
          </div>

          {entrega.latitud != null && entrega.longitud != null && (
            <div className="h-44 overflow-hidden rounded-xl">
              <MapaEntrega
                sucursalLat={entrega.sucursalLatitud}
                sucursalLng={entrega.sucursalLongitud}
                sucursalLabel={entrega.nombreSucursal}
                destinoLat={entrega.latitud}
                destinoLng={entrega.longitud}
                destinoLabel="Destino"
                repartidorLat={repartidorLat}
                repartidorLng={repartidorLng}
                repartidorLabel="Mi ubicación"
                sucursales={sucursales.map((s) => ({ id: s.idSucursal, nombre: s.nombre, lat: s.latitud ?? 0, lng: s.longitud ?? 0 })).filter((s) => s.lat !== 0 && s.lng !== 0)}
              />
            </div>
          )}

          {!availability && (
            <Button variant="secondary" onClick={onVerificar} className="w-full rounded-xl text-sm">
              Verificar disponibilidad
            </Button>
          )}

          {availability && (
            <div className="space-y-2">
              {availability.disponible ? (
                <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                  <CheckCircle className="mr-1 inline h-4 w-4" />
                  Disponible (a {availability.distanciaKm} km)
                </div>
              ) : (
                <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
                  <XCircle className="mr-1 inline h-4 w-4" />
                  {availability.motivo}
                </div>
              )}

              {availability.disponible && (
                <Button
                  onClick={onAceptar}
                  disabled={loading}
                  className="w-full rounded-xl text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Aceptando...
                    </>
                  ) : (
                    'Aceptar Entrega'
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function MisEntregaCard({
  entrega,
  onIniciar,
  onCompletar,
  loading,
  isIniciando,
  isMarcando,
}: {
  entrega: EntregaResponse
  onIniciar: () => void
  onCompletar: () => void
  loading: boolean
  isIniciando: boolean
  isMarcando: boolean
}) {
  return (
    <div className="rounded-[2rem] border border-wine-100/40 bg-white/70 p-5 shadow-lg dark:border-wine-900/20 dark:bg-black/35">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              {entrega.numeroComanda}
            </Badge>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ESTADO_COLORS[entrega.estado]}`}>
              {ESTADO_LABELS[entrega.estado]}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            <MapPin className="mr-1 inline h-3.5 w-3.5" />
            {entrega.direccionEntrega}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
        <span><Navigation className="mr-1 inline h-3 w-3" />{entrega.distanciaKm} km</span>
        <span><Clock className="mr-1 inline h-3 w-3" />~{entrega.tiempoEstimadoMin} min</span>
        {entrega.nombreCliente && (
          <span><User className="mr-1 inline h-3 w-3" />{entrega.nombreCliente}</span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2.5 text-[11px] dark:bg-slate-800/50">
        <div className="flex items-center gap-1.5 text-wine-700 dark:text-wine-300">
          <Store className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{entrega.nombreSucursal}</span>
        </div>
        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
          <MapPinned className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{entrega.direccionEntrega}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {entrega.estado === 'ASIGNADO' && (
          <Button
            onClick={onIniciar}
            disabled={loading}
            variant="info"
            className="flex-1 rounded-xl text-sm"
          >
            {loading && isIniciando ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="mr-2 h-4 w-4" />
            )}
            Iniciar Viaje
          </Button>
        )}
        {entrega.estado === 'EN_CAMINO' && (
          <Button
            onClick={onCompletar}
            disabled={loading}
            variant="success"
            className="flex-1 rounded-xl text-sm"
          >
            {loading && isMarcando ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            Marcar Entregado
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={() => window.location.href = `/entregas/${entrega.idEntrega}/seguimiento`}
          className="rounded-xl text-sm"
        >
          <MapPin className="mr-2 h-4 w-4" />
          Ver Mapa
        </Button>
      </div>
    </div>
  )
}

function EmptyState({ icon: Icon, message }: { icon: any; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-wine-100/40 bg-white/50 p-12 dark:border-wine-900/20 dark:bg-black/25">
      <Icon className="h-12 w-12 text-slate-300 dark:text-slate-600" />
      <p className="mt-4 text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  )
}
