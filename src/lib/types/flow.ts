import type { Node } from '@xyflow/svelte'

import type { WorkflowState } from '$lib/types/workflows'

export interface IContextMenu {
  id: string
  top: number
  left: number
  width: number
  height: number
}

export interface FlowNode extends Node {
  data: {
    type: string
    name: string
    state: WorkflowState
    end?: boolean
  }
}
