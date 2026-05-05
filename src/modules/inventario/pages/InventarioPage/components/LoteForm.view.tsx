import { useState } from 'react'
import { Plus, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { LoteRequest } from '../../../services/inventario.service'

interface LoteFormProps {
  idStock: number
  onSubmit: (data: LoteRequest) => Promise<{ success: boolean; error?: string }>
  onCancel: () => void
}

export function LoteForm({ idStock, onSubmit, onCancel }: LoteFormProps) {
  const [formData, setFormData] = useState({
    numeroLote: '',
    cantidad: '',
    precioCompra: '',
    fechaIngreso: new Date().toISOString().split('T')[0],
    fechaVencimiento: '',
  })
  const [localError, setLocalError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setLocalError('')
    if (formData.fechaVencimiento) {
      const selectedDate = new Date(formData.fechaVencimiento)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        setLocalError("La fecha de vencimiento no puede ser anterior a hoy")
        return
      }
    }

    setIsSubmitting(true)
    const result = await onSubmit({
      idStock,
      numeroLote: formData.numeroLote || undefined,
      cantidad: Number(formData.cantidad),
      precioCompra: Number(formData.precioCompra),
      fechaIngreso: formData.fechaIngreso || undefined,
      fechaVencimiento: formData.fechaVencimiento || undefined,
      estado: 'DISPONIBLE'
    })
    if (!result.success) {
      setLocalError(result.error || 'Error al guardar el lote')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
      <div className="absolute inset-0 bg-wine-950/40 backdrop-blur-md" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-[3rem] bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:bg-[#0a0a0a] border border-wine-100/50 dark:border-wine-900/20">
        {localError && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-rose-800 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400 animate-in shake duration-500">
            <AlertCircle size={18} />
            {localError}
          </div>
        )}
        <div className="flex items-center gap-4 mb-8">
           <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wine-50 text-wine-600 dark:bg-wine-900/20 dark:text-wine-400">
             <Plus size={24} />
           </div>
           <h3 className="text-2xl font-black text-slate-900 dark:text-white">Nuevo Lote</h3>
        </div>
        <div className="space-y-4">
          <Input 
            label="Número de Lote" 
            placeholder="Ej: L-2024-001" 
            value={formData.numeroLote}
            onChange={(e) => setFormData(p => ({ ...p, numeroLote: e.target.value }))}
            disabled={isSubmitting}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Cantidad" 
              type="number" 
              placeholder="0.00" 
              required
              value={formData.cantidad}
              onChange={(e) => setFormData(p => ({ ...p, cantidad: e.target.value }))}
              disabled={isSubmitting}
            />
            <Input 
              label="Precio Compra" 
              type="number" 
              placeholder="0.00" 
              required
              value={formData.precioCompra}
              onChange={(e) => setFormData(p => ({ ...p, precioCompra: e.target.value }))}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Fecha Ingreso" 
              type="date" 
              value={formData.fechaIngreso}
              onChange={(e) => setFormData(p => ({ ...p, fechaIngreso: e.target.value }))}
              disabled={isSubmitting}
            />
            <Input 
              label="Fecha Vencimiento" 
              type="date" 
              value={formData.fechaVencimiento}
              onChange={(e) => setFormData(p => ({ ...p, fechaVencimiento: e.target.value }))}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex gap-4 pt-8 border-t border-wine-100/20 dark:border-wine-900/10">
            <Button variant="secondary" className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px]" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
            <Button 
              className="flex-1 h-14 rounded-2xl shadow-xl shadow-wine-900/40 font-black uppercase tracking-widest text-[10px]" 
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={!formData.cantidad || !formData.precioCompra}
            >
              Guardar Lote
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
