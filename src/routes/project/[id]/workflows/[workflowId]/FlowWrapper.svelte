<script lang="ts">
  import { getContext, tick } from 'svelte'
  import {
    type Connection,
    type Edge,
    type Node,
    type Rect,
    useSvelteFlow,
  } from '@xyflow/svelte'
  import '@xyflow/svelte/dist/style.css'
  import { derived, get, type Readable, type Writable, writable, type Unsubscriber } from 'svelte/store'
  import cx from 'classnames'

  import { setIsWorkflowSaved, workflowsSelectedWorkflowSelector } from '$lib/stores/workflowStore'
  import {
    generateAllWorkflows,
    getContextMenu,
  } from '$lib/utils/flow'
  import { setWorkflowSettings, workflowSettingsSelector } from '$lib/stores/appStore'
  import type { FlowNode } from '$lib/types/flow'
  import { FlowService } from '$lib/services/flowService'
  import { showErrorMessage } from '$lib/stores/toastsStore'
  import type { Maybe } from '$lib/types'
  import type { Workflow } from '$lib/types/workflows'
  import { WORKFLOW_DATA_CONTEXT, type WorkflowDataContext } from '$lib/types/context/workflow'
  import { getNormalizedWorkflow, getStatesFromNodes } from '$lib/utils/flow/toServerless'

  import GlobalLoader from '$components/loading/GlobalLoader.svelte'
  import ContextMenu from '$components/flow/ContextMenu.svelte'
  import Flow from '$components/flow/Flow.svelte'

  import StateFormWrapper from './StateFormWrapper.svelte'

  interface Props {
    readOnly?: Readable<boolean>
  }

  let {
    readOnly = writable(false),
  }: Props = $props()

  let flowRef: Maybe<Flow> = $state()
  let isLoading = $state(true)

  const direction = derived(workflowSettingsSelector, (store) => store.direction || 'vertical')

  const { screenToFlowPosition, deleteElements, getIntersectingNodes } = useSvelteFlow()
  const flowService = new FlowService({ deleteElements })
  const {
    nodes,
    edges,
    selectedNode,
    menu
  } = flowService

  const workflowDataContext: WorkflowDataContext = getContext(WORKFLOW_DATA_CONTEXT)
  const currentWorkflow = workflowDataContext.workflow
  const currentSubflows = workflowDataContext.subflows

  const workflowContent = derived(workflowsSelectedWorkflowSelector, (store) => store?.content)
  const type = getContext('dnd') as Writable<string | null>

  const buildInitialFlow = async (workflow?: Workflow, subflows?: Workflow[]) => {
    if (!workflow) {
      isLoading = false
      return
    }

    try {
      flowService.setData([], [])
      isLoading = true

      const { nodes: initialNodes, edges: initialEdges } = generateAllWorkflows(workflow, subflows)
      flowService.setData(initialNodes, initialEdges)
    } catch (e) {
      showErrorMessage({ description: 'Error while generating the flow.' })
      isLoading = false
      return
    }

    // We do it to let flow measure the size of nodes
    await waitForMeasured()
    await onLayout($nodes, $edges)
    isLoading = false
  }

  const waitForMeasured = () => {
    return new Promise<void>((resolve) => {
      let unsubscribe: Unsubscriber

      unsubscribe = nodes.subscribe((ns) => {
        if (!ns.length || ns.every((n) => n.measured)) {
          unsubscribe?.()
          resolve()
        }
      })
    })
  }

  const onLayout = async (ns: Node[], es: Edge[], fit = true) => {
    if (!flowRef) return
    flowService.setData([], [])

    try {
      const { nodes: layoutNodes = [], edges: layoutEdges = [] } = await flowRef.layout(ns, es)
      flowService.setData(layoutNodes, layoutEdges)
    } catch {
      flowService.setData($nodes, $edges)
      showErrorMessage({ description: 'Error while construction the flow.' })
    }


    if (fit) {
      await tick()
      await fitFlowView()
    }
  }

  const handleContextMenu = (node: Node, event: MouseEvent | TouchEvent) => {
    event.preventDefault()
    if ($readOnly) return
    flowService.setContextMenu(getContextMenu(node, event.target as HTMLElement))
  }

  const handleContextMenuOption = (id: string, option: string) => {
    if (option === 'edit') {
      const node = $nodes.find((n) => n.id === id) as FlowNode
      flowService.setSelectedNode(node)
    }
    if (option === 'delete') deleteElements({ nodes: [{ id }] })

    flowService.setContextMenu(undefined)
  }

  const getIntersectionSubflow = (event: DragEvent) => {
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })

    const intersections = getIntersectingNodes({
      ...position,
      width: Number(event.dataTransfer?.getData('width') || 120),
      height: Number(event.dataTransfer?.getData('height') || 40),
    } as Rect)

    return intersections.find((i) => i.type === 'group')
  }

  const onDragOver = (event: DragEvent) => {
    event.preventDefault()

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }

    const intersectedSubflow = getIntersectionSubflow(event)
    flowService.updateNodesClass(intersectedSubflow?.id || '')
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    if (!$type) return

    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })
    const intersectedSubflow = getIntersectionSubflow(event)

    addNode($type, intersectedSubflow?.id, {
      position: intersectedSubflow ? {
        x: position.x - intersectedSubflow.position.x,
        y: position.y - intersectedSubflow.position.y,
      } : position,
      origin: [0.0, 0.0],
      parentId: intersectedSubflow?.id,
      extent: intersectedSubflow?.id ? 'parent' : undefined,
    })
    setIsWorkflowSaved(false)
  }

  const handleDelete = ({ edges, nodes }: { nodes: Node[], edges: Edge[] }) => {
    if ($readOnly) return

    const groupNodes = nodes.filter((n) => n.type === 'group')
    groupNodes.forEach((node) => {
      workflowDataContext.deleteSubflowById(node.id)
    })

    flowService.deleteNodeTransitions(edges)
    setIsWorkflowSaved(false)
  }

  const handleEdgeCreate = (connection: Connection): Maybe<Edge> => {
    const edge = flowService.createEdge(connection)

    if (edge) {
      setIsWorkflowSaved(false)
    }

    return edge
  }

  const handleUpdateNode = async (values: Record<string, any>) => {
    const workflow = get(workflowDataContext.workflow)
    const prefix = $selectedNode?.parentId ? `${$selectedNode?.parentId}_` : `${workflow?.id || ''}_`
    const updatedNodes = await flowService.updateNode(values, prefix)
    setIsWorkflowSaved(false)

    onLayout(updatedNodes, $edges, false)
  }

  // subscribes
  readOnly.subscribe((isReadOnly) => {
    nodes.update((n) => n.map((node) => ({ ...node, selectable: !isReadOnly, selected: false })))
    edges.update((e) => e.map((edge) => ({ ...edge, selectable: !isReadOnly, selected: false })))
  })

  type.subscribe((val) => { if (!val) flowService.updateNodesClass('') })
  workflowContent.subscribe((data) => buildInitialFlow(data?.workflow, data?.subflows))
  nodes.subscribe((data) => workflowDataContext.nodes.set(data))

  // exported methods
  export const fitFlowView = async () => {
    flowRef?.fitFlowView()
  }

  export const fitToNode = async (nodeId: string) => {
    flowRef?.fitToNode(nodeId)
  }

  export const buildWorkflowFromContext = (keepNodes = true) => {
    if (!keepNodes) {
      const workflow = get(workflowDataContext.workflow)
      const subflows = get(workflowDataContext.subflows)

      buildInitialFlow(workflow, subflows)
      return
    }

    const states = getStatesFromNodes($nodes)
    const workflow = getNormalizedWorkflow({ ...get(workflowDataContext.workflow), states })
    const subflows = get(workflowDataContext.subflows).map((subflow) => {
      const subflowStates = getStatesFromNodes($nodes, subflow.id)
      return getNormalizedWorkflow({ ...subflow, states: subflowStates })
    })

    buildInitialFlow(workflow, subflows)
  }

  export const resetToSavedWorkflow = () => {
    buildInitialFlow($workflowContent?.workflow, $workflowContent?.subflows)
  }

  export const addNode = (
    type: string,
    workflowId: Maybe<string> = undefined,
    options = {}
  ) => {
    const workflow = get(workflowDataContext.workflow)
    const nodePrefix = `${workflowId || workflow?.id || ''}_`

    flowService.addNode(type, nodePrefix, {
      parentId: workflowId,
      extent: workflowId ? 'parent' : undefined,
      ...options
    })
    setIsWorkflowSaved(false)
  }

  export const getNodes = () => {
    return $nodes
  }
