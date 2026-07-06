import { ComandasList } from './components/ComandasList.view'
import { VentaDetalle } from './components/VentaDetalle.view'
import { ResumenFinanciero } from './components/ResumenFinanciero.view'
import { AjustesVenta } from './components/AjustesVenta.view'
import { ClienteSection } from './components/ClienteSection.view'
import { MetodoPago } from './components/MetodoPago.view'
import { AccionesVenta } from './components/AccionesVenta.view'
import { ModalConfirmar } from './components/ModalConfirmar.view'
import { ModalTicket } from './components/ModalTicket.view'
import { BuscarClienteModal } from './components/BuscarClienteModal.view'
import { PayPalModal } from './components/PayPalModal.view'
import { EmptyState } from './components/EmptyState.view'
import type {
  Comanda,
  ProductoVenta,
  ClienteVenta,
  ClienteMock,
  AjustesVenta as AjustesVentaType,
  MetodoPagoResponse,
  EstadoVenta,
} from '../../models/ventaPresencial.model'

interface VentasPageViewProps {
  comandas: Comanda[]
  comandasLoading: boolean
  searchComanda: string
  onSearchComandaChange: (v: string) => void
  filtroEstado: string
  onFiltroEstadoChange: (v: string) => void
  estados: string[]
  comandaSeleccionada: Comanda | null
  onSelectComanda: (comanda: Comanda) => void
  productos: ProductoVenta[]
  productosLoading: boolean
  subtotalOriginal: number
  descuentoPromociones: number
  subtotalConPromociones: number
  descuentoManual: number
  impuesto: number
  propinaTotal: number
  total: number
  ajustes: AjustesVentaType
  onDescuentoPorcentualChange: (v: number) => void
  onDescuentoFijoChange: (v: number) => void
  onPropinaPorcentualChange: (v: number) => void
  onPropinaFijaChange: (v: number) => void
  onPropinaQuick: (porcentaje: number) => void
  cliente: ClienteVenta
  nitManual: string
  onNitManualChange: (v: string) => void
  onAsignarCliente: (c: ClienteMock) => void
  onVentaAnonima: () => void
  onAbrirModalCliente: () => void
  isClienteModalOpen: boolean
  onCloseClienteModal: () => void
  busquedaCliente: string
  onBusquedaClienteChange: (v: string) => void
  clientes: ClienteMock[]
  metodosPago: MetodoPagoResponse[]
  metodoPagoId: number
  metodoPagoNombre: string
  onMetodoPagoChange: (v: number) => void
  onConfirmarClick: () => void
  onCancelar: () => void
  isConfirmModalOpen: boolean
  onCloseConfirmModal: () => void
  onConfirmarVenta: () => Promise<void>
  isConfirming: boolean
  isTicketModalOpen: boolean
  onCloseTicketModal: () => void
  onImprimirTicket: () => void
  estadoVenta: EstadoVenta
  isPayPalModalOpen?: boolean
  payPalUrl?: string
  onCerrarPayPal?: () => void
}

