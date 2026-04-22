import { useState } from 'react';
import { usePerfilPersonal } from '../../hooks/usePerfilPersonal';
import { PerfilInfoCard } from './components/PerfilInfoCard';
import { PerfilPasswordCard } from './components/PerfilPasswordCard';
import { PerfilDeleteBanner } from './components/PerfilDeleteBanner';
import { PerfilEditModal } from './components/PerfilEditModal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/shared/components/layout/Layout';

export default function PerfilPersonalPage() {
  const { perfil, isLoading, error, actualizarPerfil, cambiarPassword, eliminarPerfil } = usePerfilPersonal();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading) return <div className="p-8 text-center text-gray-400">Cargando perfil...</div>;
  if (error || !perfil) return <div className="p-8 text-center text-red-500 flex flex-col items-center justify-center min-h-[50vh]"><p className="text-2xl font-bold">Error al cargar el perfil.</p><p className="text-sm mt-2">{error?.message || 'Error desconocido'}</p></div>;

  const handleEditSave = async (data: any) => {
    try {
      await actualizarPerfil(data);
      setIsEditModalOpen(false);
      alert('Perfil actualizado con éxito');
    } catch (e: any) {
      alert(e.message || 'Error al actualizar');
    }
  };

  const handlePasswordSave = async (data: any) => {
    try {
      await cambiarPassword(data);
      alert('Contraseña actualizada con éxito');
    } catch (e: any) {
      alert(e.message || 'Error al cambiar contraseña');
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible y cerrarás la sesión actual.")) {
      try {
        await eliminarPerfil();
        logout();
        navigate('/login');
      } catch (e: any) {
        alert(e.message || 'Error al eliminar');
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Mi Perfil Personal
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm uppercase tracking-wider font-bold">Visualiza y gestiona tu información personal y parámetros de seguridad.</p>
        </div>

        <div className="flex flex-col gap-8">
          <PerfilInfoCard perfil={perfil} onEditOpen={() => setIsEditModalOpen(true)} />
          
          <PerfilPasswordCard onSubmit={handlePasswordSave} />

          <PerfilDeleteBanner onDelete={handleDelete} />
        </div>

        {isEditModalOpen && (
          <PerfilEditModal 
            perfil={perfil} 
            onClose={() => setIsEditModalOpen(false)} 
            onSave={handleEditSave} 
          />
        )}
      </div>
    </Layout>
  );
}
