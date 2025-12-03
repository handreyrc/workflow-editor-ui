import { Specification } from '@severlessworkflow/sdk-typescript'
import type { Edge, Node } from '@xyflow/svelte'

import type { FlowNode } from '$lib/types/flow'
import { WORKFLOW_OPERATIONS } from '$lib/constants/workflow'
import type { WorkflowState } from '$lib/types/workflows'

import { getDefaultEdgeOptions, getDefaultNodeOptions } from './options'

export const getName = (name: string = '', prefix = '') => prefix + name?.replace?.(/\s+/g, '_')

export const createEdge = (options = {}) => ({
  ...getDefaultEdgeOptions(),
  ...options,
})

export const getUpdatedNodeState = (
  node: FlowNode,
  state: Record<string, any>
): Node => {
  const prevState = node.data.state || {}
  const newState = addNewState({ ...prevState, ...state })

  return {
    ...node,
    data: {
      ...node.data,
      state: newState,
      end: state.end
    }
  }
}

export const addTypedNode = (type: string, prefix = '', options = {}) => {
  const name = 'node_' + Math.random().toString(36).substr(2, 5)
  const id = getName(name, prefix)

  return {
    ...getDefaultNodeOptions(id),
    data: {
      name: name,
      type,
      state: addNewState({ name: name, type }),
    },
    selectable: true,
    ...options
  } as Node
}

export const addNewState = (state: Record<string, any>): WorkflowState => {
  const { type } = state

  const stateTypes = {
    [WORKFLOW_OPERATIONS.event.type]: () => new Specification.Eventstate({ onEvents: [], ...state }),
    [WORKFLOW_OPERATIONS.operation.type]: () => new Specification.Operationstate(state),
    [WORKFLOW_OPERATIONS.switch.type]: () => new Specification.Databasedswitchstate(state),
    [WORKFLOW_OPERATIONS.inject.type]: () => new Specification.Injectstate(state),
    [WORKFLOW_OPERATIONS.sleep.type]: () => new Specification.Sleepstate(state),
    [WORKFLOW_OPERATIONS.foreach.type]: () => new Specification.Foreachstate(state),
    [WORKFLOW_OPERATIONS.parallel.type]: () => new Specification.Parallelstate(state),
    [WORKFLOW_OPERATIONS.callback.type]: () => new Specification.Callbackstate(state)
  }

  return stateTypes[type]?.() as WorkflowState
}

export const addNewAction = (action: Record<string, any> = {})=> {
  delete action.sourceModel
  return new Specification.Action(action)
}

export const addNewError = (error: Record<string, any> = {})=> {
  return new Specification.Error(error)
}

export const addNewEvent = (event: Record<string, any> = {})=> {
  return new Specification.Onevents(event)
}
