import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { User, CreateUserData, UpdateUserData } from '../../models'
import { useUsers } from '../../hooks/useUsers'
import { getErrorMessage } from '../../services/api'
import { UsersPageView } from './UsersPage.view'

export function UsersPage() {
  const { canCreate, canUpdate, canDelete, user: currentUser } = useAuth()
  const { 
    users, 
    isLoading, 
    isSubmitting, 
    createUser, 
    updateUser, 
    deleteUser,
    loadError 
  } = useUsers()

  const [searchTerm, setSearchTerm] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')

  const clearFeedback = () => {
    setFeedbackMessage('')
    setFeedbackType('')
  }
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleCreate = async (data: CreateUserData | UpdateUserData) => {
    try {
      await createUser(data as CreateUserData)
      setFeedbackType('success')
      setFeedbackMessage('Usuario creado exitosamente')
      setShowCreateModal(false)
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'crear el usuario'))
    }
  }

  const handleEdit = async (data: CreateUserData | UpdateUserData) => {
    if (!selectedUser) return
    try {
      await updateUser({ id: selectedUser.id, data: data as UpdateUserData })
      setFeedbackType('success')
      setFeedbackMessage('Usuario actualizado exitosamente')
      setShowEditModal(false)
      setSelectedUser(null)
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'actualizar el usuario'))
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    try {
      await deleteUser(selectedUser.id)
      setFeedbackType('success')
      setFeedbackMessage('Usuario eliminado exitosamente')
      setShowDeleteModal(false)
      setSelectedUser(null)
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'eliminar el usuario'))
    }
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.ci || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.roles?.some((r: any) => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const openCreate = () => {
    clearFeedback()
    setShowCreateModal(true)
  }
  const openView = (user: User) => {
    clearFeedback()
    setSelectedUser(user)
    setShowViewModal(true)
  }
  const openEdit = (user: User) => {
    clearFeedback()
    setSelectedUser(user)
    setShowEditModal(true)
  }
  const openDelete = (user: User) => {
    clearFeedback()
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowViewModal(false)
    setShowDeleteModal(false)
    setSelectedUser(null)
    clearFeedback()
  }

  return UsersPageView({
    canCreate,
    canUpdate,
    canDelete,
    currentUser,
    isLoading,
    searchTerm,
    setSearchTerm,
    feedbackMessage: feedbackMessage || (loadError ? getErrorMessage(loadError) : ''),
    feedbackType: feedbackType || (loadError ? 'error' : ''),
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

