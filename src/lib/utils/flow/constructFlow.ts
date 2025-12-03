import { type Edge, type Node } from '@xyflow/svelte'
import * as WorkflowBuilder from '@severlessworkflow/sdk-typescript'

import type { Workflow, WorkflowState } from '$lib/types/workflows'
import type { Maybe } from '$lib/types'

import { getErrorEdgeOptions, getDefaultEdgeOptions, getDefaultNodeOptions } from './options'
import { createEdge, getName } from './utils'

export const generateGraphElements = (
  workflow: Workflow,
  prefix = ''
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = []
  const edges: Edge[] = []

  if (!workflow.states.length) return { nodes, edges }

  // Iterate states once
  workflow.states.forEach((state) => {
    const name = getName(state.name, prefix)

    // Create node
    nodes.push({
      ...getDefaultNodeOptions(name),
      data: {
        name: state.name,
        type: state.type,
        state,
        start: workflow.start === state.name,
        end: state.end
      },
    })

    edges.push(...getEdgesByType(state, name, prefix))
  })

  return { nodes, edges }
}

export const getEdgesByType = (
  state: WorkflowState,
  name: string,
  prefix: string
): Edge[] => {
  const edges: Edge[] = []

  // Transition edges
  switch (state.type) {
    case 'operation':
    case 'foreach':
    case 'sleep':
    case 'inject':
    case 'parallel':
    case 'callback':
    case 'event': {
      const transitionEdges = handleStateTransition(state, name, prefix)
      edges.push(...transitionEdges)
      break
    }
    case 'switch': {
      const switchEdges = handleSwitchState(state, name, prefix)
      edges.push(...switchEdges)
      break
    }
    default:
      break
  }

  edges.push(...handleErrorEdges(state, name, prefix))
  edges.push(...handleSubflowEdges(state, name, prefix))
  return edges
}

export const generateWorkflowData = (_workflow: Workflow) => {
  const workflow = WorkflowBuilder.Specification.Workflow.fromSource(
    JSON.stringify(_workflow)
  ) as Workflow

  if (!workflow || !workflow.states) return { nodes: [], edges: [] }
  return generateGraphElements(workflow, workflow.id + '_')
}

export const generateAllWorkflows = (
  workflow: Workflow,
  subflows: Maybe<Workflow[]>
) => {
  const { nodes: initialNodes, edges: initialEdges } = generateWorkflowData(workflow)

  const subflowsNodesEdges = subflows
    ?.map((subflow) => ({
      parentNode: {
        id: subflow.id,
        position: { x: 0, y: 0 },
        width: 300,
        height: 300,
        data: { name: subflow.name },
        type: 'group'
      } as Node,
      ...generateWorkflowData(subflow)
    })) || []

  const subflowsNodes = subflowsNodesEdges
    ?.map((subflow) => ([
      subflow.parentNode,
      ...(subflow.nodes?.map((node) => ({
        ...node,
        parentId: subflow.parentNode.id,
        extent: 'parent',
      })) || [])
    ]))
    .flat() as Node[] || []

  const nodes: Node[] = [...initialNodes, ...subflowsNodes]
  const subflowsEdges = subflowsNodesEdges.map((subflow) => subflow.edges).flat()

  return {
    nodes,
    edges: ([] as Edge[]).concat(initialEdges, subflowsEdges),
  }
}

const handleStateTransition = (
  state: WorkflowState,
  name: string,
  prefix: string
): Edge[] => {
  const edges: Edge[] = []

  if ('transition' in state && state.transition) {
    const transition = getName(state.transition as string, prefix)
    const id = `edge-${name}-${transition}`
    const edge = createEdge({
      id,
      source: name,
      target: transition,
      data: {
        state,
      }
    })
    edges.push(edge)
  }

  return edges
}

const handleSwitchState = (
  state: WorkflowState,
  name: string,
  prefix: string
): Edge[] => {
  const edges: Edge[] = []

  if ('defaultCondition' in state) {
    if (state.defaultCondition.transition) {
      const transition = getName(state.defaultCondition.transition as string, prefix)
      edges.push({
        ...getDefaultEdgeOptions(),
        style: 'stroke-width: 1px; stroke: var(--stroke-sub-300)',
        animated: false,
        id: `edge-${name}-${transition}`,
        source: name,
        target: transition,
        data: { state }
      })
    }
  }

  if ('dataConditions' in state) {
    state.dataConditions?.forEach((condition) => {
      if ('transition' in condition && condition.transition) {
        const transition = getName(condition.transition as string, prefix)
        edges.push({
          ...getDefaultEdgeOptions(),
          id: `edge-${name}-${transition}`,
          source: name,
          target: transition,
          label: condition.condition,
          data: {
            state,
            condition
          }
        })
      }
    })
  }

  return edges
}

const handleErrorEdges = (
  state: WorkflowState,
  name: string,
  prefix: string
): Edge[] => {
  const edges: Edge[] = []

  if ('onErrors' in state) {
    state.onErrors?.forEach((error) => {
      if (error.transition) {
        const transition = getName(error.transition as string, prefix)
        const edge = createEdge({
          ...getErrorEdgeOptions(),
          id: `edge-${name}-${transition}`,
          source: name,
          target: transition,
          label: error.errorRef,
          data: { state, error }
        })

        edges.push(edge)
      }
    })
  }

  return edges
}

const handleSubflowEdges = (
  state: WorkflowState,
  name: string,
  prefix: string
): Edge[] => {
  const edges: Edge[] = []

  if ('actions' in state) {
    state?.actions?.forEach((action) => {
      if (action?.subFlowRef) {
        edges.push({
          id: `edge-subflow-transition-${action.subFlowRef.workflowId}`,
          source: name,
          target: `${action.subFlowRef.workflowId}`,
          label: action.subFlowRef.invoke,

          type: 'smoothstep',
          markerEnd: getDefaultEdgeOptions().markerEnd,
          style: 'stroke-width: 2px;',
          data: { state, subFlowRef: action.subFlowRef }
        } as unknown as Edge)
      }
    })
  }

  return edges
}



