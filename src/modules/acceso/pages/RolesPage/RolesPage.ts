import { useState, useEffect, useCallback } from 'react'
import { rolesService, permissionsService, Role, Permission, CreateRoleData, UpdateRoleData, getErrorMessage } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { RolesPageView } from './RolesPage.view'

export function RolesPage() {
  const { canCreate, canRead, canUpdate, canDelete } = useAuth()
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [rolesData, permissionsData] = await Promise.all([
        rolesService.getAll(),
        permissionsService.getAll(),
      ])
      setRoles(rolesData)
      setPermissions(permissionsData)
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'cargar roles y permisos'))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(search.toLowerCase()))
  )

  // Handlers
  const handleCreate = async (data: CreateRoleData | UpdateRoleData) => {
    try {
      setIsSubmitting(true)
      await rolesService.create(data as CreateRoleData)
      setFeedbackType('success')
      setFeedbackMessage('Rol creado exitosamente')
      setShowCreateModal(false)
      loadData()
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'crear el rol'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (data: CreateRoleData | UpdateRoleData) => {
    if (!selectedRole) return
    try {
      setIsSubmitting(true)
      await rolesService.update(selectedRole.id, data as UpdateRoleData)
      setFeedbackType('success')
      setFeedbackMessage('Rol actualizado exitosamente')
      setShowEditModal(false)
      setSelectedRole(null)
      loadData()
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'actualizar el rol'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedRole) return
    try {
      setIsSubmitting(true)
      await rolesService.delete(selectedRole.id)
      setFeedbackType('success')
      setFeedbackMessage('Rol eliminado exitosamente')
      setShowDeleteModal(false)
      setSelectedRole(null)
      loadData()
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'eliminar el rol'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const openView = (role: Role) => {
    setSelectedRole(role)
    setShowViewModal(true)
  }

  const openEdit = (role: Role) => {
    setSelectedRole(role)
    setShowEditModal(true)
  }

  const openDelete = (role: Role) => {
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
    loading,
    search,
    setSearch,
    feedbackMessage,
    feedbackType,
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    showViewModal,
    setShowViewModal,
    showDeleteModal,
    setShowDeleteModal,
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
