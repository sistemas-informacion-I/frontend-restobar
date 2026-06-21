import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'

export interface SucursalMarker {
  id: number
  nombre: string
  lat: number
  lng: number
}

export interface MapaEntregaProps {
  sucursalLat: number | undefined | null
  sucursalLng: number | undefined | null
  sucursalLabel?: string
  destinoLat: number
  destinoLng: number
  destinoLabel?: string
  repartidorLat?: number | null
  repartidorLng?: number | null
  repartidorLabel?: string
  sucursales: SucursalMarker[]
  className?: string
}

const RED_ICON = `<div style="width:22px;height:22px;background:#dc2626;border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center"><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="3"/></svg></div>`
const BLUE_ICON = `<div style="width:22px;height:22px;background:#2563eb;border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center"><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="3"/></svg></div>`
const PURPLE_ICON = `<div style="width:26px;height:26px;background:#7c3aed;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(124,58,237,.5);display:flex;align-items:center;justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="4"/></svg></div>`
const ORANGE_ICON = `<div style="width:24px;height:24px;background:#f97316;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center"><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="3.5"/></svg></div>`

function makeDivIcon(html: string, size: number) {
  return L.divIcon({ html, iconSize: [size, size], iconAnchor: [size / 2, size / 2], className: '' })
}

function clusterCoords(coords: [number, number][]): [number, number] {
  if (coords.length === 0) return [0, 0]
  const sumLat = coords.reduce((s, c) => s + c[0], 0)
  const sumLng = coords.reduce((s, c) => s + c[1], 0)
  return [sumLat / coords.length, sumLng / coords.length]
}

