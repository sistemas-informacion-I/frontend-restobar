import { Card } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { X, Download, Clock, Users, FileText } from 'lucide-react'
import type { Comanda } from '../../services/types'

interface ComandaViewProps {
  comanda: Comanda
  onClose: () => void
  onEdit?: () => void
  onPrint?: () => void
  onCancelDetalle?: (idDetalleComanda: number) => void
  onDeleteDetalle?: (idDetalleComanda: number) => void
  isLoading?: boolean
}

export function ComandaView({
  comanda,
  onClose,
  onEdit,
  onPrint,
  onCancelDetalle,
  onDeleteDetalle,
  isLoading = false
}: ComandaViewProps) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalItems = comanda.items?.reduce((sum, item) => sum + item.cantidad, 0) || 0
  const totalPrice = comanda.items?.reduce((sum, item) => sum + item.precioUnitario * item.cantidad, 0) || 0

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {comanda.numeroComanda}
          </h2>
          <div className="flex gap-2 flex-wrap">
            <Badge className={getEstadoBadgeColor(comanda.estado)}>
              {comanda.estado.replace('_', ' ')}
            </Badge>
            <Badge className={getTipoServicioBadgeColor(comanda.tipoServicio)}>
              {comanda.tipoServicio === 'MESA'
                ? `Mesa ${comanda.mesaNombre || ''}`
                : comanda.tipoServicio === 'PARA_LLEVAR'
                ? 'Para Llevar'
                : 'En Línea'}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </Button>
      </div>

      {/* Información General */}
      <Card className="p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Información General
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
              <Clock size={14} className="inline mr-2" />
              Fecha Apertura
            </label>
            <p className="text-sm text-gray-900 dark:text-white mt-1">
              {formatDate(comanda.fechaApertura)}
            </p>
          </div>

          {comanda.fechaCierre && (
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                <Clock size={14} className="inline mr-2" />
                Fecha Cierre
              </label>
              <p className="text-sm text-gray-900 dark:text-white mt-1">
                {formatDate(comanda.fechaCierre)}
              </p>
            </div>
          )}

          {comanda.numeroPersonas && (
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                <Users size={14} className="inline mr-2" />
                Personas
              </label>
              <p className="text-sm text-gray-900 dark:text-white mt-1">
                {comanda.numeroPersonas}
              </p>
            </div>
          )}

          {comanda.clienteNombre && (
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Cliente
              </label>
              <p className="text-sm text-gray-900 dark:text-white mt-1">
                {comanda.clienteNombre}
              </p>
            </div>
          )}

          {comanda.empleadoNombre && (
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Empleado
              </label>
              <p className="text-sm text-gray-900 dark:text-white mt-1">
                {comanda.empleadoNombre}
              </p>
            </div>
          )}

          {comanda.idReserva && (
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Reserva
              </label>
              <p className="text-sm text-gray-900 dark:text-white mt-1">
                #{comanda.idReserva}
              </p>
            </div>
          )}
        </div>

        {comanda.observaciones && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase flex items-center gap-2">
              <FileText size={14} />
              Observaciones
            </label>
            <p className="text-sm text-gray-900 dark:text-white mt-2 whitespace-pre-wrap">
              {comanda.observaciones}
            </p>
          </div>
        )}
      </Card>

      {/* Items */}
      {comanda.items && comanda.items.length > 0 && (
        <Card className="p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Productos ({totalItems} items)
          </h3>

          <div className="space-y-3">
            {comanda.items.map((item) => (
              <div
                key={item.idDetalleComanda}
                className="flex flex-col gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {item.productoNombre}
                      </p>
                      <Badge className="text-xs">
                        {item.estacionPreparacion === 'COCINA' ? '🍳 Cocina' : '🍹 Barra'}
                      </Badge>
                    </div>
                    {item.notas && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                        Nota: {item.notas}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Estado: <span className="font-semibold">{item.estado}</span>
                    </p>
                  </div>

                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.cantidad} × ${item.precioUnitario.toFixed(2)}
                    </p>
                    <p className="text-sm font-bold text-wine-600">
                      ${(item.precioUnitario * item.cantidad).toFixed(2)}
                    </p>
                  </div>
                </div>

                {item.estado === 'PENDIENTE' && (onCancelDetalle || onDeleteDetalle) && (
                  <div className="flex flex-wrap gap-2">
                    {onCancelDetalle && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onCancelDetalle(item.idDetalleComanda)}
                      >
                        Cancelar
                      </Button>
                    )}
                    {onDeleteDetalle && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteDetalle(item.idDetalleComanda)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Total: <span className="text-2xl font-bold text-wine-600">${totalPrice.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        {onPrint && (
          <Button
            variant="ghost"
            onClick={onPrint}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Descargar
          </Button>
        )}
        {onEdit && comanda.estado !== 'CERRADA' && comanda.estado !== 'CANCELADA' && (
          <Button
            onClick={onEdit}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            Editar
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
        >
          Cerrar
        </Button>
      </div>
    </div>
  )
}
