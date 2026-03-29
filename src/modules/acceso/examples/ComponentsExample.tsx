/**
 * EJEMPLO COMPLETO - Cómo usar los componentes modulares adaptados de SI1-ferreteria
 * 
 * Este archivo demuestra todos los patrones de diseño implementados:
 * 1. Componentes de formulario composables
 * 2. Botones con variantes de colores
 * 3. DataTable modular con acciones
 * 4. Contenedores estilizados
 * 5. System de navegación
 * 6. Layouts composables
 */

import { useState, type ChangeEvent } from 'react'
import {
  // UI Components
  Button,
  Container,
  ContainerSecond,
  FormField,
  FormInput,
  FormTextarea,
  
  // Icons
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  UserIcon,
  
  // DataTable
  TableCell,
  TableRow,
  TableActionCell,
  
  // Navigation
  Dropdown,
  NavLink,
  NavGroup,
  Navigation,
  
} from '@/shared/components/ui'
import {
  LayoutRoot,
  LayoutSidebar,
  LayoutHeader,
  LayoutMain,
  LayoutContent,
  LayoutFooter,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/shared/components/layout'
/**
 * EJEMPLO 1: Formulario con componentes composables
 * Patrón similar a form/field.blade.php en SI1-ferreteria
 */
export const FormExample = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
  })
  const [errors] = useState<Record<string, string>>({})

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Container>
      <ContainerSecond>
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Usuario</h2>

        {/* Campo de nombre - Composable FormField */}
        <FormField
          label="Nombre Completo"
          name="name"
          error={errors.name}
          required
          className="mb-4"
        >
          <FormInput
            name="name"
            type="text"
            placeholder="Ingresa el nombre completo"
            value={formData.name}
            onChange={handleChange}
          />
        </FormField>

        {/* Campo de email */}
        <FormField
          label="Correo Electrónico"
          name="email"
          error={errors.email}
          required
          className="mb-4"
        >
          <FormInput
            name="email"
            type="email"
            placeholder="ejemplo@correo.com"
            value={formData.email}
            onChange={handleChange}
          />
        </FormField>

        {/* Campo de descripción */}
        <FormField
          label="Descripción"
          name="description"
          className="mb-6"
        >
          <FormTextarea
            name="description"
            placeholder="Describe el usuario..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </FormField>

        {/* Botones - Variantes */}
        <div className="flex gap-2">
          <Button variant="warning">Guardar</Button>
          <Button variant="secondary">Cancelar</Button>
        </div>
      </ContainerSecond>
    </Container>
  )
}

/**
 * EJEMPLO 2: DataTable modular con acciones
 * Patrón similar a data-table.blade.php en SI1-ferreteria
 */
export const DataTableExample = () => {
  const users = [
    { id: 1, name: 'Juan Pérez', email: 'juan@ejemplo.com', role: 'Admin' },
    { id: 2, name: 'María García', email: 'maria@ejemplo.com', role: 'User' },
    { id: 3, name: 'Carlos López', email: 'carlos@ejemplo.com', role: 'Editor' },
  ]

  return (
    <Container>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Usuarios</h2>
        <Button variant="warning" icon={<PlusIcon className="w-4 h-4" />}>
          Nuevo Usuario
        </Button>
      </div>

      <ContainerSecond>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <TableRow header>
                <TableCell header>Nombre</TableCell>
                <TableCell header>Email</TableCell>
                <TableCell header>Rol</TableCell>
                <TableCell header>Acciones</TableCell>
              </TableRow>
            </thead>
            <tbody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableActionCell
                    onEdit={() => console.log('Edit:', user.id)}
                    onDelete={() => console.log('Delete:', user.id)}
                  />
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </ContainerSecond>
    </Container>
  )
}

/**
 * EJEMPLO 3: Navegación con Dropdown
 * Patrón similar a dropdown.blade.php en SI1-ferreteria
 */
