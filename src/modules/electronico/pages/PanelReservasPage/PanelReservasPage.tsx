import { useEffect, useMemo, useState } from 'react'
import { CalendarCheck, Check, Clock, Search, UserCheck, UserX, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui'
import { Select } from '@/shared/components/ui/Select/Select'
import { getErrorMessage } from '@/core/api'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { usePanelReservas, useSucursalesReserva } from '../../hooks/useReservas'
import { EstadoReserva, ReservaResponse } from '../../models/reserva.model'

const today = new Date().toISOString().slice(0, 10)
const estados: { value: '' | EstadoReserva; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'PENDIENTE', label: 'Pendientes' },
  { value: 'CONFIRMADA', label: 'Confirmadas' },
  { value: 'EN_CURSO', label: 'En curso' },
  { value: 'CANCELADA', label: 'Canceladas' },
  { value: 'NO_ASISTIO', label: 'No asistio' },
]

export default function PanelReservasPage() {
  const { user } = useAuth()
  const { sucursales } = useSucursalesReserva()
  const [idSucursal, setIdSucursal] = useState<number | null>(user?.sucursalId ?? null)
  const [fechaReserva, setFechaReserva] = useState(today)
  const [estado, setEstado] = useState<'' | EstadoReserva>('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!idSucursal && sucursales.length > 0) {
      setIdSucursal(user?.sucursalId ?? sucursales[0].idSucursal)
    }
  }, [idSucursal, sucursales, user?.sucursalId])

  const {
    reservas,
    isLoading,
    error,
    isSubmitting,
    confirmar,
    checkIn,
    cancelar,
    noAsistio,
  } = usePanelReservas(idSucursal, fechaReserva, estado || undefined)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return reservas
    return reservas.filter((r) =>
      r.clienteNombre.toLowerCase().includes(q) ||
      r.mesas.some((m) => m.numeroMesa.toLowerCase().includes(q))
    )
  }, [reservas, search])

  const runAction = async (label: string, action: () => Promise<unknown>) => {
    try {
      await action()
      toast.success(label)
    } catch (err: any) {
      toast.error(getErrorMessage(err, label))
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-wine-100/40 bg-gradient-to-br from-white via-wine-50/30 to-wine-100/20 p-8 shadow-[0_30px_80px_rgba(76,5,25,0.08)] dark:border-wine-900/20 dark:from-black/70 dark:via-black/55 dark:to-wine-950/30">
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg">
              <CalendarCheck size={25} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Panel de Reservas</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{filtered.length} reservas en vista</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 rounded-[2rem] border border-wine-100/40 bg-white/75 p-5 shadow-xl shadow-wine-900/5 dark:border-wine-900/20 dark:bg-black/35 md:grid-cols-[1fr_180px_190px_1fr]">
        <Select
          value={idSucursal ?? ''}
          onChange={(value) => setIdSucursal(Number(value))}
          options={sucursales.map((s) => ({ value: s.idSucursal, label: s.nombre }))}
          placeholder="Sucursal"
        />
        <input value={fechaReserva} onChange={(e) => setFechaReserva(e.target.value)} type="date" className={inputClass} />
        <Select
          value={estado}
          onChange={(value) => setEstado(value)}
          options={estados}
          placeholder="Estado"
        />
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente o mesa" className={`${inputClass} pl-10`} />
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-300">
          {getErrorMessage(error, 'Cargar reservas')}
        </div>
      ) : isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-[2rem] border border-wine-100/50 bg-white/60 dark:border-wine-900/20 dark:bg-black/30">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-wine-100 border-t-wine-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-[2rem] border border-wine-100/50 bg-white/60 text-sm font-bold text-slate-400 dark:border-wine-900/20 dark:bg-black/30">
          Sin reservas para los filtros seleccionados
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((reserva) => (
            <ReservaRow
              key={reserva.idReserva}
              reserva={reserva}
              disabled={isSubmitting}
              onConfirmar={() => runAction('Reserva confirmada', () => confirmar(reserva.idReserva))}
              onCheckIn={() => runAction('Check-in registrado', () => checkIn(reserva.idReserva))}
              onCancelar={() => runAction('Reserva cancelada', () => cancelar({ idReserva: reserva.idReserva, motivo: 'Cancelada desde panel' }))}
              onNoAsistio={() => runAction('Reserva marcada como no asistio', () => noAsistio(reserva.idReserva))}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ReservaRow({
  reserva,
  disabled,
  onConfirmar,
  onCheckIn,
  onCancelar,
  onNoAsistio,
}: {
  reserva: ReservaResponse
  disabled: boolean
  onConfirmar: () => void
  onCheckIn: () => void
  onCancelar: () => void
  onNoAsistio: () => void
}) {
  return (
    <div className="rounded-[2rem] border border-wine-100/40 bg-white/75 p-5 shadow-lg shadow-wine-900/5 dark:border-wine-900/20 dark:bg-black/35">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-lg font-black text-slate-900 dark:text-white">#{reserva.idReserva} {reserva.clienteNombre}</span>
            <EstadoBadge estado={reserva.estado} />
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1"><Clock size={13} /> {reserva.horaInicio} - {reserva.horaFin}</span>
            <span>{reserva.cantidadPersonas} personas</span>
            <span>Mesas: {reserva.mesas.map((m) => m.numeroMesa).join(', ')}</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {reserva.estado === 'PENDIENTE' && (
            <Button disabled={disabled} onClick={onConfirmar} icon={<Check size={15} />} className="!rounded-xl !px-3 !py-2 text-xs">Confirmar</Button>
          )}
          {(reserva.estado === 'PENDIENTE' || reserva.estado === 'CONFIRMADA') && (
            <>
              <Button disabled={disabled} onClick={onCheckIn} icon={<UserCheck size={15} />} className="!rounded-xl !px-3 !py-2 text-xs">Check-in</Button>
              <Button disabled={disabled} variant="ghost" onClick={onCancelar} icon={<XCircle size={15} />} className="!rounded-xl !px-3 !py-2 text-xs">Cancelar</Button>
              <Button disabled={disabled} variant="ghost" onClick={onNoAsistio} icon={<UserX size={15} />} className="!rounded-xl !px-3 !py-2 text-xs">No asistio</Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function EstadoBadge({ estado }: { estado: EstadoReserva }) {
  const styles: Record<EstadoReserva, string> = {
    PENDIENTE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    CONFIRMADA: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    EN_CURSO: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    CANCELADA: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    NO_ASISTIO: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  }

  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${styles[estado]}`}>
      {estado}
    </span>
  )
}

const inputClass = 'h-14 w-full rounded-2xl border border-wine-100/50 bg-white/80 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/30 dark:text-white'
