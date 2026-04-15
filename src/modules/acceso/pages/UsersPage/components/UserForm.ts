import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { User, CreateUserData, UpdateUserData, Role } from '../../../models'
import { useRoles } from '../../../hooks/useRoles'
import { UserFormView } from './UserForm.view'

export interface UserFormProps {
  user?: User
  onSubmit: (data: CreateUserData | UpdateUserData) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

interface UserFormData {
  ci: string
  nombre: string
  apellido: string
  username?: string
  password?: string
  telefono?: string
  sexo?: 'M' | 'F' | 'O'
  correo?: string
  direccion?: string
  activo?: boolean
  estadoAcceso?: string
}

export function UserForm({ user, onSubmit, onCancel, isLoading }: UserFormProps) {
  const isEdit = !!user
  const { roles: allRoles, isLoading: rolesLoading } = useRoles()
  const [availableRoles, setAvailableRoles] = useState<Role[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(
    user?.roles?.map(r => Number(r.id)) ?? []
  )

  useEffect(() => {
    if (allRoles) {
      setAvailableRoles(allRoles.filter(r => r.isActive))
    }
  }, [allRoles])

  const filteredRoles = availableRoles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: user ? {
      ci: user.ci,
      nombre: user.firstName,
      apellido: user.lastName,
      correo: user.email,
      telefono: user.phone,
      sexo: user.gender,
      direccion: user.address,
      activo: user.isActive,
      estadoAcceso: user.estadoAcceso,
    } : {
      activo: true,
      sexo: 'O',
      estadoAcceso: 'HABILITADO',
    },
  })

  const toggleRole = (id: number) => {
    setSelectedRoleIds(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  const onFormSubmit = async (data: UserFormData) => {
    await onSubmit({
      ...data,
      roles: selectedRoleIds,
    } as CreateUserData | UpdateUserData)
  }

  return UserFormView({
    register,
    handleSubmit,
    errors,
    onFormSubmit,
    isEdit,
    isLoading,
    onCancel,
    availableRoles,
    rolesLoading,
    searchTerm,
    setSearchTerm,
    filteredRoles,
    selectedRoleIds,
    toggleRole
  })
}
