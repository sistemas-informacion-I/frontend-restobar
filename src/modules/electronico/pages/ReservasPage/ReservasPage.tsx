import { useEffect, useMemo, useState } from 'react'
import type React from 'react'
import { CalendarDays, Clock, MapPin, Users, CheckCircle2, ClipboardList } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui'
import { Select } from '@/shared/components/ui/Select/Select'
import { getErrorMessage } from '@/core/api'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import {
  useCrearReserva,
  useDisponibilidadReservas,
  useSucursalesReserva,
} from '../../hooks/useReservas'
import { DisponibilidadMesaResponse } from '../../models/reserva.model'
import { PlanoMesas } from './components/PlanoMesas'

const today = new Date().toISOString().slice(0, 10)

export default function ReservasPage() {
  const { user, isAuthenticated } = useAuth()
  const { sucursales, isLoading: loadingSucursales } = useSucursalesReserva()
  const [idSucursal, setIdSucursal] = useState<number | null>(null)
  const [fechaReserva, setFechaReserva] = useState(today)
  const [horaInicio, setHoraInicio] = useState('19:00')
  const [horaFin, setHoraFin] = useState('21:00')
  const [cantidadPersonas, setCantidadPersonas] = useState(2)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [clienteNombre, setClienteNombre] = useState('')
  const [clienteTelefono, setClienteTelefono] = useState('')
  const [clienteCorreo, setClienteCorreo] = useState('')
  const [observaciones, setObservaciones] = useState('')

  const { mesas, isLoading: loadingMesas, error: disponibilidadError, refresh } =
    useDisponibilidadReservas(idSucursal, fechaReserva, horaInicio, horaFin)
  const { crearReserva, isCreating } = useCrearReserva()

  useEffect(() => {
    if (!idSucursal && sucursales.length > 0) {
      setIdSucursal(sucursales[0].idSucursal)
    }
  }, [sucursales, idSucursal])

  useEffect(() => {
    if (isAuthenticated && user) {
      setClienteNombre(user.name || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim())
      setClienteCorreo(user.email || '')
      setClienteTelefono(user.phone || '')
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    setSelectedIds([])
  }, [idSucursal, fechaReserva, horaInicio, horaFin])

  const selectedMesas = useMemo(
    () => mesas.filter((mesa) => selectedIds.includes(mesa.idMesa)),
    [mesas, selectedIds]
  )

  const capacidadSeleccionada = selectedMesas.reduce((sum, mesa) => sum + mesa.capacidadPersonas, 0)
  const puedeConfirmar =
    Boolean(idSucursal) &&
    selectedIds.length > 0 &&
    capacidadSeleccionada >= cantidadPersonas &&
    clienteNombre.trim().length > 0

  const handleToggleMesa = (mesa: DisponibilidadMesaResponse) => {
    if (!mesa.disponible) return
    setSelectedIds((current) =>
      current.includes(mesa.idMesa)
        ? current.filter((id) => id !== mesa.idMesa)
        : [...current, mesa.idMesa]
    )
  }

  const handleCrearReserva = async () => {
    if (!idSucursal || !puedeConfirmar) return

    try {
      const reserva = await crearReserva({
        idSucursal,
        fechaReserva,
        horaInicio,
        horaFin,
        cantidadPersonas,
        idsMesa: selectedIds,
        clienteNombre: clienteNombre.trim(),
        clienteTelefono: clienteTelefono.trim() || undefined,
        clienteCorreo: clienteCorreo.trim() || undefined,
        observaciones: observaciones.trim() || undefined,
      })
      toast.success(`Reserva #${reserva.idReserva} registrada como PENDIENTE`)
      setSelectedIds([])
      setObservaciones('')
      await refresh()
    } catch (error: any) {
      toast.error(getErrorMessage(error, 'Crear reserva'))
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-wine-100/40 bg-gradient-to-br from-white via-wine-50/30 to-wine-100/20 p-8 shadow-[0_30px_80px_rgba(76,5,25,0.08)] dark:border-wine-900/20 dark:from-black/70 dark:via-black/55 dark:to-wine-950/30">
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg">
              <CalendarDays size={25} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Reservar Mesa</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{selectedIds.length} mesas seleccionadas</p>
            </div>
          </div>
          <div className="rounded-2xl border border-wine-100/50 bg-white/70 px-5 py-3 text-sm font-black text-wine-700 shadow-sm dark:border-wine-900/30 dark:bg-black/30 dark:text-wine-300">
            {capacidadSeleccionada}/{cantidadPersonas} personas
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-5 rounded-[2rem] border border-wine-100/40 bg-white/75 p-6 shadow-xl shadow-wine-900/5 dark:border-wine-900/20 dark:bg-black/35">
          <FieldLabel icon={<MapPin size={14} />} label="Sucursal" />
          <Select
            value={idSucursal ?? ''}
            onChange={(value) => setIdSucursal(Number(value))}
            options={sucursales.map((s) => ({ value: s.idSucursal, label: s.nombre }))}
            placeholder={loadingSucursales ? 'Cargando...' : 'Selecciona sucursal'}
            disabled={loadingSucursales}
          />

          <div className="grid grid-cols-1 gap-4">
            <LabeledInput icon={<CalendarDays size={14} />} label="Fecha">
              <input value={fechaReserva} min={today} onChange={(e) => setFechaReserva(e.target.value)} type="date" className={inputClass} />
            </LabeledInput>
            <div className="grid grid-cols-2 gap-3">
              <LabeledInput icon={<Clock size={14} />} label="Inicio">
                <input value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} type="time" className={inputClass} />
              </LabeledInput>
              <LabeledInput icon={<Clock size={14} />} label="Fin">
                <input value={horaFin} onChange={(e) => setHoraFin(e.target.value)} type="time" className={inputClass} />
              </LabeledInput>
            </div>
            <LabeledInput icon={<Users size={14} />} label="Personas">
              <input value={cantidadPersonas} min={1} onChange={(e) => setCantidadPersonas(Number(e.target.value))} type="number" className={inputClass} />
            </LabeledInput>
          </div>

          <div className="h-px bg-wine-100/70 dark:bg-wine-900/30" />

          <div className="space-y-3">
            <FieldLabel icon={<ClipboardList size={14} />} label="Datos de contacto" />
            <input value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} placeholder="Nombre" className={inputClass} />
            <input value={clienteTelefono} onChange={(e) => setClienteTelefono(e.target.value)} placeholder="Telefono" className={inputClass} />
            <input value={clienteCorreo} onChange={(e) => setClienteCorreo(e.target.value)} placeholder="Correo" className={inputClass} />
            <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Observaciones" rows={3} className={`${inputClass} h-auto resize-none py-3`} />
          </div>

          <Button
            fullWidth
            onClick={handleCrearReserva}
            disabled={!puedeConfirmar || isCreating}
            isLoading={isCreating}
            icon={<CheckCircle2 size={18} />}
            className="!rounded-2xl bg-gradient-to-r from-wine-600 to-wine-950 text-xs font-black uppercase tracking-widest"
          >
            Confirmar Reserva
          </Button>
        </aside>

        <section className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Legend color="bg-white border border-slate-300" label="Disponible" />
            <Legend color="bg-emerald-500" label="Seleccionado" />
            <Legend color="bg-red-500" label="Ocupado/Reservado" />
            <Legend color="bg-slate-950" label="No disponible" />
          </div>

          {disponibilidadError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-300">
              {getErrorMessage(disponibilidadError, 'Cargar disponibilidad')}
            </div>
          ) : loadingMesas ? (
            <div className="flex h-[360px] items-center justify-center rounded-[2rem] border border-wine-100/50 bg-white/60 dark:border-wine-900/20 dark:bg-black/30">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-wine-100 border-t-wine-600" />
            </div>
          ) : mesas.length === 0 ? (
            <div className="flex h-[360px] items-center justify-center rounded-[2rem] border border-wine-100/50 bg-white/60 text-sm font-bold text-slate-400 dark:border-wine-900/20 dark:bg-black/30">
              Sin mesas para la busqueda seleccionada
            </div>
          ) : (
            <PlanoMesas mesas={mesas} selectedIds={selectedIds} onToggle={handleToggleMesa} />
          )}
        </section>
      </div>
    </div>
  )
}

const inputClass = 'h-12 w-full rounded-2xl border border-wine-100/50 bg-white/80 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/30 dark:text-white'

function FieldLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <label className="flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/50 dark:text-wine-300/50">
      {icon}
      {label}
    </label>
  )
}

function LabeledInput({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <FieldLabel icon={icon} label={label} />
      {children}
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-wine-100/40 bg-white/70 px-3 py-2 text-xs font-bold text-slate-600 dark:border-wine-900/20 dark:bg-black/30 dark:text-slate-300">
      <span className={`h-4 w-4 rounded-md ${color}`} />
      {label}
    </div>
  )
}
