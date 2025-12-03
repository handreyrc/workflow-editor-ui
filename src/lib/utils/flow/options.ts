import { type Edge, MarkerType } from '@xyflow/svelte'

interface MarkerOptions {
  type: MarkerType.ArrowClosed
  width: number
  height: number
  color: string
}

const DEFAULT_MARKER: MarkerOptions = {
  type: MarkerType.ArrowClosed,
  width: 10,
  height: 10,
  color: 'var(--stroke-strong-950)'
}

export const getErrorEdgeOptions = () => {
  return {
    type: 'smoothstep',
    markerEnd: {
      ...DEFAULT_MARKER,
      color: 'var(--error-light)',
    },
    style: 'stroke-width: 2px; stroke: var(--error-light); stroke-dasharray: 5, 5',
  }
}

export const getDefaultEdgeOptions = (): Edge => ({
  animated: true,
  type: 'defaultEdge',
  markerEnd: DEFAULT_MARKER,
  style: 'stroke-width: 2px; stroke: var(--stroke-strong-950)',
} as unknown as Edge)

export const getDefaultNodeOptions = (id: string) => ({
  id,
  type: 'typeNode',
  position: { x: 0, y: 0 },
})