export const NavigationExample = () => {
  return (
    <Navigation>
      <NavGroup label="Configuración">
        <NavLink icon={<UserIcon className="w-4 h-4" />} active>
          Perfil
        </NavLink>
      </NavGroup>

      <NavGroup label="Datos">
        <NavLink icon={<SearchIcon className="w-4 h-4" />}>
          Búsqueda
        </NavLink>
      </NavGroup>

      {/* Dropdown anidado */}
      <Dropdown>
        <Dropdown.Trigger>Más opciones</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onClick={() => console.log('Action 1')}>
            Opción 1
          </Dropdown.Item>
          <Dropdown.Item onClick={() => console.log('Action 2')}>
            Opción 2
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => console.log('Logout')}>
            Salir
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </Navigation>
  )
}

/**
 * EJEMPLO 4: Layout composable completo
 * Patrón similar a app.blade.php + layouts/navigation.blade.php
 */
export const LayoutExample = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <LayoutRoot>
      {/* Sidebar */}
      <LayoutSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <SidebarHeader onClose={() => setSidebarOpen(false)}>
          <div className="text-orange-600 font-bold text-lg">FERRETERIA</div>
        </SidebarHeader>

        <SidebarContent>
          <NavLink active icon={<UserIcon className="w-4 h-4" />}>
            Dashboard
          </NavLink>
          <NavLink icon={<UserIcon className="w-4 h-4" />}>
            Usuarios
          </NavLink>
        </SidebarContent>

        <SidebarFooter>
          <div className="text-sm text-gray-400">© 2026</div>
        </SidebarFooter>
      </LayoutSidebar>

      {/* Main content */}
      <LayoutMain hasSidebar={true}>
        {/* Header */}
        <LayoutHeader>
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ≡ Menú
          </button>
          <div className="ml-auto">
            <Button variant="ghost" size="sm">
              Perfil
            </Button>
          </div>
        </LayoutHeader>

        {/* Content */}
        <LayoutContent>
          <h1 className="text-3xl font-bold mb-6">Bienvenido al Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ContainerSecond>
              <h3 className="font-bold mb-2">Estadísticas</h3>
              <p className="text-gray-400">Datos importantes aquí</p>
            </ContainerSecond>

            <ContainerSecond>
              <h3 className="font-bold mb-2">Actividad</h3>
              <p className="text-gray-400">Registros recientes aquí</p>
            </ContainerSecond>
          </div>
        </LayoutContent>

        {/* Footer */}
        <LayoutFooter>
          <p className="text-sm text-gray-400">© 2026. Todos los derechos reservados.</p>
        </LayoutFooter>
      </LayoutMain>
    </LayoutRoot>
  )
}

/**
 * EJEMPLO 5: Sistema de botones con todas las variantes
 */
export const ButtonsExample = () => {
  return (
    <Container>
      <ContainerSecond>
        <h2 className="text-xl font-bold mb-6">Variantes de Botones</h2>

        <div className="space-y-4">
          {/* Primary */}
          <div className="flex gap-3">
            <Button variant="primary" icon={<PlusIcon className="w-4 h-4" />}>
              Crear
            </Button>
            <Button variant="primary" size="sm">
              Pequeño
            </Button>
            <Button variant="primary" size="lg">
              Grande
            </Button>
          </div>

          {/* Warning/Orange (SI1-ferreteria) */}
          <div className="flex gap-3">
            <Button variant="warning" icon={<EditIcon className="w-4 h-4" />}>
              Editar
            </Button>
          </div>

          {/* Danger/Red */}
          <div className="flex gap-3">
            <Button variant="danger" icon={<TrashIcon className="w-4 h-4" />}>
              Eliminar
            </Button>
          </div>

          {/* Success/Green */}
          <div className="flex gap-3">
            <Button variant="success">Confirmar</Button>
          </div>

          {/* Secondary */}
          <div className="flex gap-3">
            <Button variant="secondary">Cancelar</Button>
          </div>

          {/* Ghost */}
          <div className="flex gap-3">
            <Button variant="ghost">Opciones</Button>
          </div>
        </div>
      </ContainerSecond>
    </Container>
  )
}

export default {
  FormExample,
  DataTableExample,
  NavigationExample,
  LayoutExample,
  ButtonsExample,
}
