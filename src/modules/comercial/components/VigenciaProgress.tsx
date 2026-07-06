interface VigenciaProgressProps {
  estado?: string
  diasRestantes?: number
  diasTranscurridos?: number
}

type ProgressTone = 'green' | 'yellow' | 'red' | 'neutral'

const calculateVigencia = (estado?: string, diasRestantes = 0, diasTranscurridos = 0) => {
  const total = Math.max(diasRestantes + diasTranscurridos, 0)
  const progress = total > 0 ? Math.round((diasTranscurridos / total) * 100) : 0

  if (estado === 'FINALIZADA') {
    return {
      progress: 100,
      label: 'Finalizada',
      tone: 'red' as ProgressTone,
    }
  }

  if (estado === 'PROGRAMADA') {
    return {
      progress: 0,
      label: diasRestantes > 0 ? `Comienza en ${diasRestantes} días` : 'Programada',
      tone: 'neutral' as ProgressTone,
    }
  }

  if (estado === 'INACTIVA') {
    return {
      progress: 0,
      label: 'Inactiva',
      tone: 'neutral' as ProgressTone,
    }
  }

  if (estado === 'ACTIVA') {
    return {
      progress: Math.max(0, Math.min(progress, 100)),
      label: diasRestantes > 0 ? `Restan ${diasRestantes} días` : 'Vigente',
      tone: 'green' as ProgressTone,
    }
  }

  return {
    progress: 0,
    label: 'Sin vigencia',
    tone: 'neutral' as ProgressTone,
  }
}

const toneClasses: Record<ProgressTone, { bar: string; text: string }> = {
  green: {
    bar: 'bg-emerald-500 dark:bg-emerald-400',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
  yellow: {
    bar: 'bg-amber-500 dark:bg-amber-400',
    text: 'text-amber-700 dark:text-amber-400',
  },
  red: {
    bar: 'bg-rose-500 dark:bg-rose-400',
    text: 'text-rose-700 dark:text-rose-400',
  },
  neutral: {
    bar: 'bg-slate-400 dark:bg-slate-500',
    text: 'text-slate-600 dark:text-slate-300',
  },
}

export function VigenciaProgress({ estado, diasRestantes, diasTranscurridos }: VigenciaProgressProps) {
  const { progress, label, tone } = calculateVigencia(estado, diasRestantes, diasTranscurridos)
  const classes = toneClasses[tone]

  return (
    <div className="min-w-[220px]">
      <div className="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700/70">
        <div className={`h-full rounded-full transition-all ${classes.bar}`} style={{ width: `${progress}%` }} />
      </div>
      <p className={`text-xs font-semibold ${classes.text}`}>{label}</p>
    </div>
  )
}
