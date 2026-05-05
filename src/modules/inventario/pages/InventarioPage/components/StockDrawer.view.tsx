import { useState, useEffect } from 'react'
import { Package, X, History, Tag, Calendar, Clock, AlertTriangle, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { InventarioItem, StockSucursal, EstadoLote, LoteRequest } from '../../../services/inventario.service'
import { useLotes, useRevalidateOnMount } from '../../../hooks/useInventario'
import { LoteForm } from './LoteForm.view'

interface StockDrawerProps {
  insumo: InventarioItem
  stock: StockSucursal | null
  isOpen: boolean
  onClose: () => void
  onChangeEstado: (idLote: number, estado: EstadoLote, mutateLotes: () => void) => Promise<void>
  onAddLote: (data: LoteRequest) => Promise<{ success: boolean; error?: string }>
  openStockInitialModal: (insumo: InventarioItem) => void
}

export function StockDrawer({ 
  insumo, 
  stock, 
  isOpen, 
  onClose, 
  onChangeEstado, 
  onAddLote,
  openStockInitialModal 
}: StockDrawerProps) {
  // Pagination logic (Backend is 0-indexed)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5
  
  const { 
    lotes, 
    totalPages, 
    isLoading: loadingLotes, 
    mutate: mutateLotes 
  } = useLotes(stock?.idStock, currentPage - 1, pageSize)

  useRevalidateOnMount(stock?.idStock)
  const [showLoteForm, setShowLoteForm] = useState(false)
  
  // Reset page when stock changes
  useEffect(() => {
    setCurrentPage(1)
  }, [stock?.idStock])

  const paginatedLotes = lotes // Already paginated and sorted from backend

  return (
    <div className={`fixed inset-0 z-[1000] flex justify-end transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
      <div className={`absolute inset-0 bg-wine-950/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      
      <div className={`relative flex h-full w-full max-w-2xl flex-col bg-white shadow-[0_0_100px_rgba(0,0,0,0.2)] transition-transform duration-500 dark:bg-[#0a0a0a] md:rounded-l-[3rem] border-l border-wine-100/30 dark:border-wine-900/20 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-wine-100/30 p-8 dark:border-wine-900/10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-wine-600 to-wine-900 text-white shadow-xl shadow-wine-900/30">
              <Package size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{insumo.nombre}</h2>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-600">{insumo.codigo} • {insumo.marca || 'Sin marca'}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-2xl bg-slate-100 p-3 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {stock ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-3xl bg-white p-6 border border-wine-100/50 dark:bg-black/40 dark:border-wine-900/20 shadow-lg">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stock Total</p>
                  <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                    {stock.cantidad} <span className="text-[10px] text-wine-600 dark:text-wine-400 font-bold">{insumo.unidadMedida}</span>
                  </p>
                </div>
                <div className="rounded-3xl bg-white p-6 border border-wine-100/50 dark:bg-black/40 dark:border-wine-900/20 shadow-lg">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Precio Prom.</p>
                  <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                    <span className="text-wine-600 dark:text-wine-400">$</span>{stock.precioPromedio.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-3xl bg-white p-6 border border-wine-100/50 dark:bg-black/40 dark:border-wine-900/20 shadow-lg">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Último Precio</p>
                  <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                    <span className="text-wine-600 dark:text-wine-400">$</span>{stock.precioUnitario.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-100">
                    <History size={18} className="text-wine-600" />
                    Historial de Lotes
                  </h3>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="rounded-xl h-9 text-[10px] font-black"
                    onClick={() => setShowLoteForm(true)}
                  >
                    + Agregar Lote
                  </Button>
                </div>

                {loadingLotes ? (
                  <div className="flex py-12 justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-wine-200 border-t-wine-600" />
                  </div>
                ) : paginatedLotes.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {paginatedLotes.map((lote: any) => (
                        <div key={lote.idLote} className="group relative overflow-hidden rounded-3xl border border-wine-100/50 bg-white p-5 transition-all hover:shadow-lg dark:border-wine-900/20 dark:bg-black/40">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg ${
                                lote.estado === 'DISPONIBLE' ? 'bg-emerald-500 shadow-emerald-500/20' : 
                                lote.estado === 'VENCIDO' ? 'bg-rose-500 shadow-rose-500/20' : 
                                lote.estado === 'DAÑADO' ? 'bg-amber-500 shadow-amber-500/20' : 'bg-slate-400 shadow-slate-400/20'
                              }`}>
                                <Tag size={18} />
                              </div>
                              <div>
                                <p className="text-xs font-black text-slate-800 dark:text-slate-100">Lote: {lote.numeroLote || 'Sin Nro'}</p>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                  <Calendar size={12} /> {lote.fechaIngreso}
                                  {lote.fechaVencimiento && (
                                    <span className="flex items-center gap-1 text-rose-500/70">
                                      <Clock size={12} /> Vence: {lote.fechaVencimiento}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-slate-800 dark:text-slate-100">{lote.cantidad} {insumo.unidadMedida}</p>
                              <p className="text-[10px] font-bold text-wine-600">${lote.precioCompra.toFixed(2)} / ud</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center justify-end gap-2 pt-3 border-t border-wine-100/20 dark:border-wine-900/10">
                            {lote.estado === 'DISPONIBLE' && (
                              <>
                                <button 
                                  onClick={() => onChangeEstado(lote.idLote, 'DAÑADO', mutateLotes)}
                                  className="px-3 py-1.5 rounded-xl bg-amber-50 text-[9px] font-black text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30 transition-colors"
                                >
                                  MARCAR DAÑADO
                                </button>
                                <button 
                                  onClick={() => onChangeEstado(lote.idLote, 'VENCIDO', mutateLotes)}
                                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-[9px] font-black text-rose-600 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/30 transition-colors"
                                >
                                  MARCAR VENCIDO
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between border-t border-wine-100/20 pt-6 dark:border-wine-900/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Página {currentPage} de {totalPages}
                        </p>
                        <div className="flex gap-2">
                          <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 disabled:opacity-30 dark:bg-slate-800 transition-all hover:bg-wine-50 hover:text-wine-600"
                          >
                            <ChevronRight className="rotate-180" size={18} />
                          </button>
                          <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 disabled:opacity-30 dark:bg-slate-800 transition-all hover:bg-wine-50 hover:text-wine-600"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 border border-dashed border-wine-100/50 bg-white/30 dark:bg-black/20 dark:border-wine-900/30 rounded-[2.5rem]">
                    <History size={48} className="opacity-20 mb-4 text-wine-600 dark:text-wine-400" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Sin historial de lotes</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-wine-50 text-wine-200 dark:bg-wine-900/10 mb-6">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">Stock No Inicializado</h3>
              <p className="mt-2 max-w-xs text-xs font-medium text-slate-500">Este insumo aún no tiene un registro de existencias en esta sucursal.</p>
              <Button 
                variant="secondary" 
                className="mt-8 rounded-2xl h-12 px-8"
                onClick={() => openStockInitialModal(insumo)}
              >
                Configurar Stock Inicial
              </Button>
            </div>
          )}
        </div>

        {showLoteForm && (
          <LoteForm 
            idStock={stock?.idStock!}
            onCancel={() => setShowLoteForm(false)}
            onSubmit={async (data) => {
              const res = await onAddLote(data)
              if (res.success) {
                setShowLoteForm(false)
                mutateLotes()
              }
              return res
            }}
          />
        )}
      </div>
    </div>
  )
}
