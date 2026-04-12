import { X, Clock, Database, Globe, User, Shield } from 'lucide-react'
import { AuditLog } from '../../services/api'
import { Button } from '@/shared/components/ui/Button'

interface AuditoriaDetailProps {
  log: AuditLog
  onClose: () => void
}

const formatJson = (obj: Record<string, unknown> | undefined) => {
  if (!obj) return null
  return JSON.stringify(obj, null, 2)
}

export function AuditoriaDetail({ log, onClose }: AuditoriaDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 sm:h-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Detalles de Auditoría</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">ID: {log.id} • Log del sistema</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Metadata Section */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/50">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Contexto de Operación</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><Database size={14}/> Tabla</span>
                  <p className="font-medium text-slate-900 dark:text-white uppercase">{log.tabla}</p>
                </div>
                <div className="space-y-1">
                  <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><Database size={14}/> Objeto ID</span>
                  <p className="font-medium text-slate-900 dark:text-white">{log.idRegistro || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><Clock size={14}/> Fecha y Hora</span>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {new Date(log.fechaOperacion).toLocaleDateString()} {new Date(log.fechaOperacion).toLocaleTimeString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><Database size={14}/> Acción</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    log.operacion === 'INSERT' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400' :
                    log.operacion === 'UPDATE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400' :
                    'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400'
                  }`}>
                    {log.operacion}
                  </span>
                </div>
              </div>
            </div>

            {/* User Details Section */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/50">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actor de la Acción</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><User size={14}/> Usuario</span>
                  <p className="font-medium text-slate-900 dark:text-white">{log.username || log.idUsuario || 'Sistema'}</p>
                </div>
                <div className="space-y-1">
                  <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><Globe size={14}/> IP Origen</span>
                  <p className="font-medium text-slate-900 dark:text-white">{log.ipOrigen || 'N/A'}</p>
                </div>
                <div className="col-span-2 space-y-1">
                  <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><Globe size={14}/> User Agent</span>
                  <p className="break-words text-xs text-slate-700 dark:text-slate-300 opacity-70">
                    {log.userAgent || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Changes Section (Raw JSON View) */}
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {log.operacion === 'UPDATE' ? 'Comparación de Estados' : 'Detalle de Datos'}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-2 dark:border-slate-800 dark:bg-slate-900/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Datos Anteriores</span>
                  </div>
                  <div className="p-4 overflow-auto max-h-[400px]">
                    {log.datosAnteriores ? (
                      <pre className="font-mono text-xs text-slate-600 dark:text-slate-400 leading-relaxed overflow-x-auto">
                        {formatJson(log.datosAnteriores)}
                      </pre>
                    ) : (
                      <span className="text-sm italic text-slate-500 flex items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                        Sin datos previos
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-2 dark:border-slate-800 dark:bg-slate-900/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Datos Nuevos / Resultado</span>
                  </div>
                  <div className="p-4 overflow-auto max-h-[400px]">
                    {log.datosNuevos ? (
                      <pre className="font-mono text-xs text-slate-600 dark:text-slate-400 leading-relaxed overflow-x-auto">
                        {formatJson(log.datosNuevos)}
                      </pre>
                    ) : (
                      <span className="text-sm italic text-slate-500 flex items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                        Sin datos finales
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