export function VentasPageView({
  comandas,
  comandasLoading,
  searchComanda,
  onSearchComandaChange,
  filtroEstado,
  onFiltroEstadoChange,
  estados,
  comandaSeleccionada,
  onSelectComanda,
  productos,
  productosLoading,
  subtotalOriginal,
  descuentoPromociones,
  subtotalConPromociones,
  descuentoManual,
  impuesto,
  propinaTotal,
  total,
  ajustes,
  onDescuentoPorcentualChange,
  onDescuentoFijoChange,
  onPropinaPorcentualChange,
  onPropinaFijaChange,
  onPropinaQuick,
  cliente,
  nitManual,
  onNitManualChange,
  onAsignarCliente,
  onVentaAnonima,
  onAbrirModalCliente,
  isClienteModalOpen,
  onCloseClienteModal,
  busquedaCliente,
  onBusquedaClienteChange,
  clientes: clientesList,
  metodosPago,
  metodoPagoId,
  metodoPagoNombre,
  onMetodoPagoChange,
  onConfirmarClick,
  onCancelar,
  isConfirmModalOpen,
  onCloseConfirmModal,
  onConfirmarVenta,
  isConfirming,
  isTicketModalOpen,
  onCloseTicketModal,
  onImprimirTicket,
  estadoVenta,
  isPayPalModalOpen = false,
  payPalUrl = '',
  onCerrarPayPal,
}: VentasPageViewProps) {
  return (
    <div className="flex h-[calc(100vh-6rem)] animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex w-full gap-6 h-full">
        <div className="w-[400px] shrink-0 h-full overflow-hidden">
          <ComandasList
            comandas={comandas}
            isLoading={comandasLoading}
            search={searchComanda}
            onSearchChange={onSearchComandaChange}
            filtroEstado={filtroEstado}
            onFiltroEstadoChange={onFiltroEstadoChange}
            estados={estados}
            comandaSeleccionada={comandaSeleccionada}
            onSelectComanda={onSelectComanda}
          />
        </div>

        <div className="flex-1 min-w-0 h-full overflow-y-auto pr-2 custom-scrollbar">
          {comandaSeleccionada ? (
            <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-500 pb-6">
              <VentaDetalle
                comanda={comandaSeleccionada}
                productos={productos}
                productosLoading={productosLoading}
              />

              <AjustesVenta
                subtotal={subtotalOriginal}
                descuentoPorcentual={ajustes.descuentoPorcentual}
                descuentoFijo={ajustes.descuentoFijo}
                propinaPorcentual={ajustes.propinaPorcentual}
                propinaFija={ajustes.propinaFija}
                onDescuentoPorcentualChange={onDescuentoPorcentualChange}
                onDescuentoFijoChange={onDescuentoFijoChange}
                onPropinaPorcentualChange={onPropinaPorcentualChange}
                onPropinaFijaChange={onPropinaFijaChange}
                onPropinaQuick={onPropinaQuick}
              />

              <ResumenFinanciero
                subtotalOriginal={subtotalOriginal}
                descuentoPromociones={descuentoPromociones}
                subtotalConPromociones={subtotalConPromociones}
                descuentoManual={descuentoManual}
                impuesto={impuesto}
                propina={propinaTotal}
                total={total}
              />

              <ClienteSection
                cliente={cliente}
                nitManual={nitManual}
                onNitManualChange={onNitManualChange}
                onVentaAnonima={onVentaAnonima}
                onAbrirModalCliente={onAbrirModalCliente}
              />

              <MetodoPago
                metodoPagoId={metodoPagoId}
                onMetodoPagoChange={onMetodoPagoChange}
                metodosPago={metodosPago}
              />

              <AccionesVenta
                onConfirmar={onConfirmarClick}
                onCancelar={onCancelar}
                isConfirming={isConfirming}
              />
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      <ModalConfirmar
        isOpen={isConfirmModalOpen}
        onClose={onCloseConfirmModal}
        onConfirm={onConfirmarVenta}
        isConfirming={isConfirming}
        total={total}
        metodoPagoNombre={metodoPagoNombre}
      />

      <ModalTicket
        isOpen={isTicketModalOpen}
        onClose={onCloseTicketModal}
        onImprimir={onImprimirTicket}
        comanda={comandaSeleccionada}
        productos={productos}
        total={total}
        metodoPagoNombre={metodoPagoNombre}
        estado={estadoVenta}
      />

      <BuscarClienteModal
        isOpen={isClienteModalOpen}
        onClose={onCloseClienteModal}
        busqueda={busquedaCliente}
        onBusquedaChange={onBusquedaClienteChange}
        clientes={clientesList}
        onSeleccionarCliente={onAsignarCliente}
      />

      <PayPalModal
        isOpen={isPayPalModalOpen}
        payPalUrl={payPalUrl}
        onClose={onCerrarPayPal || (() => {})}
      />
    </div>
  )
}
