import { useEffect, useState } from 'react'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { MovimientoManualRequest } from '../../../services/caja.service'

interface MovimientoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: MovimientoManualRequest) => Promise<void>
  isLoading: boolean
}

type Concepto = 'INGRESO_EXTRA' | 'RETIRO'

export function MovimientoModal({ isOpen, onClose, onSubmit, isLoading }: MovimientoModalProps) {
  const [concepto, setConcepto] = useState<Concepto>('INGRESO_EXTRA')
  const [monto, setMonto] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setConcepto('INGRESO_EXTRA')
      setMonto('')
      setDescripcion('')
      setError('')
    }
  }, [isOpen])

  const handleSubmit = async () => {
    const m = Number(monto)
    if (monto === '' || Number.isNaN(m) || m <= 0) {
      setError('Ingrese un monto válido (mayor a 0)')
      return
    }
    setError('')
    await onSubmit({ concepto, monto: m, descripcion: descripcion.trim() || undefined })
  }

  return (
    <Modal.Root isOpen={isOpen} onClose={onClose} size="sm">
      <Modal.Header>Registrar Movimiento Manual</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-5">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-rose-600 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setConcepto('INGRESO_EXTRA')}
              className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-4 transition-all ${
                concepto === 'INGRESO_EXTRA'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                  : 'border-slate-200 text-slate-500 hover:border-emerald-300 dark:border-wine-900/20 dark:text-slate-400'
              }`}
            >
              <ArrowUpCircle size={26} />
              <span className="text-[10px] font-black uppercase tracking-widest">Ingreso extra</span>
            </button>
            <button
              type="button"
              onClick={() => setConcepto('RETIRO')}
              className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-4 transition-all ${
                concepto === 'RETIRO'
                  ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
                  : 'border-slate-200 text-slate-500 hover:border-rose-300 dark:border-wine-900/20 dark:text-slate-400'
              }`}
            >
              <ArrowDownCircle size={26} />
              <span className="text-[10px] font-black uppercase tracking-widest">Retiro</span>
            </button>
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">
              Monto (Bs)
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">
              Descripción {concepto === 'RETIRO' ? '(motivo del retiro)' : '(opcional)'}
            </label>
            <Input
              type="text"
              placeholder={concepto === 'RETIRO' ? 'Ej. Retiro a bóveda' : 'Ej. Propina extra'}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          variant={concepto === 'INGRESO_EXTRA' ? 'success' : 'danger'}
          onClick={handleSubmit}
          isLoading={isLoading}
        >
          {concepto === 'INGRESO_EXTRA' ? 'Registrar Ingreso' : 'Registrar Retiro'}
        </Button>
      </Modal.Footer>
    </Modal.Root>
  )
}
