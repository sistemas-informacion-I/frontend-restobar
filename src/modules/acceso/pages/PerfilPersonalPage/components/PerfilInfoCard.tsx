import { User, Mail, Phone, MapPin, Building, Star, Briefcase, Key } from 'lucide-react';
import { PerfilPersonalResponse } from '../../../models/perfil-personal.model';

interface Props {
  perfil: PerfilPersonalResponse;
  onEditOpen: () => void;
}

export function PerfilInfoCard({ perfil, onEditOpen }: Props) {
  return (
    <div className="glass-card rounded-[2.5rem] p-8 shadow-2xl shadow-wine-900/5 relative overflow-hidden group/card transition-all duration-700 hover:shadow-wine-900/10">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-gradient-to-br from-wine-600/5 to-transparent blur-3xl group-hover/card:scale-150 transition-transform duration-1000" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-wine-600 to-wine-950 text-white text-3xl font-black shadow-xl shadow-wine-900/40 rotate-3 transition-transform group-hover/card:rotate-0 duration-500 uppercase">
            {perfil.nombre.charAt(0)}{perfil.apellido.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {perfil.nombre} {perfil.apellido}
            </h2>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-wine-600 dark:text-wine-400 mt-1">@{perfil.username}</p>
          </div>
        </div>
        <button
          onClick={onEditOpen}
          className="px-6 py-2.5 bg-gradient-to-r from-wine-600 to-wine-900 hover:from-wine-700 hover:to-wine-950 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-wine-900/30 active:scale-95 border-2 border-wine-500/20"
        >
          Editar Información
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-1 rounded-full bg-wine-600" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Información Básica</h3>
          </div>
          <div className="flex flex-col gap-3">
            <InfoItem icon={User} label="Cédula de Identidad" value={perfil.ci} />
            <InfoItem icon={Mail} label="Correo Electrónico" value={perfil.correo || 'No especificado'} />
            <InfoItem icon={Phone} label="Teléfono" value={perfil.telefono || 'No especificado'} />
            <InfoItem icon={MapPin} label="Dirección" value={perfil.direccion || 'No especificada'} />
            <InfoItem icon={User} label="Sexo" value={perfil.sexo === 'M' ? 'Masculino' : perfil.sexo === 'F' ? 'Femenino' : 'Otro'} />
            <InfoItem icon={Key} label="Registro" value={new Date(perfil.fechaRegistro).toLocaleDateString()} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-1 rounded-full bg-wine-600" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Roles de Sistema</h3>
          </div>
          
          {perfil.cliente && (
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-sm">
              <h4 className="font-black text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2"><div className="p-1.5 rounded-lg bg-emerald-500/10"><Star className="w-3 h-3"/></div> Perfil Cliente</h4>
              <ul className="text-sm space-y-2 text-slate-700 dark:text-slate-300">
                <li className="flex justify-between"><span className="text-[10px] font-black uppercase tracking-widest opacity-50">Nivel</span> <span className="font-bold">{perfil.cliente.nivelCliente}</span></li>
                <li className="flex justify-between"><span className="text-[10px] font-black uppercase tracking-widest opacity-50">Puntos</span> <span className="font-bold">{perfil.cliente.puntosFidelidad}</span></li>
                {perfil.cliente.nit && <li className="flex justify-between"><span className="text-[10px] font-black uppercase tracking-widest opacity-50">NIT</span> <span className="font-bold">{perfil.cliente.nit}</span></li>}
              </ul>
            </div>
          )}

          {perfil.empleado && (
            <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 backdrop-blur-sm">
              <h4 className="font-black text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2"><div className="p-1.5 rounded-lg bg-blue-500/10"><Briefcase className="w-3 h-3"/></div> Perfil Empleado</h4>
              <ul className="text-sm space-y-2 text-slate-700 dark:text-slate-300">
                <li className="flex justify-between"><span className="text-[10px] font-black uppercase tracking-widest opacity-50">Código</span> <span className="font-bold">{perfil.empleado.codigoEmpleado}</span></li>
                <li className="flex justify-between"><span className="text-[10px] font-black uppercase tracking-widest opacity-50">Contratación</span> <span className="font-bold">{perfil.empleado.fechaContratacion}</span></li>
              </ul>
            </div>
          )}

          {perfil.proveedor && (
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 backdrop-blur-sm">
              <h4 className="font-black text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2"><div className="p-1.5 rounded-lg bg-amber-500/10"><Building className="w-3 h-3"/></div> Perfil Proveedor</h4>
              <ul className="text-sm space-y-2 text-slate-700 dark:text-slate-300">
                <li className="flex justify-between"><span className="text-[10px] font-black uppercase tracking-widest opacity-50">Empresa</span> <span className="font-bold">{perfil.proveedor.empresa}</span></li>
                <li className="flex justify-between"><span className="text-[10px] font-black uppercase tracking-widest opacity-50">NIT</span> <span className="font-bold">{perfil.proveedor.nit}</span></li>
                {perfil.proveedor.nombreContacto && <li className="flex justify-between"><span className="text-[10px] font-black uppercase tracking-widest opacity-50">Contacto</span> <span className="font-bold">{perfil.proveedor.nombreContacto}</span></li>}
              </ul>
            </div>
          )}

          {!perfil.cliente && !perfil.empleado && !perfil.proveedor && (
             <p className="text-sm text-wine-900/40 dark:text-wine-400/40 italic px-2">No tienes perfiles de rol adicionales vinculados en este sistema.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-white/40 p-4 dark:bg-black/20 border border-wine-100/30 dark:border-wine-900/10 backdrop-blur-sm transition-all duration-300 hover:bg-wine-50/50 dark:hover:bg-wine-900/10 group">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-wine-500/10 text-wine-600 dark:bg-wine-500/10 dark:text-wine-400 group-hover:scale-110 transition-transform">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">{label}</span>
        <span className="break-all text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">{value}</span>
      </div>
    </div>
  );
}
