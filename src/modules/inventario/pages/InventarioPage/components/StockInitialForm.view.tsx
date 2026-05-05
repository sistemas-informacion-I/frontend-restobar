import { useState } from 'react'
import { Package, AlertCircle, MapPin } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { InventarioItem, StockInicialRequest } from '../../../services/inventario.service'

interface StockInitialFormProps {
  insumo: InventarioItem
  idSucursal: number
  onSubmit: (data: StockInicialRequest) => Promise<{ success: boolean; error?: string }>
  onCancel: () => void
  isSubmitting: boolean
}

export function StockInitialForm({ insumo, idSucursal, onSubmit, onCancel, isSubmitting }: StockInitialFormProps) {
  const [formData, setFormData] = useState({
    idInventario: insumo.idInventario,
    idSucursal: idSucursal,
    cantidadMinima: '',
    cantidadMaxima: '',
    ubicacionAlmacen: ''
  })
  const [localError, setLocalError] = useState('')

  const handleSubmit = async () => {
    setLocalError('')
    const result = await onSubmit({
      ...formData,
      idInventario: insumo.idInventario,
      idSucursal: idSucursal,
      cantidadMinima: formData.cantidadMinima ? Number(formData.cantidadMinima) : 0,
      cantidadMaxima: formData.cantidadMaxima ? Number(formData.cantidadMaxima) : undefined,
    } as StockInicialRequest)
    
    if (!result.success) {
      setLocalError(result.error || 'Error al inicializar stock')
    }
  }

  return (
    <div className="space-y-6">
      {localError && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-rose-800 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400 animate-in shake duration-500">
          <AlertCircle size={18} />
          {localError}
        </div>
      )}
      <div className="flex items-center gap-4 rounded-3xl bg-wine-50/30 p-5 dark:bg-wine-900/10 border border-wine-100/50 dark:border-wine-900/20">
        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white text-wine-600 shadow-sm dark:bg-black/40 dark:text-wine-400">
          <Package size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-wine-600">Inicializando</p>
          <p className="text-sm font-black text-slate-900 dark:text-white">{insumo.nombre}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input 
          label="Stock Mínimo" 
          type="number" 
          placeholder="0"
          value={formData.cantidadMinima}
          onChange={(e) => setFormData({...formData, cantidadMinima: e.target.value})}
          disabled={isSubmitting}
        />
        <Input 
          label="Stock Máximo" 
          type="number" 
          placeholder="Opcional"
          value={formData.cantidadMaxima}
          onChange={(e) => setFormData({...formData, cantidadMaxima: e.target.value})}
          disabled={isSubmitting}
        />
      </div>
      <Input 
        label="Ubicación en Almacén" 
        placeholder="Ej: Estante A, Pasillo 3..."
        value={formData.ubicacionAlmacen}
        onChange={(e) => setFormData({...formData, ubicacionAlmacen: e.target.value})}
        icon={<MapPin size={18} />}
        disabled={isSubmitting}
      />

      <div className="flex gap-4 pt-6 border-t border-wine-100/20 dark:border-wine-900/10">
        <Button variant="secondary" className="flex-1 h-14 rounded-2xl" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
        <Button 
          className="flex-1 h-14 rounded-2xl shadow-xl shadow-wine-900/20" 
          onClick={handleSubmit}
          isLoading={isSubmitting}
        >
          Guardar Configuración
        </Button>
      </div>
    </div>
  )
}
