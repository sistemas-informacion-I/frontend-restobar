import { useState } from 'react'
import { Role, CreateRoleData, UpdateRoleData } from '../../models'
import { useRoles } from '../../hooks/useRoles'
import { usePermissions } from '../../hooks/usePermissions'
import { getErrorMessage } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { RolesPageView } from './RolesPage.view'

export function RolesPage() {
  const { canCreate, canRead, canUpdate, canDelete } = useAuth()
  const { 
    roles, 
    isLoading: rolesLoading, 
    isSubmitting, 
    createRole, 
    updateRole, 
    deleteRole,
    loadError: rolesError 
  } = useRoles()
  
  const { 
    permissions, 
    isLoading: permissionsLoading,
    loadError: permissionsError
  } = usePermissions()

  const [search, setSearch] = useState('')
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
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const isLoading = rolesLoading || permissionsLoading
  const loadError = rolesError || permissionsError

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(search.toLowerCase()))
  )

  // Handlers
  const handleCreate = async (data: CreateRoleData | UpdateRoleData) => {
    try {
      await createRole(data as CreateRoleData)
      setFeedbackType('success')
      setFeedbackMessage('Rol creado exitosamente')
      setShowCreateModal(false)
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'crear el rol'))
    }
  }

  const handleCloseModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowViewModal(false)
    setShowDeleteModal(false)
    setSelectedRole(null)
    clearFeedback()
  }

  const handleUpdate = async (data: CreateRoleData | UpdateRoleData) => {
    if (!selectedRole) return
    try {
      await updateRole({ id: selectedRole.id, data: data as UpdateRoleData })
      setFeedbackType('success')
      setFeedbackMessage('Rol actualizado exitosamente')
      setShowEditModal(false)
      setSelectedRole(null)
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'actualizar el rol'))
    }
  }

  const handleDelete = async () => {
    if (!selectedRole) return
    try {
      await deleteRole(selectedRole.id)
      setFeedbackType('success')
      setFeedbackMessage('Rol eliminado exitosamente')
      setShowDeleteModal(false)
      setSelectedRole(null)
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'eliminar el rol'))
    }
  }

  const openView = (role: Role) => {
    clearFeedback()
    setSelectedRole(role)
    setShowViewModal(true)
  }

  const openEdit = (role: Role) => {
    clearFeedback()
    setSelectedRole(role)
    setShowEditModal(true)
  }

  const openDelete = (role: Role) => {
    clearFeedback()
    setSelectedRole(role)
    setShowDeleteModal(true)
  }

  // Permission checks
  const canViewRoles = canRead('roles')
  const canCreateRoles = canCreate('roles')
  const canUpdateRoles = canUpdate('roles')
  const canDeleteRoles = canDelete('roles')

  return RolesPageView({
    canViewRoles,
    canCreateRoles,
    canUpdateRoles,
    canDeleteRoles,
    loading: isLoading,
    search,
    setSearch,
    feedbackMessage: feedbackMessage || (loadError ? getErrorMessage(loadError) : ''),
    feedbackType: feedbackType || (loadError ? 'error' : ''),
    showCreateModal,
    setShowCreateModal: (val: boolean) => {
      if (!val) handleCloseModals()
      else {
        clearFeedback()
        setShowCreateModal(true)
      }
    },
    showEditModal,
    setShowEditModal: (val: boolean) => {
      if (!val) handleCloseModals()
      else setShowEditModal(true)
    },
    showViewModal,
    setShowViewModal: (val: boolean) => {
      if (!val) handleCloseModals()
      else setShowViewModal(true)
    },
    showDeleteModal,
    setShowDeleteModal: (val: boolean) => {
      if (!val) handleCloseModals()
      else setShowDeleteModal(true)
    },
    selectedRole,
    setSelectedRole,
    isSubmitting,
    permissions,
    handleCreate,
    handleUpdate,
    handleDelete,
    filteredRoles,
    openView,
    openEdit,
    openDelete
  })
}