</script>

{#if isLoading}
  <div class="w-full h-full center"><GlobalLoader internalLoader /></div>
{/if}

<div class="relative w-full h-full">
  {#if $selectedNode}
    <div class="absolute inset-0 bg-transparent z-1 pointer-events-auto"></div>
  {/if}

  <Flow
    bind:this={flowRef}
    bind:nodes={$nodes}
    bind:edges={$edges}
    className={cx({ 'opacity-0': isLoading, 'pointer-events-none': $menu || $selectedNode })}
    direction={direction}
    onPaneClick={() => { flowService.setContextMenu(undefined) }}
    onNodeContextMenu={handleContextMenu}
    onEdgeClick={() => {}}
    onDragOver={onDragOver}
    onDrop={onDrop}
    onEdgeCreate={handleEdgeCreate}
    onDelete={handleDelete}
    onChangeDirection={() => {
      setWorkflowSettings('direction', $direction === 'vertical' ? 'horizontal' : 'vertical')
      onLayout($nodes, $edges)
    }}
    readOnly={readOnly}
  >
    {#if $menu}
      <ContextMenu
        menu={$menu}
        onClose={() => flowService.setContextMenu(undefined)}
        onOptionSelect={handleContextMenuOption}
      />
    {/if}
  </Flow>

  {#if $selectedNode}
    <StateFormWrapper
      node={$selectedNode}
      allNodes={$nodes.filter(({ data, parentId }) => data.state && parentId === $selectedNode.parentId )}
      functions={$currentWorkflow.functions}
      errors={$currentWorkflow.errors}
      events={$currentWorkflow.events}
      subflows={$currentSubflows}
      onSave={handleUpdateNode}
      onClose={() => flowService.setSelectedNode(undefined)}
    />
  {/if}
</div>

