import { useEffect, useRef, useState } from 'react'
import { X, MapPin, Check, Locate } from 'lucide-react'
import L from 'leaflet'
import { toast } from 'sonner'
import 'leaflet/dist/leaflet.css'

interface LeafletMapModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (lat: number, lng: number) => void
  initialLat: number
  initialLng: number
  sucursales?: { id: number; nombre: string; lat: number; lng: number }[]
}

const PURPLE_ICON = `<div style="width:28px;height:28px;background:#7c3aed;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="4"/></svg></div>`
const ORANGE_ICON = `<div style="width:24px;height:24px;background:#f97316;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center"><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="3.5"/></svg></div>`

export function LeafletMapModal({ open, onClose, onConfirm, initialLat, initialLng, sucursales = [] }: LeafletMapModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [selected, setSelected] = useState<{ lat: number; lng: number }>({ lat: initialLat, lng: initialLng })

  useEffect(() => {
    if (!open || !containerRef.current) return
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
      markerRef.current = null
    }

    const timer = setTimeout(() => {
      if (!containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map)

      for (const s of sucursales) {
        if (!s.lat || !s.lng) continue
        const icon = L.divIcon({ html: ORANGE_ICON, iconSize: [24, 24], iconAnchor: [12, 12], className: '' })
        const m = L.marker([s.lat, s.lng], { icon }).addTo(map)
        m.bindTooltip(s.nombre, { direction: 'top', offset: [0, -12] })
      }

      const mainIcon = L.divIcon({ html: PURPLE_ICON, iconSize: [28, 28], iconAnchor: [14, 14], className: '' })
      const marker = L.marker([initialLat, initialLng], { icon: mainIcon, draggable: true }).addTo(map)

      marker.on('dragend', () => {
        const pos = marker.getLatLng()
        setSelected({ lat: pos.lat, lng: pos.lng })
      })

      map.on('click', (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng)
        setSelected({ lat: e.latlng.lat, lng: e.latlng.lng })
      })

      mapRef.current = map
      markerRef.current = marker
      setSelected({ lat: initialLat, lng: initialLng })

      setTimeout(() => map.invalidateSize(), 150)
    }, 80)

    return () => {
      clearTimeout(timer)
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
  }, [open])

  const moveTo = (lat: number, lng: number) => {
    setSelected({ lat, lng })
    if (markerRef.current && mapRef.current) {
      markerRef.current.setLatLng([lat, lng])
      mapRef.current.setView([lat, lng], 15)
    }
  }

  const handleMiUbicacion = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalizacion no soportada en este navegador')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        moveTo(pos.coords.latitude, pos.coords.longitude)
        toast.success('Ubicacion real detectada')
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          toast.error('Permiso de ubicacion denegado. Activalo en Configuracion > Privacidad.')
        } else if (err.code === err.TIMEOUT) {
          toast.error('No se detecto GPS. Si estas en PC de escritorio, usa el mapa para seleccionar manualmente.')
        } else {
          toast.error('No se pudo obtener tu ubicacion')
        }
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 },
    )
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-4 flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Seleccionar ubicacion en el mapa
          </h2>
          <button onClick={onClose} className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative h-[400px] w-full">
          <div ref={containerRef} className="h-full w-full" />
          <button
            onClick={handleMiUbicacion}
            className="absolute top-3 right-3 z-[9999] flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur transition-colors hover:bg-white dark:bg-slate-900/95 dark:text-slate-300 dark:hover:bg-slate-900"
            style={{ pointerEvents: 'auto' }}
          >
            <Locate className="h-3.5 w-3.5" />
            Mi ubicacion
          </button>
          <div className="absolute bottom-3 left-3 z-[9999] rounded-xl bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow-lg backdrop-blur dark:bg-slate-900/90 dark:text-slate-300" style={{ pointerEvents: 'auto' }}>
            <MapPin className="mr-1 inline h-3.5 w-3.5 text-wine-600" />
            Haz click en el mapa o arrastra el marcador
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-slate-700">
          <div className="font-mono text-sm text-slate-600 dark:text-slate-400">
            {selected.lat.toFixed(6)}, {selected.lng.toFixed(6)}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm(selected.lat, selected.lng)
                onClose()
              }}
              className="flex items-center gap-2 rounded-xl bg-wine-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-wine-700"
            >
              <Check className="h-4 w-4" />
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
