import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { User, CreateUserData, UpdateUserData } from '../models/user.model'
import { usersService } from '../services/users.service'

export const useUsers = () => {
  // Query for fetching all users
  const { 
    data: users = [], 
    error: loadError, 
    isLoading, 
    mutate 
  } = useSWR<User[]>('/users', () => usersService.getAll())

  // Mutation for creating a user
  const { trigger: createUser, isMutating: isCreating } = useSWRMutation(
    '/users',
    async (_, { arg }: { arg: CreateUserData }) => {
      return usersService.create(arg)
    },
    {
      onSuccess: () => mutate() // Revalidate user list
    }
  )

  // Mutation for updating a user
  const { trigger: updateUser, isMutating: isUpdating } = useSWRMutation(
    '/users/update',
    async (_, { arg }: { arg: { id: string, data: UpdateUserData } }) => {
      return usersService.update(arg.id, arg.data)
    },
    {
      onSuccess: () => mutate() // Revalidate user list
    }
  )

  // Mutation for deleting a user
  const { trigger: deleteUser, isMutating: isDeleting } = useSWRMutation(
    '/users/delete',
    async (_, { arg }: { arg: string }) => {
      return usersService.delete(arg)
    },
    {
      onSuccess: () => mutate() // Revalidate user list
    }
  )

  return {
    users,
    isLoading,
    loadError,
    isCreating,
    isUpdating,
    isDeleting,
    isSubmitting: isCreating || isUpdating || isDeleting,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers: mutate
  }
}
