import { ProductoFinal } from '../../../services/productosFinales.service'

interface ProductoFinalViewProps {
  producto: ProductoFinal
}

export function ProductoFinalView({ producto }: ProductoFinalViewProps) {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Encabezado a pantalla completa para fijar la línea de base */}
      <div className="flex items-center gap-6 border-b border-wine-100/20 pb-6">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[2rem] bg-gradient-to-br from-wine-600 to-wine-900 text-white shadow-2xl shadow-wine-900/20 ring-4 ring-white/10">
          <span className="text-3xl font-black uppercase">{producto.nombre.charAt(0)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
            {producto.nombre}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className={`h-2 w-2 rounded-full ${producto.activo ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {producto.activo ? 'Producto Maestro Activo' : 'Producto Inactivo'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Cuerpo en Grid perfectamente alineado */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className={`flex flex-col gap-6 ${producto.imagenUrl ? 'md:col-span-7' : 'md:col-span-12'}`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCard label="Código Maestro" value={producto.codigo} icon="C" />
            <InfoCard label="Categoría" value={producto.nombreCategoria || 'Sin categoría'} icon="K" />
            {producto.tiempoPreparacion && (
              <div className="sm:col-span-2">
                <InfoCard label="Tiempo de Preparación Estimado" value={`${producto.tiempoPreparacion} minutos`} icon="T" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="px-1 text-[10px] font-black uppercase tracking-[0.3em] text-wine-900/30 dark:text-wine-100/20">Descripción</h4>
            <div className="rounded-[2rem] border border-wine-100/20 bg-slate-50/30 p-6 dark:border-wine-900/10 dark:bg-black/20 min-h-[120px]">
              <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                {producto.descripcion || 'No se ha definido una descripción técnica para este producto.'}
              </p>
            </div>
          </div>
        </div>

        {producto.imagenUrl && (
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="group relative aspect-square w-full overflow-hidden rounded-[3rem] border-8 border-white bg-white shadow-[0_20px_50px_-20px_rgba(69,10,10,0.2)] transition-all duration-500 hover:scale-[1.02] dark:border-wine-900/20 dark:bg-black/20">
              <img 
                src={producto.imagenUrl} 
                alt={producto.nombre} 
                className="h-full w-full object-contain p-6 transition duration-700 group-hover:scale-110" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Error+Carga'
                }}
              />
            </div>
            <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-wine-900/20 dark:text-wine-100/10">Vista Previa</p>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoCard({
  label,
  value,
  icon,
  isLink = false,
}: {
  label: string
  value: string
  icon?: string
  isLink?: boolean
}) {
  return (
    <div className="group flex items-start gap-4 rounded-2xl border border-wine-100/30 bg-white/50 p-4 transition-all hover:bg-white dark:border-wine-900/20 dark:bg-wine-950/20 dark:hover:bg-black/40">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-wine-50 text-wine-600 shadow-sm transition-colors group-hover:bg-wine-600 group-hover:text-white dark:bg-wine-900/20 dark:text-wine-400 font-black text-sm">
        {icon || label.charAt(0)}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-wine-900/30 dark:text-wine-100/20">{label}</span>
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-sm font-bold text-slate-900 transition hover:text-wine-700 hover:underline dark:text-white dark:hover:text-wine-400"
          >
            Ver enlace
          </a>
        ) : (
          <span className="break-words text-sm font-bold tracking-tight text-slate-900 dark:text-white">{value}</span>
        )}
      </div>
    </div>
  )
}
