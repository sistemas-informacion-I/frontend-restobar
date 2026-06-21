import { useEffect, useState } from 'react'
import { Wallet } from 'lucide-react'
import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { AbrirCajaRequest } from '../../../services/caja.service'

interface AbrirCajaModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AbrirCajaRequest) => Promise<void>
  isLoading: boolean
}

export function AbrirCajaModal({ isOpen, onClose, onSubmit, isLoading }: AbrirCajaModalProps) {
  const [montoInicial, setMontoInicial] = useState('')
  const [observacion, setObservacion] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setMontoInicial('')
      setObservacion('')
      setError('')
    }
  }, [isOpen])

  const handleSubmit = async () => {
    const monto = Number(montoInicial)
    if (montoInicial === '' || Number.isNaN(monto) || monto < 0) {
      setError('Ingrese un monto inicial válido (mayor o igual a 0)')
      return
    }
    setError('')
    await onSubmit({ montoInicial: monto, observacion: observacion.trim() || undefined })
  }

  return (
    <Modal.Root isOpen={isOpen} onClose={onClose} size="sm">
      <Modal.Header>Abrir Caja</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 rounded-2xl bg-wine-600/10 px-4 py-3 text-wine-700 dark:text-wine-300">
            <Wallet size={20} />
            <p className="text-xs font-bold uppercase tracking-widest">
              Declare el efectivo inicial en caja
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-rose-600 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-400">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">
              Monto inicial (Bs)
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={montoInicial}
              onChange={(e) => setMontoInicial(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">
              Observación (opcional)
            </label>
            <Input
              type="text"
              placeholder="Ej. Turno mañana"
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
        <Button variant="success" onClick={handleSubmit} isLoading={isLoading}>
          Abrir Caja
        </Button>
      </Modal.Footer>
    </Modal.Root>
  )
}
