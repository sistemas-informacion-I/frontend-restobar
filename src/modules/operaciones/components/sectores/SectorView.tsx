import { Grid3X3, Info, Store, Layers } from 'lucide-react'

export interface Sector {
  idSector: number
  nombre: string
  descripcion?: string
  tipoSector: string
  activo: boolean
  idSucursal: number
  nombreSucursal?: string
}

interface SectorViewProps {
  sector: Sector
}

const tipoSectorLabels: Record<string, string> = {
  SALON: 'Salón Principal',
  BARRA: 'Barra',
  TERRAZA: 'Terraza',
  VIP: 'Zona VIP',
  COCINA: 'Área de Cocina',
}

export function SectorView({ sector }: SectorViewProps) {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Profile Style */}
      <div className="flex flex-col items-center gap-6 border-b border-wine-100/30 pb-8 text-center dark:border-wine-900/10 sm:flex-row sm:items-start sm:text-left">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[2rem] bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-2xl shadow-wine-900/30 ring-4 ring-white dark:ring-wine-900/20">
          <Layers size={36} />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{sector.nombre}</h3>
          <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
            <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
              sector.activo 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            }`}>
              <div className={`h-1.5 w-1.5 rounded-full ${sector.activo ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {sector.activo ? 'Habilitado' : 'Deshabilitado'}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-wine-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-wine-600 dark:text-wine-400 border border-wine-500/10">
              Sector #{sector.idSector}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de Sector */}
        <InfoCard 
          icon={<Grid3X3 size={20} />} 
          label="Categoría / Tipo" 
          value={tipoSectorLabels[sector.tipoSector] || sector.tipoSector} 
        />

        {/* Sucursal */}
        <InfoCard 
          icon={<Store size={20} />} 
          label="Sucursal de Pertenencia" 
          value={sector.nombreSucursal || `Sucursal #${sector.idSucursal}`} 
        />

        {/* Descripción */}
        <div className="md:col-span-2">
          <InfoCard 
            icon={<Info size={20} />} 
            label="Descripción del Área" 
            value={sector.descripcion || 'Sin descripción adicional registrada para este sector.'} 
          />
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="group flex items-start gap-4 rounded-[1.75rem] border border-wine-100/30 bg-white/50 p-5 transition-all hover:bg-white dark:border-wine-900/20 dark:bg-wine-950/20 dark:hover:bg-black/40">
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