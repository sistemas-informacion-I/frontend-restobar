import { Eye, Edit2, Trash2, CheckCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import type { Comanda } from '../../services/types'

interface ComandasTableProps {
  comandas: Comanda[]
  isLoading: boolean
  onViewClick: (comanda: Comanda) => void
  onEditClick: (comanda: Comanda) => void
  onCloseClick: (comanda: Comanda) => void
  onDeleteClick: (comanda: Comanda) => void
  canEdit?: boolean
  canDelete?: boolean
  canClose?: boolean
}

export function ComandasTable({
  comandas,
  isLoading,
  onViewClick,
  onEditClick,
  onCloseClick,
  onDeleteClick,
  canEdit = true,
  canDelete = true,
  canClose = true
}: ComandasTableProps) {
  const getEstadoBadgeColor = (estado: string) => {
    const colors: Record<string, string> = {
      ABIERTA: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      EN_PREPARACION: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      LISTA: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      ENTREGADA: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      CERRADA: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      CANCELADA: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      PENDIENTE_PAGO: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    }
    return colors[estado] || colors.ABIERTA
  }

  const getTipoServicioBadgeColor = (tipo: string) => {
    const colors: Record<string, string> = {
      MESA: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      PARA_LLEVAR: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
      ONLINE: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300'
    }
    return colors[tipo] || colors.MESA
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin">
          <div className="h-8 w-8 border-4 border-wine-600 border-r-transparent rounded-full" />
        </div>
      </div>
    )
  }

  if (comandas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
        <div className="text-4xl mb-3">📋</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          No hay comandas
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Las comandas creadas aparecerán aquí
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white">
              Número
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white">
              Info
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 dark:text-white">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {comandas.map((comanda) => (
            <tr
              key={comanda.idComanda}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
            >
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {comanda.numeroComanda}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(comanda.fechaApertura).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge className={getTipoServicioBadgeColor(comanda.tipoServicio)}>
                  {comanda.tipoServicio === 'MESA'
                    ? `Mesa ${comanda.mesaNombre || ''}`
                    : comanda.tipoServicio === 'PARA_LLEVAR'
                    ? 'Para Llevar'
                    : 'En Línea'}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <Badge className={getEstadoBadgeColor(comanda.estado)}>
                  {comanda.estado.replace('_', ' ')}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1 text-sm">
                  {comanda.numeroPersonas && (
                    <span className="text-gray-600 dark:text-gray-400">
                      👥 {comanda.numeroPersonas} personas
                    </span>
                  )}
                  {comanda.clienteNombre && (
                    <span className="text-gray-600 dark:text-gray-400">
                      {comanda.clienteNombre}
                    </span>
                  )}
                  {comanda.items && (
                    <span className="text-gray-600 dark:text-gray-400">
                      📦 {comanda.items.length} items
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewClick(comanda)}
                    title="Ver detalles"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Eye size={16} />
                  </Button>

                  {canEdit && comanda.estado !== 'CERRADA' && comanda.estado !== 'CANCELADA' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditClick(comanda)}
                      title="Editar"
                      className="text-wine-600 hover:text-wine-700 hover:bg-wine-50"
                    >
                      <Edit2 size={16} />
                    </Button>
                  )}

                  {canClose && comanda.estado !== 'CERRADA' && comanda.estado !== 'CANCELADA' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCloseClick(comanda)}
                      title="Cerrar comanda"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle size={16} />
                    </Button>
                  )}

                  {canDelete && comanda.estado !== 'CERRADA' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteClick(comanda)}
                      title="Eliminar"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
