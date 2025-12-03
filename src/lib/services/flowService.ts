import { writable, get } from 'svelte/store'
import type { Connection, Edge, Node } from '@xyflow/svelte'
import { Specification } from '@severlessworkflow/sdk-typescript'

import type { FlowNode, IContextMenu } from '$lib/types/flow'
import {
  getName,
  createEdge,
  getUpdatedNodeState,
  addTypedNode,
  getEdgesByType, addNewState
} from '$lib/utils/flow'
import type { Maybe } from '$lib/types'
import type { WorkflowState } from '$lib/types/workflows'

export interface Handlers {
  deleteElements: ({ nodes, edges }: {
    nodes?: (Node | { id: Node['id'] })[]
    edges?: (Edge | { id: Edge['id'] })[]
  }) => Promise<{
    deletedNodes: Node[]
    deletedEdges: Edge[]
  }>
}

export class FlowService {
  public handlers: Record<string, any> = {}

  constructor(handlers: Handlers) {
    this.handlers.deleteElements = handlers.deleteElements
  }

  public nodes = writable<Node[]>([])
  public edges = writable<Edge[]>([])
  public selectedNode = writable<Maybe<FlowNode>>()
  public menu = writable<Maybe<IContextMenu>>()

  public setData(nodes: Node[], edges: Edge[]) {
    this.nodes.set(nodes)
    this.edges.set(edges)
  }

  public updateNodesClass(highlightedNodeId: string) {
    this.nodes.update((ns) =>
      ns.map((n) => ({
        ...n,
        class: n.id === highlightedNodeId ? 'highlight' : '',
      }))
    )
  }

  public addNode(type: string, prefix = '', options = {}) {
    const node = addTypedNode(type, prefix, options)
    this.nodes.update((nodes) => [...nodes, node])
    return node
  }

  public createEdge(connection: Connection) {
    const { source, target } = connection
    if (!source || !target) return

    const id = `edge-${source}-${target}`
    const node = this.getNodeById(source) as FlowNode
    const edge = createEdge({ id, source, target, data: { state: node?.data.state } }) as Edge

    this.nodes.update(($nodes) => {
      return $nodes.map((n) => {
        const node = n as FlowNode

        if (node.id === source) {
          const targetNode = $nodes.find((n) => n.id === target)
          if (!targetNode) return n
          return getUpdatedNodeState(n as FlowNode, { transition: (targetNode as FlowNode).data.name, end: false })
        }

        return n
      })
    })

    return edge
  }

  public deleteNodeTransitions(edges: Edge[]) {
    const $nodes = get(this.nodes)

    edges.forEach((edge) => {
      this.nodes.update(() => {
        return $nodes.map((n) => {
          const node = n as FlowNode

          if (node.id === edge.source) {
            const isTransition = edge.data?.state?.transition
            const error = edge.data?.error as Maybe<Specification.Error>
            const subFlowRef = edge.data?.subFlowRef as Maybe<Specification.Subflowref>

            let updatedState = {}

            if (error) {
              updatedState = {
                onErrors: n.data.state?.onErrors?.filter((e: Specification.Error) => e.errorRef !== error.errorRef),
              }
              return getUpdatedNodeState(n as FlowNode, updatedState)
            }

            if (subFlowRef) {
              updatedState = {
                actions: n.data.state?.actions?.filter((a: Specification.Action) => {
                  return a.subFlowRef?.workflowId !== subFlowRef.workflowId
                }),
              }
              return getUpdatedNodeState(n as FlowNode, updatedState)
            }

            updatedState = { transition: isTransition ? undefined : n.data.state?.transition }
            return getUpdatedNodeState(n as FlowNode, updatedState)
          }

          return n
        })
      })
    })

    this.handlers.deleteElements({ edges })
  }

  public updateIncomeEdges(prevId: string, nextId: string) {
    this.edges.update(($edges) => {
      return $edges.map((edge) => {
        if (edge.target === prevId) {
          return { ...edge, id: `edge-${edge.source}-${nextId}`, target: nextId }
        }

        return edge
      })
    })
  }

  public async createEdgesForNode (state: WorkflowState, prevId: string, nextId: string, prefix = '') {
    const outgoingEdges = this.getOutgoingEdges(prevId)
    await this.handlers.deleteElements({ edges: outgoingEdges })

    const $edges = get(this.edges)
    $edges.push(...getEdgesByType(state, nextId, prefix))
  }

  public async updateNode(values: Record<string, any>, prefix = '') {
    const $nodes = get(this.nodes)
    const selectedNode = get(this.selectedNode)

    if (!selectedNode) return []

    let updatedNodes: Node[] = []

    const nextName = values.name
    const prevId = selectedNode.id
    const nextId = getName(nextName, prefix)

    const state = { type: selectedNode.data.type,  ...values } as WorkflowState

    for (const node of $nodes) {
      const flowNode = node as FlowNode

      if (flowNode.id === selectedNode?.id) {
        this.updateIncomeEdges(prevId, nextId)
        await this.createEdgesForNode(state, prevId, nextId, prefix)

        const updatedNode = selectedNode
        const newState = addNewState(state)
        updatedNode.id = nextId
        updatedNode.data = {
          ...updatedNode.data,
          name: values.name,
          state: newState,
          end: values.end,
        }

        updatedNodes.push(updatedNode)
        continue
      }

      updatedNodes.push(node)
    }

    this.selectedNode.set(undefined)
    return updatedNodes
  }

  public setSelectedNode(node: Maybe<FlowNode>) {
    this.selectedNode.set(node)
  }

  public setContextMenu(menu: Maybe<IContextMenu>) {
    this.menu.set(menu)
  }

  public getNodeById(nodeId: string): Node | undefined {
    return get(this.nodes).find((node) => node.id === nodeId)
  }

  public hasConnection(sourceId: string, targetId: string): boolean {
    return get(this.edges).some((edge) =>
      edge.source === sourceId && edge.target === targetId
    )
  }

  public getOutgoingEdges(nodeId: string): Edge[] {
    return get(this.edges).filter((edge) => edge.source === nodeId)
  }

  public getIncomingEdges(nodeId: string): Edge[] {
    return get(this.edges).filter((edge) => edge.target === nodeId)
  }

  public clear() {
    this.nodes.set([])
    this.edges.set([])
    this.selectedNode.set(undefined)
    this.menu.set(undefined)
  }
}
