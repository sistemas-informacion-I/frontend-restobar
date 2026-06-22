import { useEffect, useState } from 'react'
import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { CajaResponse, CerrarCajaRequest } from '../../../services/caja.service'

interface CerrarCajaModalProps {
  isOpen: boolean
  onClose: () => void
  caja: CajaResponse | null
  onSubmit: (data: CerrarCajaRequest) => Promise<void>
  isLoading: boolean
}

const bs = (n: number) => `Bs ${(n ?? 0).toFixed(2)}`

export function CerrarCajaModal({ isOpen, onClose, caja, onSubmit, isLoading }: CerrarCajaModalProps) {
  const [montoFinal, setMontoFinal] = useState('')
  const [observacion, setObservacion] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setMontoFinal('')
      setObservacion('')
      setError('')
    }
  }, [isOpen])

  if (!caja) return null

  const saldoEsperado = caja.saldoEsperado ?? 0
  const real = montoFinal === '' ? null : Number(montoFinal)
  const diferencia = real !== null && !Number.isNaN(real) ? real - saldoEsperado : null

  const handleSubmit = async () => {
    const m = Number(montoFinal)
    if (montoFinal === '' || Number.isNaN(m) || m < 0) {
      setError('Ingrese el saldo real contado (mayor o igual a 0)')
      return
    }
    setError('')
    await onSubmit({ montoFinal: m, observacion: observacion.trim() || undefined })
  }

  return (
    <Modal.Root isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Header>Arqueo y Cierre de Caja</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-5">
          {/* Resumen del arqueo */}
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-wine-100/60 bg-wine-50/30 p-4 dark:border-wine-900/20 dark:bg-black/20">
            <ResumenRow label="Monto inicial" value={bs(caja.montoInicial)} />
            <ResumenRow label="Movimientos" value={`${caja.cantidadMovimientos}`} />
            <ResumenRow label="Total ingresos" value={`+ ${bs(caja.totalIngresos)}`} positive />
            <ResumenRow label="Total egresos" value={`- ${bs(caja.totalEgresos)}`} negative />
            <div className="col-span-2 mt-1 flex items-center justify-between border-t border-wine-100/60 pt-3 dark:border-wine-900/20">
              <span className="text-[11px] font-black uppercase tracking-widest text-wine-900/60 dark:text-wine-300/60">
                Saldo esperado
              </span>
              <span className="text-lg font-black text-wine-700 dark:text-wine-300">
                {bs(saldoEsperado)}
              </span>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-rose-600 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-400">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">
              Saldo real contado (Bs)
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={montoFinal}
              onChange={(e) => setMontoFinal(e.target.value)}
              autoFocus
            />
          </div>

          {/* Preview de la diferencia */}
          {diferencia !== null && (
            <div
              className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
                diferencia === 0
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                  : diferencia > 0
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
              }`}
            >
              <span className="text-[11px] font-black uppercase tracking-widest">
                {diferencia === 0 ? 'Caja cuadrada' : diferencia > 0 ? 'Sobrante' : 'Faltante'}
              </span>
              <span className="text-base font-black">{bs(Math.abs(diferencia))}</span>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">
              Observación (opcional)
            </label>
            <Input
              type="text"
              placeholder="Ej. Diferencia justificada por..."
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleSubmit} isLoading={isLoading}>
          Cerrar Caja
        </Button>
      </Modal.Footer>
    </Modal.Root>
  )
}

function ResumenRow({
  label,
  value,
  positive,
  negative,
}: {
  label: string
  value: string
  positive?: boolean
  negative?: boolean
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-300/40">
        {label}
      </span>
      <span
        className={`text-sm font-black ${
          positive
            ? 'text-emerald-600 dark:text-emerald-400'
            : negative
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-slate-700 dark:text-slate-200'
        }`}
      >
        {value}
      </span>
    </div>
  )
}
