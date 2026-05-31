import { Search, User } from 'lucide-react'
import { Modal } from '@/shared/components/ui/Modal'
import type { ClienteMock } from '@/modules/comercial/models/ventaPresencial.model'

interface BuscarClienteModalProps {
  isOpen: boolean
  onClose: () => void
  busqueda: string
  onBusquedaChange: (v: string) => void
  clientes: ClienteMock[]
  onSeleccionarCliente: (c: ClienteMock) => void
}

export function BuscarClienteModal({
  isOpen,
  onClose,
  busqueda,
  onBusquedaChange,
  clientes,
  onSeleccionarCliente,
}: BuscarClienteModalProps) {
  return (
    <Modal.Root isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Header>Buscar Cliente</Modal.Header>
      <Modal.Body>
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-wine-900/40 dark:text-wine-400/40" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Buscar por nombre, NIT o email..."
            className="w-full rounded-xl border-2 border-wine-100/50 bg-slate-50/50 pl-10 pr-4 py-3 text-sm font-bold text-slate-900 dark:bg-black/20 dark:text-white dark:border-wine-900/30 focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 outline-none transition-all"
            autoFocus
          />
        </div>

        <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
          {clientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <User size={24} className="text-wine-900/20 dark:text-wine-400/20 mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">
                {busqueda.length < 2 ? 'Escribe al menos 2 caracteres' : 'No se encontraron clientes'}
              </p>
            </div>
          ) : (
            clientes.map((cliente) => (
              <button
                key={cliente.idCliente}
                type="button"
                onClick={() => onSeleccionarCliente(cliente)}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-wine-50 dark:hover:bg-wine-900/20 transition-all cursor-pointer text-left"
              >
                <div className="h-9 w-9 rounded-xl bg-wine-100 flex items-center justify-center dark:bg-wine-900/30">
                  <User size={16} className="text-wine-600 dark:text-wine-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    {cliente.nombre}
                  </p>
                  <div className="flex items-center gap-2">
                    {cliente.nit && (
                      <span className="text-[10px] font-bold text-wine-900/50 dark:text-wine-400/50">
                        NIT: {cliente.nit}
                      </span>
                    )}
                    {cliente.email && (
                      <span className="text-[10px] font-bold text-wine-900/40 dark:text-wine-400/40">
                        {cliente.email}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </Modal.Body>
    </Modal.Root>
  )
}
