import { useForm } from 'react-hook-form';
import { Lock } from 'lucide-react';
import { CambioPasswordRequest } from '../../../models/perfil-personal.model';

interface Props {
  onSubmit: (data: CambioPasswordRequest) => Promise<void>;
}

export function PerfilPasswordCard({ onSubmit }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CambioPasswordRequest>();

  const onValidSubmit = async (data: CambioPasswordRequest) => {
    await onSubmit(data);
    reset(); // reset form after success
  };

  return (
    <div className="glass-card rounded-[2.5rem] p-8 shadow-2xl shadow-wine-900/5 relative overflow-hidden group/card transition-all duration-700 hover:shadow-wine-900/10">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-gradient-to-br from-orange-500/5 to-transparent blur-3xl group-hover/card:scale-150 transition-transform duration-1000" />
      
      <div className="flex flex-col md:flex-row gap-10 relative z-10">
        <div className="md:w-1/3 flex flex-col gap-3">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/20 flex items-center justify-center mb-2 rotate-3 group-hover/card:-rotate-3 transition-transform duration-500">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Seguridad</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Actualiza tu contraseña para mantener tu cuenta segura. Necesitarás recordar tu contraseña actual.</p>
        </div>

        <div className="md:w-2/3">
          <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-6">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">Contraseña Actual <span className="text-rose-500">*</span></label>
              <input 
                type="password" 
                {...register('passwordActual', { required: 'Ingresa tu contraseña actual' })} 
                className="w-full px-5 py-3.5 bg-white/50 dark:bg-black/50 border-2 border-wine-100/50 dark:border-wine-800/30 rounded-2xl focus:border-wine-500/50 focus:ring-4 focus:ring-wine-500/10 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400" 
              />
              {errors.passwordActual && <p className="text-rose-500 text-xs mt-2 font-bold">{errors.passwordActual.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">Nueva Contraseña <span className="text-rose-500">*</span></label>
              <input 
                type="password" 
                {...register('passwordNuevo', { 
                  required: 'Ingresa una nueva contraseña',
                  minLength: { value: 8, message: 'La contraseña debe tener al menos 8 caracteres' }
                })} 
                className="w-full px-5 py-3.5 bg-white/50 dark:bg-black/50 border-2 border-wine-100/50 dark:border-wine-800/30 rounded-2xl focus:border-wine-500/50 focus:ring-4 focus:ring-wine-500/10 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400" 
              />
              {errors.passwordNuevo && <p className="text-rose-500 text-xs mt-2 font-bold">{errors.passwordNuevo.message}</p>}
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="px-8 py-3.5 bg-gradient-to-r from-slate-800 to-black hover:from-black hover:to-slate-900 dark:from-white dark:to-slate-200 dark:hover:from-slate-200 dark:hover:to-white dark:text-black focus:ring-4 focus:ring-slate-900/10 disabled:opacity-50 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 w-full sm:w-auto"
              >
                {isSubmitting ? 'Actualizando...' : 'Actualizar Contraseña'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
