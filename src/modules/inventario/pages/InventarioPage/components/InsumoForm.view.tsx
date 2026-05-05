import { useState, useEffect } from 'react'
import { RefreshCcw, Power } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Select, Switch } from '@/shared/components/ui'
import { InventarioItem } from '../../../services/inventario.service'

interface InsumoFormProps {
  insumo?: InventarioItem | null
  onSubmit: (data: any) => Promise<{ success: boolean; error?: string }>
  onCancel: () => void
  isSubmitting: boolean
}

export function InsumoForm({ insumo, onSubmit, onCancel, isSubmitting }: InsumoFormProps) {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    unidadMedida: 'UNIDAD',
    marca: '',
    esRehutilizable: false,
    activo: true
  })

  useEffect(() => {
    if (insumo) {
      setFormData({
        codigo: insumo.codigo || '',
        nombre: insumo.nombre || '',
        descripcion: insumo.descripcion || '',
        unidadMedida: insumo.unidadMedida || 'UNIDAD',
        marca: insumo.marca || '',
        esRehutilizable: insumo.esRehutilizable || false,
        activo: insumo.activo ?? true
      })
    }
  }, [insumo])

  const handleSubmit = async () => {
    await onSubmit(formData)
  }

  return (
    <div className="flex flex-col gap-6 p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="Código" 
          value={formData.codigo} 
          onChange={(e) => setFormData({...formData, codigo: e.target.value})} 
          required 
          disabled={isSubmitting}
        />
        <Input 
          label="Nombre" 
          value={formData.nombre} 
          onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
          required 
          disabled={isSubmitting}
        />
      </div>
      <Input 
        label="Descripción" 
        value={formData.descripcion} 
        onChange={(e) => setFormData({...formData, descripcion: e.target.value})} 
        disabled={isSubmitting}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 group">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 px-1">Unidad de Medida</label>
          <Select
            value={formData.unidadMedida}
            onChange={(val) => setFormData({...formData, unidadMedida: val})}
            options={[
              { value: 'KG', label: 'Kilogramos (KG)' },
              { value: 'GRAMO', label: 'Gramos (G)' },
              { value: 'LITRO', label: 'Litros (L)' },
              { value: 'ML', label: 'Mililitros (ML)' },
              { value: 'UNIDAD', label: 'Unidades (UND)' },
            ]}
            disabled={isSubmitting}
          />
        </div>
        <Input 
          label="Marca" 
          value={formData.marca} 
          onChange={(e) => setFormData({...formData, marca: e.target.value})} 
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Switch
          label="Es Reutilizable"
          description="Contenedores o envases"
          checked={formData.esRehutilizable}
          onChange={(val: boolean) => setFormData({...formData, esRehutilizable: val})}
          icon={<RefreshCcw size={18} />}
          disabled={isSubmitting}
        />
        <Switch
          label="Estado Activo"
          description="Visible en inventario"
          checked={formData.activo}
          onChange={(val: boolean) => setFormData({...formData, activo: val})}
          icon={<Power size={18} />}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex gap-4 pt-6 border-t border-wine-100/20 dark:border-wine-900/10">
        <Button variant="secondary" className="flex-1 h-14 rounded-2xl" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
        <Button 
          className="flex-1 h-14 rounded-2xl shadow-xl shadow-wine-900/20" 
          onClick={handleSubmit}
          isLoading={isSubmitting}
        >
          {insumo ? 'Actualizar' : 'Crear'} Insumo
        </Button>
      </div>
    </div>
  )
}
