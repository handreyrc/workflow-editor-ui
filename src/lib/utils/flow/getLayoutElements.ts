import { type Edge, type Node, Position } from '@xyflow/svelte'
import type { ElkExtendedEdge, ElkNode } from 'elkjs/lib/elk-api'
import ELK from 'elkjs/lib/elk.bundled'

import { elkOptions } from '$lib/constants/flow'

const elk = new ELK()

const getNodeDimensions = (node: Node) => ({
  width: node.measured?.width || 0,
  height: node.measured?.height || 0
})

const applyPositions = (isHorizontal: boolean): Partial<Node> => ({
  targetPosition: isHorizontal ? Position.Left : Position.Top,
  sourcePosition: isHorizontal ? Position.Right : Position.Bottom
})

const getNodeData = (node: Node, isHorizontal: boolean): Node => ({
  ...node,
  ...getNodeDimensions(node),
  ...applyPositions(isHorizontal),
})

const createWorkflowNodes = (nodes: Node[], isHorizontal: boolean): ElkNode[] =>
  nodes
    .filter(({ parentId, type }) => !parentId && type !== 'group')
    .map((node) => getNodeData(node, isHorizontal))

const createGroupNodes = (nodes: Node[], isHorizontal: boolean, opts: Record<string, any>): ElkNode[] =>
  nodes
    .filter(({ type }) => type === 'group')
    .map((groupNode) => {
      return {
        ...getNodeData(groupNode, isHorizontal),
        layoutOptions: {
          ...elkOptions,
          ...opts,
          'elk.padding': '[top=80]'
        },
        children: nodes
          .filter(({ parentId }) => parentId === groupNode.id)
          .map((child) => getNodeData(child, isHorizontal)),
      }
    })

export const getLayoutedElements = async (
  nodesProp: Node[],
  edgesProp: Edge[],
  opts: Record<string, any> = {}
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  const isHorizontal = opts['elk.direction'] === 'RIGHT'

  const workflowNodes = createWorkflowNodes(nodesProp, isHorizontal)
  const groupNodes = createGroupNodes(nodesProp, isHorizontal, opts)

  const children = ([] as ElkNode[]).concat(workflowNodes, groupNodes)
  const nodeIds: string[] = children.reduce((prev, next) => {
    if (next.children) {
      prev.push(...next.children.map((child) => child.id))
    }
    prev.push(next.id)
    return prev
  }, [] as string[])

  const graph: ElkNode = {
    id: 'root',
    layoutOptions: {
      ...elkOptions,
      ...opts,
    },
    children: children,
    edges: edgesProp?.filter((edge) => {
      const isTargetValid = nodeIds.includes(edge.target)
      const isSourceValid = nodeIds.includes(edge.source)

      return isTargetValid && isSourceValid
    }) as unknown as ElkExtendedEdge[],
  }

  try {
    const layout = await elk.layout(graph)

    const allNodes = layout.children?.reduce<ElkNode[]>((acc, layoutNode, index) => {
      const parentNode = {
        ...layoutNode,
        position: {
          x: layoutNode.x || 0,
          y: layoutNode.y || 0,
        },
      }

      const childNodes = (layoutNode.children || [])
        .map((child) => ({
          ...child,
          parentId: layoutNode.id,
          position: {
            x: child.x,
            y: child.y,
          },
        }))

      return [...acc, parentNode, ...childNodes]
    }, []) ?? []

    return {
      nodes: allNodes as Node[],
      edges: layout.edges as unknown as Edge[],
    }
  } catch (error) {
    console.error('ELK layout error:', error)
    return { nodes: [], edges: [] }
  }
}
