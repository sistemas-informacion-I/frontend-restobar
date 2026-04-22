import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { PerfilPersonalResponse, PerfilPersonalUpdate } from '../../../models/perfil-personal.model';

interface Props {
  perfil: PerfilPersonalResponse;
  onClose: () => void;
  onSave: (data: PerfilPersonalUpdate) => Promise<void>;
}

export function PerfilEditModal({ perfil, onClose, onSave }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PerfilPersonalUpdate>({
    defaultValues: {
      nombre: perfil.nombre,
      apellido: perfil.apellido,
      telefono: perfil.telefono,
      sexo: perfil.sexo,
      correo: perfil.correo,
      direccion: perfil.direccion
    }
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-wine-950/40 backdrop-blur-md animate-in fade-in transition-opacity">
      <div className="glass-card rounded-[2.5rem] bg-white/40 dark:bg-black/80 border-2 border-wine-100/30 dark:border-wine-900/30 shadow-2xl shadow-wine-900/20 w-full max-w-2xl overflow-hidden transition-all scale-100 animate-in zoom-in-95 relative">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-gradient-to-br from-wine-600/10 to-transparent blur-3xl" />
        
        <div className="px-8 py-6 border-b border-wine-100/30 dark:border-wine-900/10 flex justify-between items-center relative z-10">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Editar Información</h2>
          <button onClick={onClose} className="p-2.5 rounded-[1rem] bg-white/50 dark:bg-wine-900/20 hover:bg-wine-50 dark:hover:bg-wine-900/50 text-slate-500 hover:text-wine-600 dark:text-slate-400 dark:hover:text-wine-400 transition-all border border-wine-100/50 dark:border-wine-900/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="p-8 space-y-6 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-400 mb-2">Cédula de Identidad</label>
              <input type="text" value={perfil.ci} disabled className="w-full px-5 py-3.5 bg-slate-100/50 dark:bg-black/30 border border-slate-200 dark:border-wine-900/10 rounded-2xl text-slate-400 dark:text-slate-500 cursor-not-allowed font-medium shadow-inner" />
              <p className="text-[10px] font-bold text-slate-400 dark:text-wine-400/40 mt-1.5 opacity-60">Este valor no se puede cambiar.</p>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-400 mb-2">Nombre de Usuario</label>
              <input type="text" value={perfil.username} disabled className="w-full px-5 py-3.5 bg-slate-100/50 dark:bg-black/30 border border-slate-200 dark:border-wine-900/10 rounded-2xl text-slate-400 dark:text-slate-500 cursor-not-allowed font-medium shadow-inner" />
               <p className="text-[10px] font-bold text-slate-400 dark:text-wine-400/40 mt-1.5 opacity-60">Contacte al admin para cambiarlo.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">Nombre <span className="text-rose-500">*</span></label>
              <input {...register('nombre', { required: 'Este campo es obligatorio' })} className="w-full px-5 py-3.5 bg-white dark:bg-black/50 border-2 border-wine-100/50 dark:border-wine-800/30 rounded-2xl focus:border-wine-500/50 focus:ring-4 focus:ring-wine-500/10 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400" />
              {errors.nombre && <p className="text-rose-500 text-[10px] font-bold mt-1.5">{errors.nombre.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">Apellido <span className="text-rose-500">*</span></label>
              <input {...register('apellido', { required: 'Este campo es obligatorio' })} className="w-full px-5 py-3.5 bg-white dark:bg-black/50 border-2 border-wine-100/50 dark:border-wine-800/30 rounded-2xl focus:border-wine-500/50 focus:ring-4 focus:ring-wine-500/10 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400" />
              {errors.apellido && <p className="text-rose-500 text-[10px] font-bold mt-1.5">{errors.apellido.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">Teléfono</label>
              <input {...register('telefono')} className="w-full px-5 py-3.5 bg-white dark:bg-black/50 border-2 border-wine-100/50 dark:border-wine-800/30 rounded-2xl focus:border-wine-500/50 focus:ring-4 focus:ring-wine-500/10 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">Sexo <span className="text-rose-500">*</span></label>
              <select {...register('sexo', { required: 'Selecciona una opción' })} className="w-full px-5 py-3.5 bg-white dark:bg-black/50 border-2 border-wine-100/50 dark:border-wine-800/30 rounded-2xl focus:border-wine-500/50 focus:ring-4 focus:ring-wine-500/10 outline-none transition-all text-slate-900 dark:text-white appearance-none">
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
              {errors.sexo && <p className="text-rose-500 text-[10px] font-bold mt-1.5">{errors.sexo.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">Correo Electrónico <span className="text-rose-500">*</span></label>
              <input type="email" {...register('correo', { required: 'Este campo es obligatorio', pattern: { value: /^\S+@\S+$/i, message: 'Correo no válido' } })} className="w-full px-5 py-3.5 bg-white dark:bg-black/50 border-2 border-wine-100/50 dark:border-wine-800/30 rounded-2xl focus:border-wine-500/50 focus:ring-4 focus:ring-wine-500/10 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400" />
              {errors.correo && <p className="text-rose-500 text-[10px] font-bold mt-1.5">{errors.correo.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-2">Dirección</label>
              <textarea {...register('direccion')} rows={2} className="w-full px-5 py-3.5 bg-white dark:bg-black/50 border-2 border-wine-100/50 dark:border-wine-800/30 rounded-2xl focus:border-wine-500/50 focus:ring-4 focus:ring-wine-500/10 outline-none transition-all text-slate-900 dark:text-white resize-none placeholder:text-slate-400" />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-wine-100/30 dark:border-wine-900/10 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-3.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-white/50 dark:hover:bg-wine-900/20 transition-all border border-transparent hover:border-wine-100/50 dark:hover:border-wine-900/30">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="px-8 py-3.5 bg-gradient-to-r from-wine-600 to-wine-900 hover:from-wine-700 hover:to-wine-950 disabled:opacity-50 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-wine-900/30 transition-all active:scale-95 flex items-center gap-2 border-2 border-wine-500/20">
              {isSubmitting ? (
                 <>
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Guardando...
                 </>
              ) : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
