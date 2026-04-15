import { Shield, FileText } from 'lucide-react'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { Permission } from '../../../services/api'

interface RoleFormViewProps {
  register: any
  handleSubmit: any
  errors: any
  onFormSubmit: (data: any) => Promise<void>
  isEdit: boolean
  isLoading: boolean
  onCancel: () => void
  groupedPermissions: Record<string, Permission[]>
  moduleNames: Record<string, string>
}

export function RoleFormView({
  register,
  handleSubmit,
  errors,
  onFormSubmit,
  isEdit,
  isLoading,
  onCancel,
  groupedPermissions,
  moduleNames
}: RoleFormViewProps) {
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5">
      <Input
        label="Nombre del rol"
        type="text"
        placeholder="Ej: Administrador, Editor, Viewer"
        icon={<Shield size={18} />}
        error={errors.nombre?.message}
        {...register('nombre', {
          required: 'Ingresa un nombre para el rol',
          minLength: { value: 2, message: 'El nombre del rol debe tener al menos 2 caracteres' },
          maxLength: { value: 50, message: 'El nombre del rol no puede exceder 50 caracteres' },
        })}
      />

      <Input
        label="Descripción"
        type="text"
        placeholder="Descripción del rol"
        icon={<FileText size={18} />}
        error={errors.descripcion?.message}
        {...register('descripcion', {
          maxLength: { value: 200, message: 'La descripción del rol no puede exceder 200 caracteres' },
        })}
      />

      <Input
        label="Nivel de acceso"
        type="number"
        placeholder="1"
        error={errors.nivelAcceso?.message}
        {...register('nivelAcceso', {
          valueAsNumber: true,
          min: { value: 1, message: 'El nivel de acceso debe ser mayor a 0' },
        })}
      />

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              {...register('activo')}
              className="peer h-5 w-5 appearance-none rounded-lg border-2 border-wine-200 bg-white transition-all checked:border-wine-600 checked:bg-wine-600 focus:ring-2 focus:ring-wine-500/20 dark:border-wine-900/40 dark:bg-black/40"
            />
            <Shield size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-wine-600 transition-colors">Rol activo</span>
        </label>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">
            Matriz de Permisos
          </label>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            Define el alcance de acción para los usuarios asociados a este rol.
          </p>
        </div>

        <div className="grid max-h-[400px] grid-cols-1 gap-4 overflow-y-auto rounded-[2rem] border border-wine-100/50 p-4 glass-card dark:border-wine-900/20 sm:grid-cols-2 custom-scrollbar">
          {Object.entries(groupedPermissions).map(([module, perms]) => (
            <div key={module} className="rounded-2xl border border-wine-100/30 bg-wine-50/20 p-5 dark:border-wine-900/10 dark:bg-wine-950/20">
              <h4 className="mb-4 flex items-center gap-2 border-b border-wine-100/50 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-wine-700 dark:text-wine-400">
                <div className="h-1.5 w-1.5 rounded-full bg-wine-500" />
                {moduleNames[module] || module}
              </h4>
              <div className="flex flex-col gap-3">
                {perms.map((permission) => (
                  <label key={permission.id} className="flex cursor-pointer items-start gap-3 rounded-xl p-2.5 hover:bg-white/60 dark:hover:bg-wine-900/20 transition-all border border-transparent hover:border-wine-100/50 group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input
                        type="checkbox"
                        value={permission.id}
                        {...register('permisos')}
                        className="peer h-4 w-4 appearance-none rounded border-2 border-wine-200 checked:border-wine-600 checked:bg-wine-600 focus:ring-1 focus:ring-wine-500/20 dark:border-wine-800/40"
                      />
                      <div className="absolute h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-black capitalize text-slate-800 dark:text-slate-200 group-hover:text-wine-700 dark:group-hover:text-wine-300 transition-colors">{permission.action}</span>
                      {permission.description && (
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-500 leading-tight">
                          {permission.description}
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col-reverse justify-end gap-3 border-t border-wine-100/50 pt-6 dark:border-wine-900/20 sm:flex-row">
        <Button type="button" variant="ghost" onClick={onCancel} className="bg-wine-50/50 dark:bg-wine-950/30">
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading} className="shadow-lg shadow-wine-900/20 min-w-[140px]">
          {isEdit ? 'Guardar Cambios' : 'Crear Rol'}
        </Button>
      </div>
    </form>
  )
}
