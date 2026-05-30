import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { useVentaPresencial } from '../../hooks/useVentaPresencial'
import { VentaPresencialService } from '../../services/ventaPresencial.service'
import { getErrorMessage, httpClient } from '@/core/api'
import { VentasPageView } from './VentasPage.view'
import type {
  Comanda,
  ProductoVenta,
  ClienteMock,
  ClienteVenta,
  AjustesVenta,
  MetodoPagoResponse,
  EstadoVenta,
  VentaPresencialConfirmResponse,
} from '../../models/ventaPresencial.model'

const IVA_RATE = 0.18

export default function VentasPage() {
  const {
    comandas,
    comandasLoading,
    isConfirming,
    confirmarVenta,
    refetchComandas,
  } = useVentaPresencial()

  const [searchComanda, setSearchComanda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('')
  const [comandaSeleccionada, setComandaSeleccionada] = useState<Comanda | null>(null)
  const [productosComanda, setProductosComanda] = useState<ProductoVenta[]>([])

  const [cliente, setCliente] = useState<ClienteVenta>({ nombre: 'Anónimo', esAnonimo: true })
  const [nitManual, setNitManual] = useState('')

  const [descuentoPorcentual, setDescuentoPorcentual] = useState(0)
  const [descuentoFijo, setDescuentoFijo] = useState(0)
  const [propinaPorcentual, setPropinaPorcentual] = useState(0)
  const [propinaFija, setPropinaFija] = useState(0)

  const [metodosPago, setMetodosPago] = useState<MetodoPagoResponse[]>([])
  const [metodoPagoId, setMetodoPagoId] = useState<number>(0)

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [estadoVenta, setEstadoVenta] = useState<EstadoVenta>('PAGADA')
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false)
  const [clientes, setClientes] = useState<ClienteMock[]>([])
  const [busquedaCliente, setBusquedaCliente] = useState('')
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false)
  const [payPalUrl, setPayPalUrl] = useState('')

  const payPalPopupRef = useRef<Window | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    VentaPresencialService.getMetodosPago()
      .then((lista) => {
        const presenciales = lista.filter((m) => m.activo)
        setMetodosPago(presenciales)
        if (presenciales.length > 0) setMetodoPagoId(presenciales[0].idMetodoPago)
      })
      .catch(() => toast.error('Error al cargar métodos de pago'))
  }, [])

  const metodoPagoNombre = useMemo(() => {
    const m = metodosPago.find((mp) => mp.idMetodoPago === metodoPagoId)
    return m?.nombre ?? ''
  }, [metodosPago, metodoPagoId])

  const subtotal = useMemo(() => {
    return productosComanda.reduce((sum, p) => sum + p.subtotal, 0)
  }, [productosComanda])

  const descuentoTotal = useMemo(() => {
    const dPorcentual = subtotal * (descuentoPorcentual / 100)
    return Math.min(dPorcentual + descuentoFijo, subtotal)
  }, [subtotal, descuentoPorcentual, descuentoFijo])

  const baseImponible = subtotal - descuentoTotal
  const impuesto = baseImponible * IVA_RATE
  const propinaTotal = propinaFija + subtotal * (propinaPorcentual / 100)
  const total = baseImponible + impuesto + propinaTotal

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  const startPollingPayPal = useCallback((idNotaVenta: number) => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const data = await httpClient.get<{ estado: string }>(`/api/notas-venta/${idNotaVenta}`)
        if (data.estado === 'PAGADA') {
          if (pollRef.current) clearInterval(pollRef.current)
          if (payPalPopupRef.current && !payPalPopupRef.current.closed) {
            payPalPopupRef.current.close()
          }
          setIsPayPalModalOpen(false)
          setEstadoVenta('PAGADA')
          setIsTicketModalOpen(true)
          toast.success('Pago PayPal completado exitosamente')
          refetchComandas()
        }
      } catch {
        // continue polling
      }
    }, 3000)
  }, [refetchComandas])

  const handleSelectComanda = useCallback(async (comanda: Comanda) => {
    setComandaSeleccionada(comanda)
    setDescuentoPorcentual(0)
    setDescuentoFijo(0)
    setPropinaPorcentual(0)
    setPropinaFija(0)
    setCliente({ nombre: comanda.cliente, esAnonimo: false })
    setNitManual('')
    const activos = metodosPago.filter((m) => m.activo)
    if (activos.length > 0) setMetodoPagoId(activos[0].idMetodoPago)
    try {
      const prods = await VentaPresencialService.getProductosByComanda(comanda.idComanda)
      setProductosComanda(prods)
    } catch {
      toast.error('Error al cargar productos de la comanda')
    }
  }, [metodosPago])

  const handleDescuentoPorcentual = useCallback((value: number) => {
    const clamped = Math.max(0, Math.min(value, 100))
    setDescuentoPorcentual(clamped)
  }, [])

  const handleDescuentoFijo = useCallback((value: number) => {
    setDescuentoFijo(Math.max(0, value))
  }, [])

  const handlePropinaPorcentual = useCallback((value: number) => {
    setPropinaPorcentual(Math.max(0, value))
  }, [])

  const handlePropinaFija = useCallback((value: number) => {
    setPropinaFija(Math.max(0, value))
  }, [])

  const handlePropinaQuick = useCallback((porcentaje: number) => {
    setPropinaPorcentual(porcentaje)
    setPropinaFija(0)
  }, [])

  const handleAsignarCliente = useCallback((c: ClienteMock) => {
    setCliente({ idCliente: c.idCliente, nombre: c.nombre, nit: c.nit, esAnonimo: false })
    setNitManual(c.nit || '')
    setIsClienteModalOpen(false)
  }, [])

  const handleVentaAnonima = useCallback(() => {
    setCliente({ nombre: 'Anónimo', esAnonimo: true })
    setNitManual('')
  }, [])

  const handleBuscarClientes = useCallback(async (termino: string) => {
    setBusquedaCliente(termino)
    if (termino.length < 2) {
      setClientes([])
      return
    }
    try {
      const result = await VentaPresencialService.buscarClientes(termino)
      setClientes(result)
    } catch {
      setClientes([])
    }
  }, [])

  const abrirModalCliente = useCallback(async () => {
    setIsClienteModalOpen(true)
    setBusquedaCliente('')
    setClientes([])
    try {
      const todos = await VentaPresencialService.obtenerTodosClientes()
      setClientes(todos)
    } catch {
      setClientes([])
    }
  }, [])

  const handleConfirmarClick = useCallback(() => {
    if (!comandaSeleccionada) return
    if (descuentoFijo > subtotal) {
      toast.error('El descuento fijo no puede superar el subtotal')
      return
    }
    setIsConfirmModalOpen(true)
  }, [comandaSeleccionada, descuentoFijo, subtotal])

  const handleConfirmarVenta = useCallback(async () => {
    if (!comandaSeleccionada) return
    try {
      const payload = {
        idComanda: comandaSeleccionada.idComanda,
        idCliente: cliente.idCliente,
        nombreCliente: cliente.nombre,
        nit: nitManual || undefined,
        descuentoPorcentual,
        descuentoFijo,
        propinaPorcentual,
        propinaFija,
        idMetodoPago: metodoPagoId,
      }
      const result = await confirmarVenta(payload) as unknown as VentaPresencialConfirmResponse
      setIsConfirmModalOpen(false)

      if (result.paypalApprovalUrl) {
        setPayPalUrl(result.paypalApprovalUrl)
        setEstadoVenta('PENDIENTE_PAYPAL')
        setIsPayPalModalOpen(true)
        const popup = window.open(result.paypalApprovalUrl, 'paypal_popup', 'width=800,height=600')
        payPalPopupRef.current = popup
        startPollingPayPal(result.idNotaVenta)
      } else {
        setEstadoVenta('PAGADA')
        setIsTicketModalOpen(true)
        toast.success('Venta confirmada exitosamente')
        refetchComandas()
      }
    } catch (error: any) {
      const msg = getErrorMessage(error, 'confirmar venta')
      toast.error(msg)
      setIsConfirmModalOpen(false)
    }
  }, [
    comandaSeleccionada,
    cliente,
    nitManual,
    descuentoPorcentual,
    descuentoFijo,
    propinaPorcentual,
    propinaFija,
    metodoPagoId,
    confirmarVenta,
    refetchComandas,
    startPollingPayPal,
  ])

  const handleCancelar = useCallback(() => {
    setComandaSeleccionada(null)
    setProductosComanda([])
    setDescuentoPorcentual(0)
    setDescuentoFijo(0)
    setPropinaPorcentual(0)
    setPropinaFija(0)
    setCliente({ nombre: 'Anónimo', esAnonimo: true })
    setNitManual('')
    const activos = metodosPago.filter((m) => m.activo)
    if (activos.length > 0) setMetodoPagoId(activos[0].idMetodoPago)
  }, [metodosPago])

  const handleImprimirTicket = useCallback(() => {
    toast.success('Ticket enviado a impresión')
  }, [])

  const handleCerrarPayPalModal = useCallback(() => {
    setIsPayPalModalOpen(false)
    if (pollRef.current) clearInterval(pollRef.current)
    if (payPalPopupRef.current && !payPalPopupRef.current.closed) {
      payPalPopupRef.current.close()
    }
    refetchComandas()
    handleCancelar()
  }, [handleCancelar, refetchComandas])

  const filteredComandas = useMemo(() => {
    let result = comandas
    if (searchComanda) {
      const q = searchComanda.toLowerCase()
      result = result.filter(
        (c) =>
          c.numeroComanda.toLowerCase().includes(q) ||
          c.mesa.toLowerCase().includes(q) ||
          c.cliente.toLowerCase().includes(q)
      )
    }
    if (filtroEstado) {
      result = result.filter((c) => c.estado === filtroEstado)
    }
    return result
  }, [comandas, searchComanda, filtroEstado])

  const estados = useMemo(() => {
    const set = new Set(comandas.map((c) => c.estado))
    return Array.from(set)
  }, [comandas])

  const ajustes: AjustesVenta = {
    descuentoPorcentual,
    descuentoFijo,
    propinaPorcentual,
    propinaFija,
  }

  return (
    <VentasPageView
      comandas={filteredComandas}
      comandasLoading={comandasLoading}
      searchComanda={searchComanda}
      onSearchComandaChange={setSearchComanda}
      filtroEstado={filtroEstado}
      onFiltroEstadoChange={setFiltroEstado}
      estados={estados}
      comandaSeleccionada={comandaSeleccionada}
      onSelectComanda={handleSelectComanda}
      productos={productosComanda}
      productosLoading={false}
      subtotal={subtotal}
      descuentoTotal={descuentoTotal}
      impuesto={impuesto}
      propinaTotal={propinaTotal}
      total={total}
      ajustes={ajustes}
      onDescuentoPorcentualChange={handleDescuentoPorcentual}
      onDescuentoFijoChange={handleDescuentoFijo}
      onPropinaPorcentualChange={handlePropinaPorcentual}
      onPropinaFijaChange={handlePropinaFija}
      onPropinaQuick={handlePropinaQuick}
      cliente={cliente}
      nitManual={nitManual}
      onNitManualChange={setNitManual}
      onAsignarCliente={handleAsignarCliente}
      onVentaAnonima={handleVentaAnonima}
      onAbrirModalCliente={abrirModalCliente}
      isClienteModalOpen={isClienteModalOpen}
      onCloseClienteModal={() => setIsClienteModalOpen(false)}
      busquedaCliente={busquedaCliente}
      onBusquedaClienteChange={handleBuscarClientes}
      clientes={clientes}
      metodosPago={metodosPago}
      metodoPagoId={metodoPagoId}
      metodoPagoNombre={metodoPagoNombre}
      onMetodoPagoChange={setMetodoPagoId}
      onConfirmarClick={handleConfirmarClick}
      onCancelar={handleCancelar}
      isConfirmModalOpen={isConfirmModalOpen}
      onCloseConfirmModal={() => setIsConfirmModalOpen(false)}
      onConfirmarVenta={handleConfirmarVenta}
      isConfirming={isConfirming}
      isTicketModalOpen={isTicketModalOpen}
      onCloseTicketModal={() => setIsTicketModalOpen(false)}
      onImprimirTicket={handleImprimirTicket}
      estadoVenta={estadoVenta}
      isPayPalModalOpen={isPayPalModalOpen}
      payPalUrl={payPalUrl}
      onCerrarPayPal={handleCerrarPayPalModal}
    />
  )
}
