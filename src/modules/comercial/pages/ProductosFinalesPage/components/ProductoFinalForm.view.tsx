import { useState } from 'react'
import { ProductoFinal, ProductoFinalRequest } from '../../../services/productosFinales.service'
import { Categoria } from '../../../services/categorias.service'

interface ProductoFinalFormProps {
  producto: ProductoFinal | null
  categorias: Categoria[]
  isLoading: boolean
  onCancel: () => void
  onSubmit: (data: ProductoFinalRequest, file?: File) => Promise<void>
}

export function ProductoFinalForm({
  producto,
  categorias,
  isLoading,
  onCancel,
  onSubmit,
}: ProductoFinalFormProps) {
  const [formData, setFormData] = useState<ProductoFinalRequest>({
    codigo: producto?.codigo || '',
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    idCategoria: producto?.idCategoria || categorias[0]?.idCategoria || 1,
    tiempoPreparacion: producto?.tiempoPreparacion,
    imagenUrl: producto?.imagenUrl || '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(producto?.imagenUrl || null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSend = {
      ...formData,
      imagenUrl: formData.imagenUrl?.trim() || undefined,
    }
    await onSubmit(dataToSend, selectedFile || undefined)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="md:col-span-7 flex flex-col gap-6">
          {/* Fila 1: Nombre */}
          <label className="grid gap-2">
            <span className="px-1 text-[10px] font-black uppercase tracking-[0.3em] text-wine-900/40 dark:text-wine-400/40">Nombre del Producto *</span>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              className="w-full rounded-2xl border border-wine-100/50 bg-slate-50/50 px-5 py-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400/60 outline-none transition-all duration-300 focus:border-wine-500 focus:bg-white dark:focus:bg-black/40 focus:ring-4 focus:ring-wine-500/10 hover:border-wine-300 dark:border-wine-900/30 dark:bg-black/20 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-wine-600 dark:focus:bg-black/40"
              placeholder="Nombre del producto"
            />
          </label>

          {/* Fila 2: Código y Categoría (Flexbox para evitar solapamientos) */}
          <div className="flex flex-col gap-6 sm:flex-row">
            <label className="flex-1 grid gap-2">
              <span className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Código *</span>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                required
                className="w-full rounded-2xl border border-wine-100/50 bg-slate-50/50 px-5 py-3.5 text-sm font-bold text-slate-900 outline-none transition-all focus:border-wine-500 focus:bg-white dark:focus:bg-black/40 dark:border-wine-900/30 dark:bg-black/20 dark:text-white"
                placeholder="PROD-001"
              />
            </label>
            <label className="flex-1 grid gap-2">
              <span className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Categoría *</span>
              <div className="relative">
                <select
                  value={formData.idCategoria}
                  onChange={(e) => setFormData({ ...formData, idCategoria: Number(e.target.value) })}
                  className="w-full rounded-2xl border border-wine-100/50 bg-slate-50/50 px-5 py-3.5 text-sm font-bold text-slate-900 outline-none transition-all focus:border-wine-500 focus:bg-white dark:focus:bg-black/40 dark:border-wine-900/30 dark:bg-black/20 dark:text-white appearance-none"
                >
                  {categorias.map((cat) => (
                    <option key={cat.idCategoria} value={cat.idCategoria}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-wine-900/30 dark:text-wine-100/20">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </label>
          </div>

          {/* Fila 3: Preparación */}
          <div className="flex flex-col gap-6 sm:flex-row">
            <label className="flex-1 grid gap-2">
              <span className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Preparación (min)</span>
              <input
                type="number"
                value={formData.tiempoPreparacion || ''}
                onChange={(e) => setFormData({ ...formData, tiempoPreparacion: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full rounded-2xl border border-wine-100/50 bg-slate-50/50 px-5 py-3.5 text-sm font-bold text-slate-900 outline-none transition-all focus:border-wine-500 focus:bg-white dark:focus:bg-black/40 dark:border-wine-900/30 dark:bg-black/20 dark:text-white"
                placeholder="30"
              />
            </label>
            <div className="flex-1" /> {/* Espacio vacío para mantener simetría */}
          </div>

          {/* Fila 4: Descripción */}
          <label className="grid gap-2">
            <span className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Descripción</span>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="min-h-[120px] rounded-2xl border border-wine-100/50 bg-slate-50/50 px-5 py-3.5 text-sm font-bold text-slate-900 outline-none transition-all focus:border-wine-500 focus:bg-white dark:focus:bg-black/40 dark:border-wine-900/30 dark:bg-black/20 dark:text-white"
              rows={4}
              placeholder="Detalles del producto..."
            />
          </label>
        </div>

        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="grid gap-2">
            <span className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Imagen del Producto</span>
            <div className="flex flex-col gap-4">
              <div className="group relative aspect-square w-full overflow-hidden rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/30 transition-all hover:border-wine-400 dark:border-wine-900/20 dark:bg-wine-950/10">
                {previewUrl ? (
                  <>
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Error+Carga'
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                      <label className="cursor-pointer rounded-xl bg-white/20 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md transition hover:bg-white/30">
                        Cambiar
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null)
                        setSelectedFile(null)
                        setFormData({ ...formData, imagenUrl: '' })
                      }}
                      className="absolute right-6 top-6 rounded-full bg-rose-500 p-2.5 text-white shadow-xl transition hover:bg-rose-600 active:scale-90 z-10 ring-4 ring-white/20"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3">
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wine-100 text-wine-600 transition group-hover:scale-110 group-hover:bg-wine-600 group-hover:text-white dark:bg-wine-900/30 dark:text-wine-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-wine-800/40 dark:text-wine-200/30">
                      Subir Imagen
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col-reverse justify-end gap-3 border-t border-wine-100/30 pt-6 dark:border-wine-900/10 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-wine-100/40 bg-wine-50/50 px-5 py-3 text-sm font-bold uppercase tracking-widest text-wine-700 transition hover:bg-wine-100/60 active:scale-95 dark:border-wine-900/20 dark:bg-wine-950/30 dark:text-wine-300 dark:hover:bg-wine-900/20 sm:flex-1"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-2xl bg-wine-600 px-5 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-wine-900/20 transition hover:bg-wine-700 active:scale-95 disabled:opacity-50 dark:bg-wine-500 dark:hover:bg-wine-600 sm:flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
