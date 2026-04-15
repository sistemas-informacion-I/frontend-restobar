import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { User, CreateUserData, UpdateUserData, usersService, getErrorMessage } from '../../services/api'
import { UsersPageView } from './UsersPage.view'

export function UsersPage() {
  const { canCreate, canUpdate, canDelete, user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const usersData = await usersService.getAll()
      setUsers(usersData)
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'cargar la lista de usuarios'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (data: CreateUserData | UpdateUserData) => {
    setIsSubmitting(true)
    try {
      await usersService.create(data as CreateUserData)
      setFeedbackType('success')
      setFeedbackMessage('Usuario creado exitosamente')
      setShowCreateModal(false)
      loadData()
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'crear el usuario'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (data: CreateUserData | UpdateUserData) => {
    if (!selectedUser) return
    setIsSubmitting(true)
    try {
      await usersService.update(selectedUser.id, data as UpdateUserData)
      setFeedbackType('success')
      setFeedbackMessage('Usuario actualizado exitosamente')
      setShowEditModal(false)
      setSelectedUser(null)
      loadData()
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'actualizar el usuario'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    setIsSubmitting(true)
    try {
      await usersService.delete(selectedUser.id)
      setFeedbackType('success')
      setFeedbackMessage('Usuario eliminado exitosamente')
      setShowDeleteModal(false)
      setSelectedUser(null)
      loadData()
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'eliminar el usuario'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.ci || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.roles?.some((r: any) => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const openCreate = () => {
    setShowCreateModal(true)
  }

  const openView = (user: User) => {
    setSelectedUser(user)
    setShowViewModal(true)
  }

  const openEdit = (user: User) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const openDelete = (user: User) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowViewModal(false)
    setShowDeleteModal(false)
    setSelectedUser(null)
  }

  return UsersPageView({
    canCreate,
    canUpdate,
    canDelete,
    currentUser,
    isLoading,
    searchTerm,
    setSearchTerm,
    feedbackMessage,
    feedbackType,
    showCreateModal,
    showEditModal,
    showViewModal,
    showDeleteModal,
    selectedUser,
    isSubmitting,
    handleCreate,
    handleEdit,
    handleDelete,
    filteredUsers,
    openCreate,
    openView,
    openEdit,
    openDelete,
    closeModals
  })
}
