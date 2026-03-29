# Auth Frontend

Frontend de autenticación moderno construido con React, TypeScript y Vite.

## Características

- 🔐 **Autenticación completa**: Login, Registro, Activación de cuenta
- 🎨 **Diseño minimalista**: Tema oscuro con acentos púrpura
- ✅ **Validaciones robustas**: Validación en tiempo real con React Hook Form
- 🔒 **Rutas protegidas**: Componente ProtectedRoute para rutas privadas
- 🍞 **Notificaciones**: Toast notifications elegantes
- 📱 **Responsive**: Diseño adaptable a todos los dispositivos
- ⚡ **Rápido**: Construido con Vite para desarrollo ultrarrápido

## Requisitos

- Node.js 18+
- npm o yarn

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Build para producción
npm run build
```

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes UI (Button, Input, Card, etc.)
│   └── ProtectedRoute.tsx
├── context/            # Contextos de React
│   └── AuthContext.tsx
├── pages/              # Páginas de la aplicación
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   └── ActivatePage.tsx
├── services/           # Servicios y API
│   └── api.ts
├── styles/             # Estilos globales
│   └── index.css
├── App.tsx             # Componente principal
└── main.tsx            # Entry point
```

## Tecnologías

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **React Router** - Navegación
- **React Hook Form** - Formularios
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **React Hot Toast** - Notificaciones
