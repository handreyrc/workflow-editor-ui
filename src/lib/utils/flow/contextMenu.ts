import { type Node } from '@xyflow/svelte'

export const getContextMenu = (node: Node, target: HTMLElement) => {
  const nodeNode = target.closest('.svelte-flow__node') as HTMLElement
  const rect = nodeNode.getBoundingClientRect()

  return {
    id: node.id,
    top: rect.top + window.scrollX,
    left: rect.left + window.scrollY,
    width: rect.width,
    height: rect.height,
  }
}
