import { useForm } from 'react-hook-form'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { Truck, Hash, User, Phone, Mail, MapPin, Tag } from 'lucide-react'
import { Proveedor, CreateProveedorData } from '@/modules/acceso/services/proveedores.service'

interface ProveedorFormProps {
  proveedor: Proveedor | null
  onSubmit: (data: CreateProveedorData) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export function ProveedorForm({ proveedor, onSubmit, onCancel, isLoading }: ProveedorFormProps) {
  const isEdit = !!proveedor

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProveedorData>({
    defaultValues: proveedor ? {
      empresa: proveedor.empresa,
      nit: proveedor.nit || '',
      nombreContacto: proveedor.nombreContacto,
      telefono: proveedor.telefono,
      correo: proveedor.correo || '',
      direccion: proveedor.direccion || '',
      categoriaProductos: proveedor.categoriaProductos || '',
      activo: proveedor.activo,
    } : {
      empresa: '',
      nit: '',
      nombreContacto: '',
      telefono: '',
      correo: '',
      direccion: '',
      categoriaProductos: '',
      activo: true,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        <div className="md:col-span-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-wine-900/40 dark:text-wine-100/30 mb-4 flex items-center gap-2">
            Datos de la Empresa
            <div className="h-px flex-1 bg-wine-100/50 dark:bg-wine-900/20" />
          </h3>
        </div>

        <div className="md:col-span-2">
          <Input
            label="Nombre de la Empresa"
            type="text"
            placeholder="Razón social o nombre comercial"
            icon={<Truck size={18} />}
            error={errors.empresa?.message}
            {...register('empresa', { required: 'La empresa es obligatoria' })}
          />
        </div>

        <Input
          label="NIT"
          type="text"
          placeholder="Número de identificación tributaria"
          icon={<Hash size={18} />}
          {...register('nit')}
        />

        <Input
          label="Categoría de Productos"
          type="text"
          placeholder="Ej: Bebidas, Carnes, Lácteos..."
          icon={<Tag size={18} />}
          {...register('categoriaProductos')}
        />

        <div className="md:col-span-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-wine-900/40 dark:text-wine-100/30 mb-4 mt-2 flex items-center gap-2">
            Datos de Contacto
            <div className="h-px flex-1 bg-wine-100/50 dark:bg-wine-900/20" />
          </h3>
        </div>

        <Input
          label="Nombre del Contacto"
          type="text"
          placeholder="Persona encargada"
          icon={<User size={18} />}
          error={errors.nombreContacto?.message}
          {...register('nombreContacto', { required: 'El nombre del contacto es obligatorio' })}
        />

        <Input
          label="Teléfono"
          type="text"
          placeholder="Número de contacto"
          icon={<Phone size={18} />}
          error={errors.telefono?.message}
          {...register('telefono', { required: 'El teléfono es obligatorio' })}
        />

        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="correo@empresa.com"
          icon={<Mail size={18} />}
          {...register('correo')}
        />

        <Input
          label="Dirección"
          type="text"
          placeholder="Dirección física de la empresa"
          icon={<MapPin size={18} />}
          {...register('direccion')}
        />

      </div>

      <div className="mt-4 flex flex-col-reverse justify-end gap-3 border-t border-wine-100/30 pt-6 dark:border-wine-900/10 sm:flex-row">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="bg-wine-50/50 dark:bg-wine-950/30"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="shadow-lg shadow-wine-900/20 min-w-[200px]"
        >
          {isEdit ? 'Guardar Cambios' : 'Registrar Proveedor'}
        </Button>
      </div>
    </form>
  )
}
