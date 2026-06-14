import { Search, ClipboardList, Filter } from 'lucide-react'
import { Input } from '@/shared/components/ui/Input'
import { Select } from '@/shared/components/ui/Select/Select'
import { ComandaCard } from './ComandaCard.view'
import { SkeletonLoading } from './SkeletonLoading.view'
import type { Comanda } from '@/modules/comercial/models/ventaPresencial.model'

interface ComandasListProps {
  comandas: Comanda[]
  isLoading: boolean
  search: string
  onSearchChange: (v: string) => void
  filtroEstado: string
  onFiltroEstadoChange: (v: string) => void
  estados: string[]
  comandaSeleccionada: Comanda | null
  onSelectComanda: (comanda: Comanda) => void
}

export function ComandasList({
  comandas,
  isLoading,
  search,
  onSearchChange,
  filtroEstado,
  onFiltroEstadoChange,
  estados,
  comandaSeleccionada,
  onSelectComanda,
}: ComandasListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-wine-600/10 text-wine-600 dark:bg-wine-500/10 dark:text-wine-400">
          <ClipboardList size={22} />
        </div>
        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
            Comandas
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">
            Gestión de Ventas Presenciales
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <Input
          type="text"
          placeholder="Buscar comanda..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="!rounded-2xl border-wine-100/50 bg-white/50 backdrop-blur-sm focus:border-wine-600 dark:border-wine-900/20 dark:bg-black/20"
          icon={<Search size={18} className="text-wine-900/40" />}
        />
        {estados.length > 0 && (
          <Select
            value={filtroEstado}
            onChange={(val) => onFiltroEstadoChange(String(val))}
            options={[
              { value: '', label: 'Todos los estados' },
              ...estados.map((est) => ({ value: est, label: est })),
            ]}
            placeholder="Filtrar por estado"
            icon={<Filter size={18} />}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 px-0.5 py-0.5 custom-scrollbar">
        {isLoading ? (
          <SkeletonLoading />
        ) : comandas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-2xl bg-wine-100/50 flex items-center justify-center mb-3 dark:bg-wine-900/20">
              <Search size={20} className="text-wine-900/30 dark:text-wine-400/30" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">
              No se encontraron comandas
            </p>
          </div>
        ) : (
          comandas.map((comanda) => (
            <ComandaCard
              key={comanda.idComanda}
              comanda={comanda}
              isSelected={comandaSeleccionada?.idComanda === comanda.idComanda}
              onSelect={() => onSelectComanda(comanda)}
            />
          ))
        )}
      </div>
    </div>
  )
}
