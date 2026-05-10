import { Plus, Search, ShoppingCart, Building2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Select } from '@/shared/components/ui/Select/Select'
import { Proveedor } from '@/modules/comercial/services/proveedores.service'

interface CompraToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  total: number
  canCreate: boolean
  onCreate: () => void
  proveedores: Proveedor[]
  filtroProveedor: string
  onFiltroProveedorChange: (value: string) => void
  filtroEstado: string
  onFiltroEstadoChange: (value: string) => void
}

const ESTADOS: { value: string; label: string }[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'PAGADO', label: 'Pagado' },
  { value: 'PARCIAL', label: 'Parcial' },
  { value: 'VENCIDO', label: 'Vencido' },
]

export function CompraToolbar({
  search,
  onSearchChange,
  total,
  canCreate,
  onCreate,
  proveedores,
  filtroProveedor,
  onFiltroProveedorChange,
  filtroEstado,
  onFiltroEstadoChange,
}: CompraToolbarProps) {
  return (
    <>
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wine-600/10 text-wine-600 dark:bg-wine-500/10 dark:text-wine-400">
              <ShoppingCart size={28} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-4xl">
              Compras
            </h1>
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-300/40 ml-1">
            Gestión de Compras
          </p>
        </div>

        {canCreate && (
          <Button
            onClick={onCreate}
            className="h-12 rounded-2xl px-6 shadow-xl shadow-wine-900/20 active:scale-95 transition-transform"
          >
            <Plus size={18} className="mr-2 stroke-[3px]" />
            <span className="font-black uppercase tracking-widest text-[10px]">Nueva Compra</span>
          </Button>
        )}
      </header>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="w-full max-w-md">
            <Input
              type="text"
              placeholder="Buscar por N° factura..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-12 !rounded-2xl border-wine-100/50 bg-white/50 backdrop-blur-sm focus:border-wine-600 dark:border-wine-900/20 dark:bg-black/20"
              icon={<Search size={18} className="text-wine-900/40" />}
            />
          </div>

          <div className="w-full min-w-[200px] sm:w-auto">
            <Select
              value={filtroProveedor || ''}
              onChange={(val) => onFiltroProveedorChange(String(val))}
              options={[
                { value: '', label: 'Todos los proveedores' },
                ...proveedores.map((p) => ({
                  value: String(p.idProveedor),
                  label: p.empresa,
                })),
              ]}
              placeholder="Filtrar por proveedor"
              icon={<Building2 size={18} />}
              className="h-12"
            />
          </div>

          <div className="w-full min-w-[180px] sm:w-auto">
            <Select
              value={filtroEstado || ''}
              onChange={(val) => onFiltroEstadoChange(String(val))}
              options={ESTADOS.map((e) => ({ value: e.value, label: e.label }))}
              placeholder="Filtrar por estado"
              icon={<CheckCircle2 size={18} />}
              className="h-12"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 px-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-300/40">
            Total de
          </span>
          <span className="inline-flex h-8 items-center rounded-xl bg-wine-600 px-4 text-[11px] font-black tracking-widest text-white shadow-lg shadow-wine-900/20">
            {total} COMPRAS
          </span>
        </div>
      </div>
    </>
  )
}
