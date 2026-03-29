import React from 'react'
import { DataTable, Button, Modal, Input } from '@/shared/components/ui'
import { useTableManager, TableColumn } from '@/shared/hooks'

interface ExampleUser {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
}

const mockUsers: ExampleUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'active',
    createdAt: '2024-01-16'
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'Editor',
    status: 'inactive',
    createdAt: '2024-01-17'
  }
]

export const DataTableExample: React.FC = () => {
  const tableManager = useTableManager<ExampleUser>(mockUsers, {
    initialPageSize: 5,
    searchable: true,
    sortable: true
  })

  const columns: TableColumn<ExampleUser>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      width: '200px'
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true
    },
    {
      key: 'role',
      title: 'Role',
      sortable: true,
      width: '120px'
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      width: '100px',
      render: (_, value) => (
        <span 
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value}
        </span>
      )
    },
    {
      key: 'createdAt',
      title: 'Created',
      sortable: true,
      width: '120px',
      render: (_, value) => new Date(value).toLocaleDateString()
    }
  ]

  const handleEdit = (user: ExampleUser) => {
    tableManager.handleEdit(user)
    console.info('Editing user:', user.name)
  }

  const handleDelete = async (user: ExampleUser) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      await tableManager.handleDelete(user)
    }
  }

  const handleSave = async (userData: Partial<ExampleUser>) => {
    await tableManager.handleSave(userData)
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">DataTable Example</h2>
        <Button onClick={tableManager.handleCreate}>
          Add User
        </Button>
      </div>

      <DataTable
        data={tableManager.data}
        columns={columns}
        loading={tableManager.loading}
        searchable={true}
        search={tableManager.search}
        onSearchChange={tableManager.setSearch}
        sortBy={tableManager.sortBy}
        sortDirection={tableManager.sortDirection}
        onSort={tableManager.handleSort}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No users found"
      />

      {/* User Form Modal */}
      <Modal.Root 
        isOpen={tableManager.showModal} 
        onClose={() => tableManager.setShowModal(false)}
        size="md"
      >
        <Modal.Header>
          {tableManager.editingItem ? 'Edit User' : 'Create User'}
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const userData = {
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                role: formData.get('role') as string,
                status: formData.get('status') as 'active' | 'inactive'
              }
              handleSave(userData)
            }}
          >
            <div className="space-y-4">
              <Input
                name="name"
                placeholder="Enter name"
                defaultValue={tableManager.editingItem?.name || ''}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Enter email"
                defaultValue={tableManager.editingItem?.email || ''}
                required
              />
              <select 
                name="role" 
                className="w-full p-2 border rounded"
                defaultValue={tableManager.editingItem?.role || 'User'}
              >
                <option value="User">User</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </select>
              <select 
                name="status" 
                className="w-full p-2 border rounded"
                defaultValue={tableManager.editingItem?.status || 'active'}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <Modal.Footer>
              <Button 
                variant="secondary" 
                onClick={() => tableManager.setShowModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {tableManager.editingItem ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal.Root>
    </div>
  )
}