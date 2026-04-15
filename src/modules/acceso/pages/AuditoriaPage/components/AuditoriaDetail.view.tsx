import { X, Clock, Database, Globe, User, Shield } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { AuditoriaDetailProps } from './AuditoriaDetail'

interface AuditoriaDetailViewProps extends AuditoriaDetailProps {
  formatJson: (obj: Record<string, unknown> | undefined) => string | null
}

export function AuditoriaDetailView({ log, onClose, formatJson }: AuditoriaDetailViewProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-wine-950/40 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white/90 shadow-2xl dark:bg-black/60 dark:border dark:border-wine-900/30 backdrop-blur-2xl sm:h-auto animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-wine-100 px-6 py-5 dark:border-wine-900/30">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-900 text-white shadow-lg shadow-wine-900/20">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Detalles de Auditoría</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-wine-600/70 dark:text-wine-400/70">ID: {log.idLog} • Log Maestro</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-wine-50 hover:text-wine-600 dark:hover:bg-wine-900/30 dark:hover:text-wine-400 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Metadata Section */}
            <div className="flex flex-col gap-5 rounded-2xl border border-wine-100 bg-wine-50/30 p-6 dark:border-wine-900/20 dark:bg-wine-950/20">
              <div className="flex items-center gap-2">
                <div className="h-4 w-1 rounded-full bg-wine-600" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-wine-900/60 dark:text-wine-300/60">Contexto de Operación</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"><Database size={14} className="text-wine-600"/> Tabla</span>
                  <p className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{log.tabla}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"><Database size={14} className="text-wine-600"/> Objeto ID</span>
                  <p className="font-mono text-sm text-slate-900 dark:text-white bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded border border-wine-100/50 dark:border-wine-900/20 w-fit">{log.idRegistro || 'N/A'}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"><Clock size={14} className="text-wine-600"/> Fecha y Hora</span>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {new Date(log.fechaOperacion).toLocaleDateString()} <span className="text-wine-600 font-medium">@</span> {new Date(log.fechaOperacion).toLocaleTimeString()}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"><Database size={14} className="text-wine-600"/> Acción</span>
                  <span className={`inline-flex items-center rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    log.operacion === 'INSERT' ? 'bg-emerald-500 text-white shadow-emerald-900/20' :
                    log.operacion === 'UPDATE' ? 'bg-wine-600 text-white shadow-wine-900/20' :
                    'bg-rose-600 text-white shadow-rose-900/20'
                  }`}>
                    {log.operacion}
                  </span>
                </div>
              </div>
            </div>

            {/* User Details Section */}
            <div className="flex flex-col gap-5 rounded-2xl border border-wine-100 bg-wine-50/30 p-6 dark:border-wine-900/20 dark:bg-wine-950/20">
              <div className="flex items-center gap-2">
                <div className="h-4 w-1 rounded-full bg-wine-600" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-wine-900/60 dark:text-wine-300/60">Actor de la Acción</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"><User size={14} className="text-wine-600"/> Usuario</span>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-wine-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {(log.username || 'S').charAt(0).toUpperCase()}
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white">{log.username || log.idUsuario || 'Sistema'}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"><Globe size={14} className="text-wine-600"/> IP Origen</span>
                  <p className="font-mono text-sm text-slate-900 dark:text-white">{log.ipOrigen || 'N/A'}</p>
                </div>
                <div className="col-span-2 space-y-2">
                  <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"><Globe size={14} className="text-wine-600"/> User Agent</span>
                  <p className="break-words text-[10px] font-medium text-slate-600 dark:text-slate-400 bg-white/40 dark:bg-black/20 p-3 rounded-xl border border-wine-100/50 dark:border-wine-900/10 leading-relaxed italic">
                    {log.userAgent || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Changes Section (Raw JSON View) */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-wine-200 dark:via-wine-900/50 to-transparent" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 px-2">
                  {log.operacion === 'UPDATE' ? 'Análisis de Diferencias' : 'Estructura de Datos'}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-wine-200 dark:via-wine-900/50 to-transparent" />
              </div>
              
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="flex flex-col rounded-2xl border border-wine-100 bg-white shadow-xl shadow-wine-900/5 dark:border-wine-900/30 dark:bg-black/40 overflow-hidden group">
                  <div className="border-b border-wine-100 bg-wine-50/50 px-5 py-3 dark:border-wine-900/30 dark:bg-wine-950/30 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-wine-900/60 dark:text-wine-300/60">Estado Anterior</span>
                    <div className="h-2 w-2 rounded-full bg-rose-400/50" />
                  </div>
                  <div className="p-5 overflow-auto max-h-[350px] custom-scrollbar">
                    {log.datosAnteriores ? (
                      <pre className="font-mono text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {formatJson(log.datosAnteriores)}
                      </pre>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-wine-100 dark:border-wine-900/20 rounded-xl bg-slate-50/50 dark:bg-black/20">
                        <Database size={24} className="text-wine-200 dark:text-wine-900/40 mb-2" />
                        <span className="text-xs font-bold uppercase tracking-widest text-wine-300 dark:text-wine-900/60">Sin datos</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col rounded-2xl border border-wine-100 bg-white shadow-xl shadow-wine-900/5 dark:border-wine-900/30 dark:bg-black/40 overflow-hidden group">
                  <div className="border-b border-wine-100 bg-wine-50/50 px-5 py-3 dark:border-wine-900/30 dark:bg-wine-950/30 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-wine-900/60 dark:text-wine-300/60">Nuevo Estado</span>
                    <div className="h-2 w-2 rounded-full bg-emerald-400/50 animate-pulse" />
                  </div>
                  <div className="p-5 overflow-auto max-h-[350px] custom-scrollbar">
                    {log.datosNuevos ? (
                      <pre className="font-mono text-xs text-wine-900/80 dark:text-wine-100/80 leading-relaxed">
                        {formatJson(log.datosNuevos)}
                      </pre>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-wine-100 dark:border-wine-900/20 rounded-xl bg-slate-50/50 dark:bg-black/20">
                        <Database size={24} className="text-wine-200 dark:text-wine-900/40 mb-2" />
                        <span className="text-xs font-bold uppercase tracking-widest text-wine-300 dark:text-wine-900/60">Sin datos</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-wine-100 bg-wine-50/30 px-8 py-5 dark:border-wine-900/30 dark:bg-black/40 backdrop-blur-md">
          <Button variant="secondary" onClick={onClose} className="hover-lift px-8">
            Cerrar Detalles
          </Button>
        </div>
      </div>
    </div>
  )
}
