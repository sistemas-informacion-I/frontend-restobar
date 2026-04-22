import { AlertTriangle } from 'lucide-react';

interface Props {
  onDelete: () => void;
}

export function PerfilDeleteBanner({ onDelete }: Props) {
  return (
    <div className="glass-card rounded-[2.5rem] bg-rose-500/5 dark:bg-rose-900/5 border-2 border-rose-500/20 dark:border-rose-900/30 overflow-hidden transition-colors shadow-2xl shadow-rose-900/5">
      <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="flex gap-6 items-center">
          <div className="h-16 w-16 rounded-[1.5rem] bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-xl shadow-rose-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-rose-700 dark:text-rose-400 tracking-tight">Eliminar Cuenta</h3>
            <p className="text-rose-600/80 dark:text-rose-400/80 text-sm font-medium mt-1.5 max-w-xl">
              Al borrar tu cuenta perderás tu acceso a esta plataforma de manera permanente. Esta acción no eliminará físicamente tus transacciones pasadas (por temas de auditoría), pero deshabilitará tu perfil y revocará todas tus sesiones activas.
            </p>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="shrink-0 px-8 py-3.5 bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-700 hover:to-rose-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:shadow-rose-900/30 hover:shadow-2xl transition-all border-2 border-rose-500/20 active:scale-95"
        >
          Borrar Mi Cuenta
        </button>
      </div>
    </div>
  );
}
