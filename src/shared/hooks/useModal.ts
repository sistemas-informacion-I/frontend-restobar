import { useState, useCallback } from 'react'

export interface UseModalReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  openWithData: <T>(data: T) => void
  data: any
}

export const useModal = (initialState = false): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(initialState)
  const [data, setData] = useState<any>(null)

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setData(null)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const openWithData = useCallback(<T,>(modalData: T) => {
    setData(modalData)
    setIsOpen(true)
  }, [])

  return {
    isOpen,
    open,
    close,
    toggle,
    openWithData,
    data
  }
}

export default useModal