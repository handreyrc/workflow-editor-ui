import type { Node } from '@xyflow/svelte'
import { Specification } from '@severlessworkflow/sdk-typescript'

import { WORKFLOW_OPERATIONS } from '$lib/constants/workflow'

export const getStatesFromNodes = (nodes: Node[], id?: string) => {
  return nodes
    .filter((node: Node) => id === node.parentId)
    .filter((node: Node) => node.data.state)
    .map((node: Node) => node.data.state) as Specification.States
}


export const getNormalizedWorkflow = (data: Record<string, any>): Specification.Workflow => {
  const actionModes: Record<string, string> = {}
  const completionTypes: Record<string, string> = {}

  data.states.forEach((state: any) => {
    if (state.type === WORKFLOW_OPERATIONS.operation.type && state.actionMode === 'parallel') {
      actionModes[state.name] = state.actionMode
    }

    if (state.completionType && state.completionType !== 'allOf') {
      completionTypes[state.name] = state.completionType
    }
  })

  const updatedWorkflow = Specification.Workflow.fromSource(JSON.stringify(data))
  const normalized = updatedWorkflow.normalize()

  // Change timeouts to be compatible with strings
  normalized.timeouts = Object.keys(data.timeouts || {}).length ? data.timeouts : undefined
  normalized.states = normalized.states
    .map((state) => {
      if (state.type === WORKFLOW_OPERATIONS.operation.type) {
        const operationState = state as Specification.Operationstate
        const actionMode = actionModes[operationState.name || '']

        return {
          ...state.normalize(),
          actionMode: actionMode || operationState.actionMode,
        }
      }

      if (state.type === WORKFLOW_OPERATIONS.parallel.type) {
        const parallelState = state as Specification.Parallelstate
        const completionType = completionTypes[parallelState.name || '']

        return {
          ...state.normalize(),
          completionType: completionType || parallelState.completionType,
        }
      }

      return state
    }) as Specification.States

  return normalized
}
