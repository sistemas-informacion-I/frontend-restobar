import { Store, Phone, Mail, Clock, Globe, MapPin } from 'lucide-react'
import { Grid3X3 } from 'lucide-react'
import { Sucursal, Sector } from '../../services/types'

interface SucursalViewProps {
  sucursal: Sucursal
  sectores?: Sector[]
}

export function SucursalView({sucursal, sectores}: SucursalViewProps) {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Profile Style */}
      <div className="flex flex-col items-center gap-6 border-b border-wine-100/30 pb-8 text-center dark:border-wine-900/10 sm:flex-row sm:items-start sm:text-left">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[2rem] bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-2xl shadow-wine-900/30 ring-4 ring-white dark:ring-wine-900/20">
          <Store size={36} />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{sucursal.nombre}</h3>
          <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
            <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
              sucursal.activo 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            }`}>
              <div className={`h-1.5 w-1.5 rounded-full ${sucursal.activo ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {sucursal.activo ? 'Operativa' : 'Inactiva'}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-wine-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-wine-600 dark:text-wine-400 border border-wine-500/10">
              ID #{sucursal.idSucursal}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dirección */}
        <InfoCard 
          icon={<MapPin size={20} />} 
          label="Dirección Física" 
          value={sucursal.direccion || 'Sin dirección registrada'} 
        />

        {/* Teléfono */}
        <InfoCard 
          icon={<Phone size={20} />} 
          label="Teléfono de Contacto" 
          value={sucursal.telefono || 'Sin teléfono'} 
        />

        {/* Correo */}
        <InfoCard 
          icon={<Mail size={20} />} 
          label="Correo Electrónico" 
          value={sucursal.correo || 'Sin correo asociado'} 
        />

        {/* Ubicación */}
        <InfoCard 
          icon={<Globe size={20} />} 
          label="Ciudad / Departamento" 
          value={`${sucursal.ciudad || '-'}${sucursal.departamento ? `, ${sucursal.departamento}` : ''}`} 
        />

        {/* Horario */}
        <InfoCard 
          icon={<Clock size={20} />} 
          label="Horario de Atención" 
          value={(sucursal.horarioApertura || sucursal.horarioCierre) 
            ? `${sucursal.horarioApertura} - ${sucursal.horarioCierre}` 
            : 'No definido'} 
        />

        {/* Estado Operativo */}
        <InfoCard 
          icon={<Clock size={20} />} 
          label="Estado Operativo" 
          value={sucursal.estadoOperativo || 'Estándar'} 
        />
      </div>

      {/* Sectores Section */}
      <div className="flex flex-col gap-4 mt-2">
        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-wine-900/40 dark:text-wine-100/30 flex items-center gap-2">
          <div className="h-px flex-1 bg-wine-100/50 dark:bg-wine-900/20" />
          Sectores de la Sucursal
          <div className="h-px flex-1 bg-wine-100/50 dark:bg-wine-900/20" />
        </h4>
        
        {sectores && sectores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sectores.map((sector) => (
              <div key={sector.idSector} className="group relative flex items-center gap-4 rounded-3xl border border-wine-100/30 bg-wine-50/20 p-4 transition-all hover:bg-wine-50/50 dark:border-wine-900/10 dark:bg-wine-900/5 dark:hover:bg-wine-900/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-wine-100/50 dark:bg-wine-950/20 dark:border-wine-900/30 text-wine-600 dark:text-wine-400">
                  <Grid3X3 size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate tracking-tight">{sector.nombre}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-wine-600/60 dark:text-wine-400/60">{sector.tipoSector}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border-2 border-dashed border-wine-100/30 py-8 text-center bg-wine-50/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-wine-900/30 dark:text-wine-100/20">No hay sectores registrados</span>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="group flex items-start gap-4 rounded-[1.75rem] border border-wine-100/30 bg-white/50 p-4 transition-all hover:bg-white dark:border-wine-900/20 dark:bg-wine-950/20 dark:hover:bg-black/40">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-wine-50 text-wine-600 shadow-sm transition-colors group-hover:bg-wine-600 group-hover:text-white dark:bg-wine-900/20 dark:text-wine-400">
        {icon}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-wine-900/30 dark:text-wine-100/20">{label}</span>
        <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight break-words">{value}</span>
      </div>
    </div>
  )
}