export function MapaEntrega({
  sucursalLat,
  sucursalLng,
  sucursalLabel,
  destinoLat,
  destinoLng,
  destinoLabel,
  repartidorLat,
  repartidorLng,
  repartidorLabel,
  sucursales,
  className = '',
}: MapaEntregaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const repartidorMarkerRef = useRef<L.Marker | null>(null)
  const sucursalMarkersRef = useRef<L.Marker[]>([])
  const polyRef = useRef<L.Polyline | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const safeDestinoLat = Number(destinoLat)
    const safeDestinoLng = Number(destinoLng)
    const safeSucursalLat = sucursalLat != null ? Number(sucursalLat) : null
    const safeSucursalLng = sucursalLng != null ? Number(sucursalLng) : null
    const safeRepartidorLat = repartidorLat != null ? Number(repartidorLat) : null
    const safeRepartidorLng = repartidorLng != null ? Number(repartidorLng) : null

    const allPoints: [number, number][] = [[safeDestinoLat, safeDestinoLng]]
    if (safeSucursalLat != null && safeSucursalLng != null) allPoints.push([safeSucursalLat, safeSucursalLng])
    if (safeRepartidorLat != null && safeRepartidorLng != null) allPoints.push([safeRepartidorLat, safeRepartidorLng])
    for (const s of sucursales) {
      if (s.lat && s.lng) allPoints.push([s.lat, s.lng])
    }

    const center = clusterCoords(allPoints)

    const map = L.map(containerRef.current, {
      center,
      zoom: 13,
      zoomControl: true,
      attributionControl: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map)

    const sucursalMarkers: L.Marker[] = []
    const boundsMarkers: L.Marker[] = []

    for (const s of sucursales) {
      if (!s.lat || !s.lng) continue
      const sLat = Number(s.lat)
      const sLng = Number(s.lng)
      const isSelected = safeSucursalLat != null && safeSucursalLng != null && sLat === safeSucursalLat && sLng === safeSucursalLng
      const m = L.marker([sLat, sLng], {
        icon: makeDivIcon(isSelected ? RED_ICON : ORANGE_ICON, isSelected ? 22 : 24),
      }).addTo(map)
      m.bindTooltip(s.nombre, { direction: 'top', offset: [0, -12] })
      sucursalMarkers.push(m)
    }

    sucursalMarkersRef.current = sucursalMarkers

    if (safeSucursalLat != null && safeSucursalLng != null) {
      const alreadyDrawn = sucursales.some((s) => Number(s.lat) === safeSucursalLat && Number(s.lng) === safeSucursalLng)
      if (!alreadyDrawn) {
        const m = L.marker([safeSucursalLat, safeSucursalLng], {
          icon: makeDivIcon(RED_ICON, 22),
        }).addTo(map)
        if (sucursalLabel) m.bindTooltip(sucursalLabel, { direction: 'top', offset: [0, -14] })
        boundsMarkers.push(m)
      } else {
        // If it was drawn in the loop above, find it and add it to bounds
        const sMarker = sucursalMarkers.find(m => {
          const latlng = m.getLatLng()
          return latlng.lat === safeSucursalLat && latlng.lng === safeSucursalLng
        })
        if (sMarker) boundsMarkers.push(sMarker)
      }
    }

    {
      const m = L.marker([safeDestinoLat, safeDestinoLng], {
        icon: makeDivIcon(BLUE_ICON, 22),
      }).addTo(map)
      if (destinoLabel) m.bindTooltip(destinoLabel, { direction: 'top', offset: [0, -14] })
      boundsMarkers.push(m)
    }

    if (safeRepartidorLat != null && safeRepartidorLng != null) {
      const m = L.marker([safeRepartidorLat, safeRepartidorLng], {
        icon: makeDivIcon(PURPLE_ICON, 26),
      }).addTo(map)
      if (repartidorLabel) m.bindTooltip(repartidorLabel, { direction: 'top', offset: [0, -16] })
      repartidorMarkerRef.current = m
      boundsMarkers.push(m)
    }

    const originLat = safeRepartidorLat ?? safeSucursalLat
    const originLng = safeRepartidorLng ?? safeSucursalLng

    if (originLat != null && originLng != null) {
      polyRef.current = L.polyline(
        [[originLat, originLng], [safeDestinoLat, safeDestinoLng]],
        { color: '#7c3aed', weight: 3, dashArray: '8 6', opacity: 0.7 },
      ).addTo(map)

      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${safeDestinoLng},${safeDestinoLat}?geometries=geojson&overview=full`
      fetch(osrmUrl)
        .then((r) => r.json())
        .then((data) => {
          if (!mapRef.current) return
          const coords: [number, number][] = data?.routes?.[0]?.geometry?.coordinates?.map(
            (c: [number, number]) => [c[1], c[0]] as [number, number],
          )
          if (coords && coords.length > 0) {
            polyRef.current?.setLatLngs(coords)
            polyRef.current?.setStyle({ dashArray: '', weight: 4, opacity: 0.85 })
          }
        })
        .catch(() => {})
    }

    const group = L.featureGroup(boundsMarkers)
    if (boundsMarkers.length > 1) {
      map.fitBounds(group.getBounds().pad(0.1))
    } else {
      map.setView([safeDestinoLat, safeDestinoLng], 15)
    }

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      repartidorMarkerRef.current = null
      sucursalMarkersRef.current = []
      polyRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinoLat, destinoLng, sucursalLat, sucursalLng])

  useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current

    for (const m of sucursalMarkersRef.current) {
      m.removeFrom(map)
    }
    sucursalMarkersRef.current = []

    const markers: L.Marker[] = []
    const safeSucursalLat = sucursalLat != null ? Number(sucursalLat) : null
    const safeSucursalLng = sucursalLng != null ? Number(sucursalLng) : null

    for (const s of sucursales) {
      if (!s.lat || !s.lng) continue
      const sLat = Number(s.lat)
      const sLng = Number(s.lng)
      const isSelected = safeSucursalLat != null && safeSucursalLng != null && sLat === safeSucursalLat && sLng === safeSucursalLng
      const m = L.marker([sLat, sLng], {
        icon: makeDivIcon(isSelected ? RED_ICON : ORANGE_ICON, isSelected ? 22 : 24),
      }).addTo(map)
      m.bindTooltip(s.nombre, { direction: 'top', offset: [0, -12] })
      markers.push(m)
    }
    sucursalMarkersRef.current = markers
  }, [sucursales, sucursalLat, sucursalLng])

  useEffect(() => {
    if (!mapRef.current) return
    const safeRepartidorLat = repartidorLat != null ? Number(repartidorLat) : null
    const safeRepartidorLng = repartidorLng != null ? Number(repartidorLng) : null

    if (safeRepartidorLat != null && safeRepartidorLng != null) {
      if (repartidorMarkerRef.current) {
        repartidorMarkerRef.current.setLatLng([safeRepartidorLat, safeRepartidorLng])
        if (repartidorLabel) repartidorMarkerRef.current.setTooltipContent(repartidorLabel)
      } else {
        const m = L.marker([safeRepartidorLat, safeRepartidorLng], {
          icon: makeDivIcon(PURPLE_ICON, 26),
        }).addTo(mapRef.current)
        if (repartidorLabel) m.bindTooltip(repartidorLabel, { direction: 'top', offset: [0, -16] })
        repartidorMarkerRef.current = m
      }

      // Update route dynamically
      const safeDestinoLat = Number(destinoLat)
      const safeDestinoLng = Number(destinoLng)
      
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${safeRepartidorLng},${safeRepartidorLat};${safeDestinoLng},${safeDestinoLat}?geometries=geojson&overview=full`
      fetch(osrmUrl)
        .then((r) => r.json())
        .then((data) => {
          if (!mapRef.current || !polyRef.current) return
          const coords: [number, number][] = data?.routes?.[0]?.geometry?.coordinates?.map(
            (c: [number, number]) => [c[1], c[0]] as [number, number],
          )
          if (coords && coords.length > 0) {
            polyRef.current.setLatLngs(coords)
          }
        })
        .catch(() => {})

    } else if (repartidorMarkerRef.current) {
      repartidorMarkerRef.current.removeFrom(mapRef.current)
      repartidorMarkerRef.current = null
    }
  }, [repartidorLat, repartidorLng, repartidorLabel, destinoLat, destinoLng])

  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => mapRef.current?.invalidateSize(), 200)
    }
  }, [fullscreen])

  const containerClasses = fullscreen
    ? `fixed inset-0 z-[9998] bg-white dark:bg-slate-900 ${className}`
    : `w-full h-full ${className}`

  return (
    <div className={containerClasses} style={{ isolation: fullscreen ? undefined : 'isolate' }}>
      <div className="relative h-full w-full" style={{ isolation: 'isolate' }}>
        <div ref={containerRef} className="h-full w-full rounded-xl" />
        <button
          onClick={(e) => {
            e.stopPropagation()
            setFullscreen((prev) => !prev)
          }}
          className="absolute top-1 right-1 z-[500] flex items-center gap-1 rounded-lg bg-white/95 px-2 py-1.5 text-[11px] font-semibold text-slate-700 shadow-md backdrop-blur transition-colors hover:bg-white dark:bg-slate-900/95 dark:text-slate-300 dark:hover:bg-slate-800"
          style={{ pointerEvents: 'all' }}
        >
          {fullscreen ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6h4M6 6v4m8 8h4m-4 0v4"/></svg>
              Salir
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
              Pantalla completa
            </>
          )}
        </button>
      </div>
    </div>
  )
}
