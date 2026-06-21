import { useMemo } from 'react'
import { Group, Layer, Rect, Stage, Text } from 'react-konva'
import { DisponibilidadMesaResponse } from '@/modules/electronico/models/reserva.model'

interface PlanoMesasProps {
  mesas: DisponibilidadMesaResponse[]
  selectedIds: number[]
  onToggle: (mesa: DisponibilidadMesaResponse) => void
}

const colors = {
  disponible: '#ffffff',
  seleccionado: '#22c55e',
  reservado: '#ef4444',
  noDisponible: '#111827',
}

export function PlanoMesas({ mesas, selectedIds, onToggle }: PlanoMesasProps) {
  const layout = useMemo(() => {
    const columns = Math.max(2, Math.ceil(Math.sqrt(Math.max(mesas.length, 1))))
    const tileW = 118
    const tileH = 86
    const gap = 24
    const width = columns * tileW + (columns - 1) * gap + 48
    const rows = Math.max(1, Math.ceil(mesas.length / columns))
    const height = rows * tileH + (rows - 1) * gap + 72

    return {
      columns,
      tileW,
      tileH,
      gap,
      width,
      height,
    }
  }, [mesas.length])

  return (
    <div className="overflow-auto rounded-[2rem] border border-wine-100/50 bg-slate-100/70 p-4 shadow-inner dark:border-wine-900/30 dark:bg-black/30">
      <Stage width={layout.width} height={layout.height}>
        <Layer>
          <Rect
            x={8}
            y={8}
            width={layout.width - 16}
            height={layout.height - 16}
            cornerRadius={28}
            fill="#f8fafc"
            stroke="#e2e8f0"
          />
          <Text x={28} y={22} text="Plano de mesas" fontSize={14} fontStyle="bold" fill="#334155" />
          {mesas.map((mesa, index) => {
            const col = index % layout.columns
            const row = Math.floor(index / layout.columns)
            const x = 28 + col * (layout.tileW + layout.gap)
            const y = 52 + row * (layout.tileH + layout.gap)
            const selected = selectedIds.includes(mesa.idMesa)
            const fill = selected
              ? colors.seleccionado
              : !mesa.disponible && mesa.estadoPlano === 'OCUPADO_RESERVADO'
                ? colors.reservado
                : !mesa.disponible
                  ? colors.noDisponible
                  : colors.disponible
            const textColor = selected || !mesa.disponible ? '#ffffff' : '#111827'

            return (
              <Group
                key={mesa.idMesa}
                x={x}
                y={y}
                onClick={() => onToggle(mesa)}
                onTap={() => onToggle(mesa)}
                listening={mesa.disponible}
              >
                <Rect
                  width={layout.tileW}
                  height={layout.tileH}
                  cornerRadius={18}
                  fill={fill}
                  stroke={selected ? '#15803d' : mesa.disponible ? '#cbd5e1' : fill}
                  strokeWidth={selected ? 4 : 2}
                  shadowColor="rgba(15, 23, 42, 0.16)"
                  shadowBlur={selected ? 14 : 8}
                  shadowOffsetY={5}
                />
                <Text
                  x={0}
                  y={18}
                  width={layout.tileW}
                  align="center"
                  text={`Mesa ${mesa.numeroMesa}`}
                  fontSize={18}
                  fontStyle="bold"
                  fill={textColor}
                />
                <Text
                  x={0}
                  y={48}
                  width={layout.tileW}
                  align="center"
                  text={`${mesa.capacidadPersonas} personas`}
                  fontSize={12}
                  fill={textColor}
                />
              </Group>
            )
          })}
        </Layer>
      </Stage>
    </div>
  )
}
