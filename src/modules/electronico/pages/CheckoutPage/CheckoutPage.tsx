import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, User, MapPin, ArrowLeft, CreditCard, Check, ChevronDown, ChevronUp, ShoppingBag, Navigation } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { Input } from '@/shared/components/ui'
import { Select } from '@/shared/components/ui/Select/Select'
import { useCarrito } from '../../hooks/useCarrito'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { PasarelaPagoService } from '../../services/pasarelaPago.service'
import { useSucursalesMapa } from '../../hooks/useSucursales'
import { httpClient } from '@/core/api/http-client'
import { toast } from 'sonner'
import { User as UserType } from '@/modules/acceso/models/user.model'
import L from 'leaflet'

const SANTA_CRUZ_LAT = -17.783327
const SANTA_CRUZ_LNG = -63.1821404
const PURPLE_MARKER = `<div style="width:26px;height:26px;background:#7c3aed;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="4"/></svg></div>`

const steps = [
  { id: 1, label: 'Tus Datos', shortLabel: 'Datos', icon: User },
  { id: 2, label: 'Envío', shortLabel: 'Envío', icon: MapPin },
  { id: 3, label: 'Confirmar', shortLabel: 'Conf.', icon: CreditCard },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { carrito, sucursalId } = useCarrito()
  const { isAuthenticated, user } = useAuth()
  const { sucursales } = useSucursalesMapa()

  const [activeStep, setActiveStep] = useState(1)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerNit, setCustomerNit] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [shippingCity, setShippingCity] = useState('Santa Cruz')
  const [shippingZip, setShippingZip] = useState('')
  const [shippingNotes, setShippingNotes] = useState('')
  const [orderNotes, setOrderNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedMetodoId, setSelectedMetodoId] = useState<number | null>(null)
  const [metodosPago, setMetodosPago] = useState<any[]>([])
  const [stepErrors, setStepErrors] = useState<Record<number, string | null>>({})

  // Punto B - coordenadas de entrega
  const [destinoLat, setDestinoLat] = useState<number>(SANTA_CRUZ_LAT)
  const [destinoLng, setDestinoLng] = useState<number>(SANTA_CRUZ_LNG)

  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  const handleMiUbicacion = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setDestinoLat(latitude)
        setDestinoLng(longitude)
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([latitude, longitude], 16)
          markerRef.current.setLatLng([latitude, longitude])
        }
      },
      () => {
        alert('No se pudo obtener tu ubicación. Verifica los permisos del navegador.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  useEffect(() => {
    if (user) {
      const u = user as UserType
      setCustomerName(u.name || '')
      setCustomerEmail(u.email || '')
    }
    const savedMetodo = sessionStorage.getItem('checkout_metodo_pago')
    if (savedMetodo) setSelectedMetodoId(Number(savedMetodo))
    loadMetodosPago()
  }, [user])

  // Inicializar mapa Leaflet cuando el paso 2 esta activo
  useEffect(() => {
    if (activeStep !== 2 || !mapContainerRef.current) return
    if (mapRef.current) return

    const timer = setTimeout(() => {
      if (!mapContainerRef.current || mapRef.current) return

      const map = L.map(mapContainerRef.current, {
        center: [destinoLat, destinoLng],
        zoom: 13,
        zoomControl: true,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map)

      // Marcadores de sucursales
      sucursales.forEach((s) => {
        if (!s.latitud || !s.longitud) return
        const icon = L.divIcon({
          html: `<div style="width:22px;height:22px;background:#f97316;border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center"><svg width="11" height="11" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="3"/></svg></div>`,
          iconSize: [22, 22], iconAnchor: [11, 11], className: '',
        })
        const m = L.marker([s.latitud, s.longitud], { icon }).addTo(map)
        m.bindTooltip(s.nombre, { direction: 'top', offset: [0, -12] })
      })

      // Marcador para el punto de entrega (violeta, arrastrable)
      const icon = L.divIcon({ html: PURPLE_MARKER, iconSize: [26, 26], iconAnchor: [13, 13], className: '' })
      const marker = L.marker([destinoLat, destinoLng], { icon, draggable: true }).addTo(map)

      marker.on('dragend', () => {
        const pos = marker.getLatLng()
        setDestinoLat(pos.lat)
        setDestinoLng(pos.lng)
      })

      map.on('click', (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng)
        setDestinoLat(e.latlng.lat)
        setDestinoLng(e.latlng.lng)
      })

      mapRef.current = map
      markerRef.current = marker

      setTimeout(() => map.invalidateSize(), 200)
    }, 100)

    return () => {
      clearTimeout(timer)
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
  }, [activeStep, sucursales])

  const loadMetodosPago = async () => {
    try {
      const metodos = await PasarelaPagoService.getMetodosOnline()
      setMetodosPago(metodos)
    } catch (error) {
      console.error('Error loading payment methods:', error)
    }
  }

  if (!carrito || carrito.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="rounded-[2.5rem] border border-wine-100/40 bg-white/75 p-12 text-center shadow-2xl shadow-wine-900/5 dark:border-wine-900/20 dark:bg-black/35">
          <ShoppingBag size={64} className="mx-auto mb-4 text-wine-400" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Tu carrito está vacío</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Agrega productos antes de continuar al checkout</p>
          <Button onClick={() => navigate('/catalogo')} icon={<ArrowLeft size={16} />}>
            Ver Catálogo
          </Button>
        </div>
      </div>
    )
  }

  const subtotal = carrito.items.reduce((sum, item) => sum + item.subtotal, 0)
  const costoEnvio = 15
  const impuesto = subtotal * 0.13
  const total = subtotal + impuesto + costoEnvio

  const validateStep = (step: number): boolean => {
    const errs: Record<number, string | null> = {}
    if (step >= 1) {
      if (!customerName.trim()) errs[1] = 'Ingresa tu nombre'
      else if (!customerEmail.trim()) errs[1] = 'Ingresa tu correo'
      else if (!customerPhone.trim()) errs[1] = 'Ingresa tu teléfono'
      else errs[1] = null
    }
    if (step >= 2) {
      if (!shippingAddress.trim()) errs[2] = 'Ingresa tu dirección'
      else errs[2] = null
    }
    if (step >= 3) {
      if (!selectedMetodoId) errs[3] = 'Selecciona un método de pago'
      else errs[3] = null
    }
    setStepErrors(errs)
    return !errs[step]
  }

  const goToStep = (step: number) => {
    if (step > 1 && !validateStep(step - 1)) return
    setActiveStep(step)
    setTimeout(() => {
      const el = document.getElementById(`step-${step}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleCheckout = async () => {
    if (!validateStep(3)) return

    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para completar el pedido')
      navigate('/login')
      return
    }

    if (!sucursalId) {
      toast.error('Selecciona una sucursal')
      return
    }

    setIsSubmitting(true)
    try {
      const params = new URLSearchParams({
        idSucursal: String(sucursalId),
        idMetodoPago: String(selectedMetodoId),
        direccionEntrega: shippingAddress,
        latitud: String(destinoLat),
        longitud: String(destinoLng),
        costoEnvio: String(costoEnvio),
      })
      const checkoutData = await httpClient.post<{ idNotaVenta: number }>(`/carrito/checkout?${params}`)
      const idNV = checkoutData.idNotaVenta

      const metodoPagoId = Number(sessionStorage.getItem('checkout_metodo_pago') || selectedMetodoId)
      if (!metodoPagoId) {
        toast.error('Selecciona un método de pago')
        setIsSubmitting(false)
        return
      }

      const metodos = await PasarelaPagoService.getMetodosOnline()
      const selectedMetodo = metodos.find(m => m.idMetodoPago === metodoPagoId) || metodos[0]

      if (!selectedMetodo) {
        toast.error('No se encontró el método de pago seleccionado')
        setIsSubmitting(false)
        return
      }

      const isOnlinePayment = selectedMetodo.nombre.toLowerCase().includes('paypal') ||
        selectedMetodo.nombre.toLowerCase().includes('transferencia')

      if (!isOnlinePayment) {
        toast.success('Pedido creado correctamente')
        sessionStorage.removeItem('checkout_metodo_pago')
        navigate('/mis-pedidos')
        return
      }

      const paypalRes = await PasarelaPagoService.createPaypalOrder({
        idNotaVenta: idNV,
        idMetodoPago: selectedMetodo.idMetodoPago,
        monto: total,
        referencia: `ORD-${idNV}-${Date.now()}`,
        customerName,
        customerEmail,
        customerPhone,
        nitCliente: customerNit,
        shippingAddress,
        shippingCity,
        shippingZip,
        shippingNotes,
        items: carrito.items.map(item => ({
          name: item.nombreProducto,
          quantity: item.cantidad,
          unitAmount: item.precioUnitario,
        })),
        returnUrl: `${window.location.origin}/paypal/success`,
        cancelUrl: `${window.location.origin}/paypal/cancel`,
      })

      if (paypalRes.approvalUrl) {
        window.location.href = paypalRes.approvalUrl
      } else {
        toast.error(paypalRes.message || 'Error al iniciar pago con PayPal')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error en el checkout')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-wine-100/40 bg-gradient-to-br from-white via-wine-50/30 to-wine-100/20 p-8 shadow-[0_30px_80px_rgba(76,5,25,0.08)] dark:border-wine-900/20 dark:from-black/70 dark:via-black/55 dark:to-wine-950/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(159,18,57,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(159,18,57,0.08),transparent_30%)]" />
        <div className="relative">
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-5xl">Finalizar Compra</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Completa tus datos en 3 simples pasos</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {steps.map((step, idx) => {
          const isActive = activeStep === step.id
          const isComplete = activeStep > step.id
          const hasError = stepErrors[step.id] != null

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => goToStep(step.id)}
                className="flex items-center gap-2 sm:gap-3 group"
              >
                <div
                  className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl transition-all duration-500 ${isComplete ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 scale-95' : isActive ? 'bg-wine-600 text-white shadow-lg shadow-wine-900/30 scale-110 ring-4 ring-wine-200 dark:ring-wine-800' : hasError ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'}`}
                >
                  {isComplete ? <Check size={20} className="animate-in zoom-in duration-300" /> : <step.icon size={20} />}
                </div>
                <span className={`hidden sm:block text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-wine-700 dark:text-wine-300' : isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                  {step.label}
                </span>
              </button>
              {idx < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 rounded-full transition-all duration-500 ${activeStep > step.id ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
              )}
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="space-y-6">
          {/* Step 1: Customer Info */}
          <div
            id="step-1"
            className={`rounded-[2.5rem] border transition-all duration-500 ${activeStep === 1 ? 'border-wine-300 dark:border-wine-700 shadow-2xl shadow-wine-900/10' : 'border-wine-100/40 dark:border-wine-900/20'} bg-white/75 shadow-2xl shadow-wine-900/5 dark:bg-black/35 overflow-hidden`}
          >
            <button onClick={() => goToStep(1)} className="w-full flex items-center justify-between p-6 sm:p-8 text-left">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 ${activeStep === 1 ? 'bg-wine-600 text-white shadow-lg shadow-wine-900/20' : activeStep > 1 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                  {activeStep > 1 ? <Check size={22} /> : <User size={22} />}
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">Información del Cliente</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{activeStep > 1 ? customerName || 'Completado' : 'Datos para la factura'}</p>
                </div>
              </div>
              {activeStep === 1 ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
            </button>

            <div className={`transition-all duration-500 overflow-hidden ${activeStep === 1 ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-6 sm:px-8 pb-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Nombre completo" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Juan Pérez" required />
                  <Input label="Correo electrónico" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="correo@ejemplo.com" required />
                  <Input label="Teléfono" type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+591 123 456 789" required />
                  <Input label="NIT / CI" value={customerNit} onChange={(e) => setCustomerNit(e.target.value)} placeholder="12345678" />
                </div>
                <Button onClick={() => goToStep(2)} fullWidth className="!rounded-2xl">Continuar al Envío</Button>
                {stepErrors[1] && <p className="text-xs text-rose-500 text-center">{stepErrors[1]}</p>}
              </div>
            </div>
          </div>

          {/* Step 2: Shipping + Map */}
          <div
            id="step-2"
            className={`rounded-[2.5rem] border transition-all duration-500 ${activeStep === 2 ? 'border-wine-300 dark:border-wine-700 shadow-2xl shadow-wine-900/10' : 'border-wine-100/40 dark:border-wine-900/20'} bg-white/75 shadow-2xl shadow-wine-900/5 dark:bg-black/35 overflow-hidden`}
          >
            <button onClick={() => goToStep(2)} disabled={activeStep < 2} className="w-full flex items-center justify-between p-6 sm:p-8 text-left disabled:cursor-not-allowed">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 ${activeStep === 2 ? 'bg-wine-600 text-white shadow-lg shadow-wine-900/20' : activeStep > 2 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                  {activeStep > 2 ? <Check size={22} /> : <MapPin size={22} />}
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">Dirección de Envío</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{activeStep > 2 ? shippingAddress || 'Completado' : '¿Dónde entregamos?'}</p>
                </div>
              </div>
              {activeStep === 2 ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
            </button>

            <div className={`transition-all duration-500 overflow-hidden ${activeStep === 2 ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-6 sm:px-8 pb-8 space-y-4">
                <Input label="Dirección" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="Av. Principal #123" required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Ciudad" value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} placeholder="Santa Cruz" />
                  <Input label="Código Postal" value={shippingZip} onChange={(e) => setShippingZip(e.target.value)} placeholder="0000" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 px-1">Referencias</label>
                  <textarea value={shippingNotes} onChange={(e) => setShippingNotes(e.target.value)} rows={3} placeholder="Casa de dos pisos, puerta azul..." className="w-full rounded-2xl border bg-slate-50/50 py-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400/60 transition-all duration-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-wine-500/10 dark:bg-black/20 dark:text-white dark:placeholder:text-slate-600 dark:focus:bg-black/40 border-wine-100/50 hover:border-wine-300 focus:border-wine-500 dark:border-wine-900/30 dark:hover:border-wine-700 dark:focus:border-wine-600 px-5" />
                </div>

                {/* Mapa para seleccionar ubicacion de entrega */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 px-1 flex items-center gap-2">
                    <MapPin size={12} className="text-wine-500" />
                    Marca tu ubicación en el mapa
                  </label>
                  <div className="relative mt-2 h-64 rounded-2xl overflow-hidden border border-wine-100/40">
                    <div ref={mapContainerRef} className="h-full w-full" />
                    <button
                      type="button"
                      onClick={handleMiUbicacion}
                      className="absolute top-2 right-2 z-[9999] flex items-center gap-1 rounded-xl bg-wine-600 px-3 py-2 text-[11px] font-bold text-white shadow-lg shadow-wine-900/30 transition-all hover:bg-wine-700 hover:scale-105 active:scale-95"
                    >
                      <Navigation size={13} />
                      Mi ubicación
                    </button>
                    <div className="absolute bottom-2 left-2 z-[9999] rounded-lg bg-white/90 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 shadow backdrop-blur dark:bg-slate-900/90 dark:text-slate-300" style={{ pointerEvents: 'auto' }}>
                      🟣 Arrastra el marcador o haz click
                    </div>
                    <div className="absolute bottom-2 right-2 z-[9999] rounded-lg bg-white/90 px-2.5 py-1.5 text-[10px] font-mono text-slate-600 shadow backdrop-blur dark:bg-slate-900/90 dark:text-slate-300" style={{ pointerEvents: 'auto' }}>
                      {destinoLat.toFixed(5)}, {destinoLng.toFixed(5)}
                    </div>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400">El marcador violeta indica dónde se entregará tu pedido</p>
                </div>

                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => goToStep(1)} className="!rounded-2xl" icon={<ArrowLeft size={16} />}>Volver</Button>
                  <Button onClick={() => goToStep(3)} fullWidth className="!rounded-2xl">Continuar al Pago</Button>
                </div>
                {stepErrors[2] && <p className="text-xs text-rose-500 text-center">{stepErrors[2]}</p>}
              </div>
            </div>
          </div>

          {/* Step 3: Payment + Confirm */}
          <div
            id="step-3"
            className={`rounded-[2.5rem] border transition-all duration-500 ${activeStep === 3 ? 'border-wine-300 dark:border-wine-700 shadow-2xl shadow-wine-900/10' : 'border-wine-100/40 dark:border-wine-900/20'} bg-white/75 shadow-2xl shadow-wine-900/5 dark:bg-black/35 overflow-hidden`}
          >
            <button onClick={() => goToStep(3)} disabled={activeStep < 3} className="w-full flex items-center justify-between p-6 sm:p-8 text-left disabled:cursor-not-allowed">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 ${activeStep === 3 ? 'bg-wine-600 text-white shadow-lg shadow-wine-900/20' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                  <CreditCard size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">Pago y Confirmación</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Revisa y confirma tu pedido</p>
                </div>
              </div>
              {activeStep === 3 ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
            </button>

            <div className={`transition-all duration-500 overflow-hidden ${activeStep === 3 ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-6 sm:px-8 pb-8 space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 px-1 block mb-2">Método de Pago</label>
                  <Select value={selectedMetodoId || ''} onChange={(value) => { if (value) { setSelectedMetodoId(value as number); sessionStorage.setItem('checkout_metodo_pago', String(value)) } }} options={metodosPago.filter((m: any) => m.activo).map((metodo: any) => ({ value: metodo.idMetodoPago, label: metodo.comisionPorcentaje && metodo.comisionPorcentaje > 0 ? `${metodo.nombre} (+${metodo.comisionPorcentaje}% comisión)` : metodo.nombre }))} placeholder="Selecciona un método de pago" icon={<CreditCard size={18} />} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 px-1">Notas adicionales (opcional)</label>
                  <textarea value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} rows={2} placeholder="¿Alguna instrucción especial para tu pedido?" className="w-full rounded-2xl border bg-slate-50/50 py-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400/60 transition-all duration-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-wine-500/10 dark:bg-black/20 dark:text-white dark:placeholder:text-slate-600 dark:focus:bg-black/40 border-wine-100/50 hover:border-wine-300 focus:border-wine-500 dark:border-wine-900/30 dark:hover:border-wine-700 dark:focus:border-wine-600 px-5 mt-2" />
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => goToStep(2)} className="!rounded-2xl" icon={<ArrowLeft size={16} />}>Volver</Button>
                  <Button onClick={handleCheckout} isLoading={isSubmitting} fullWidth className="!rounded-2xl bg-gradient-to-r from-wine-600 to-wine-950 px-6 text-sm font-black uppercase tracking-widest shadow-xl shadow-wine-900/20" disabled={!selectedMetodoId}>Confirmar Pedido</Button>
                </div>
                {stepErrors[3] && <p className="text-xs text-rose-500 text-center">{stepErrors[3]}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="rounded-[2.5rem] border border-wine-100/40 bg-white/75 p-6 sm:p-8 shadow-2xl shadow-wine-900/5 dark:border-wine-900/20 dark:bg-black/35 sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg shadow-wine-900/20"><Package size={22} /></div>
              <h2 className="text-lg font-black tracking-tighter text-slate-900 dark:text-white">Resumen</h2>
            </div>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto custom-scrollbar">
              {carrito.items.map((item) => (
                <div key={item.idItemCarrito} className="flex justify-between items-start py-2 border-b border-wine-100/20 dark:border-wine-900/20 last:border-0">
                  <div className="flex-1"><p className="text-sm font-semibold text-slate-900 dark:text-white">{item.nombreProducto}</p><p className="text-xs text-slate-500 dark:text-slate-400">x{item.cantidad} · Bs {item.precioUnitario.toFixed(2)} c/u</p></div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white ml-3">Bs {item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t-2 border-wine-100/30 dark:border-wine-900/30">
              <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Subtotal</span><span className="font-semibold text-slate-900 dark:text-white">Bs {subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Costo de envío</span><span className="font-semibold text-slate-900 dark:text-white">Bs {costoEnvio.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Impuestos (13%)</span><span className="font-semibold text-slate-900 dark:text-white">Bs {impuesto.toFixed(2)}</span></div>
              <div className="flex justify-between pt-3 border-t-2 border-wine-100/30 dark:border-wine-900/30">
                <span className="text-base font-black text-slate-900 dark:text-white">TOTAL</span>
                <span className="text-2xl font-black text-wine-600 dark:text-wine-400">Bs {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
