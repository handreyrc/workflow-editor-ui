import type { Node } from '@xyflow/svelte'
import type { Writable } from 'svelte/store'

export interface FlowNodeContext {
  isMenuDisabled: Writable<boolean>
  setIsMenuDisabled: (value: boolean) => void
  onNodeContextMenu?: (node: Node, event: MouseEvent | TouchEvent) => void
  onDeleteTransition: (edge: any) => void
}
