import { Shield } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Permission } from '../../services/api'

interface PermissionsCardProps {
  permissions: Permission[]
}

export function PermissionsCard({ permissions }: PermissionsCardProps) {
  if (permissions.length === 0) return null

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-4">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
            <Shield size={20} />
            Mis Permisos
          </h3>
          <div className="flex flex-wrap gap-2">
            {permissions.map((permission) => (
              <span
                key={permission.id}
                className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
              >
                {permission.description || permission.name}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
