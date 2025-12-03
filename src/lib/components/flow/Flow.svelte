<script lang="ts">
  import { setContext, type Snippet, tick } from 'svelte'
  import {
    Background,
    type Connection,
    ControlButton,
    Controls,
    type Edge,
    type EdgeTypes, type FitViewOptions,
    MiniMap,
    type Node,
    type NodeTypes,
    SvelteFlow,
    useSvelteFlow,
  } from '@xyflow/svelte'
  import '@xyflow/svelte/dist/style.css'
  import { derived, type Readable, writable } from 'svelte/store'
  import cx from 'classnames'

  import { Theme, theme } from '$lib/services/themeService'
  import { getLayoutedElements, } from '$lib/utils/flow'
  import { getDefaultEdgeOptions } from '$lib/utils/flow/options'
  import { setWorkflowSettings, workflowSettingsSelector } from '$lib/stores/appStore'
  import type { Maybe } from '$lib/types'

  import { CloseIcon, MindMapIcon, MinimapIcon, NodeTreeIcon } from '$components/icons'
  import type { FlowNodeContext } from '$components/flow/interfaces'
  import { Button } from '$components/common/ui'

  import TypeNode from './TypeNode.svelte'
  import GroupNode from './GroupNode.svelte'
  import DefaultEdge from './DefaultEdge.svelte'

  interface Props {
    nodes: Node[]
    edges: Edge[]
    direction: Readable<string>
    readOnly?: Readable<boolean>
    className?: string
    children?: Snippet

    onPaneClick?: () => void
    onNodeContextMenu?: (node: Node, event: MouseEvent | TouchEvent) => void
    onNodeClick?: (node: Node, event: MouseEvent | TouchEvent) => void
    onEdgeClick?: (edge: Edge, event: MouseEvent | TouchEvent) => void
    onDragOver?: (event: DragEvent) => void
    onDrop?: (event: DragEvent) => void
    onEdgeCreate?: (connection: Connection) => Maybe<Edge>
    onDelete?: (deleted: { nodes: Node[], edges: Edge[] }) => void
    onChangeDirection?: () => void
  }

  const FIT_VIEW_OPTIONS: FitViewOptions = {
    padding: 0.2,
  }

  let {
    nodes = $bindable([]),
    edges = $bindable([]),
    direction,
    readOnly = writable(false),
    className = '',
    children,
    onPaneClick,
    onNodeContextMenu,
    onNodeClick,
    onEdgeClick,
    onDragOver,
    onDrop,
    onEdgeCreate,
    onDelete,
    onChangeDirection,
  }: Props = $props()

  const { fitView } = useSvelteFlow()

  const flowNodeContext: FlowNodeContext = {
    onNodeContextMenu,
    isMenuDisabled: writable($readOnly),
    setIsMenuDisabled: (value: boolean) => {
      flowNodeContext.isMenuDisabled.set(value)
    },
    onDeleteTransition: (edge: any) => {
      console.log(edge)
      onDelete?.({ nodes: [], edges: [edge] })
    }
  }
  setContext('flowNodeContext', flowNodeContext)
  const isMiniMapVisible = derived(workflowSettingsSelector, (store) => store.isMiniMapVisible ?? true)

  const nodeTypes = {
    typeNode: TypeNode,
    group: GroupNode
  } as unknown as NodeTypes

  const edgeTypes = {
    defaultEdge: DefaultEdge,
  } as unknown as EdgeTypes

  const handleMiniMap = (value: boolean) => setWorkflowSettings('isMiniMapVisible', value)

  const validateConnection = (connection: Edge | Connection) => {
    // TODO: there is a simple validation for now
    // we should implement more complex validation logic later
    const isSourceExisting = edges.some((edge) => edge.source === connection.source)
    const isTargetExisting = edges.some((edge) => edge.target === connection.target)

    const isSourceNodeExisting = nodes.some((node) => node.id === connection.source && node.type !== 'group')
    const isTargetNodeExisting = nodes.some((node) => node.id === connection.target && node.type !== 'group' && !node.data.start)
    return [!isSourceExisting, !isTargetExisting, isSourceNodeExisting, isTargetNodeExisting].every(Boolean)
  }

  // subscribers
  readOnly.subscribe((v) => flowNodeContext.setIsMenuDisabled(v))

  // exported methods
  export const fitFlowView = async () => {
    await tick()
    await fitView(FIT_VIEW_OPTIONS)
    window.requestAnimationFrame(() => setTimeout(() => fitView({ ...FIT_VIEW_OPTIONS, duration: 300 }), 0))
  }

  export const fitToNode = async (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId)
    if (node) {
      await tick()
      await fitView({ nodes: [node], padding: 0.2, duration: 300 })
      return
    }

    await fitView({ ...FIT_VIEW_OPTIONS, duration: 300 })
  }

  export const layout = async (ns: Node[], es: Edge[]) => {
    const dr = $direction === 'vertical' ? 'DOWN' : 'RIGHT'
    return getLayoutedElements(ns, es, { 'elk.direction': dr })
  }
</script>

<div class="relative w-full h-full">
  <button
    class="absolute top-4 right-1/2 transform translate-x-1/2 z-10 flex items-center gap-2 rounded-lg bg-bgWeak50 border border-strokeSoft200 p-1"
    onclick={() => {
      onChangeDirection?.()
    }}
  >
    <span
      class="p-1 rounded-md"
      class:bg-bgSection={ $direction === 'horizontal' }
      class:text-textSoft400={ $direction !== 'horizontal' }
      title="Horizontal Direction"
    >
      <MindMapIcon width={16} height={16} />
    </span>
    <span
      class="p-1 rounded-md"
      class:bg-bgSection={ $direction === 'vertical' }
      class:text-textSoft400={ $direction !== 'vertical' }
      title="Vertical Direction"
    >
      <NodeTreeIcon  />
    </span>
  </button>
  <SvelteFlow
    bind:nodes
    bind:edges
    {nodeTypes}
    {edgeTypes}
    fitView
    fitViewOptions={FIT_VIEW_OPTIONS}
    colorMode={$theme === Theme.Dark ? 'dark' : 'light'}
    class={cx(className)}
    defaultEdgeOptions={getDefaultEdgeOptions()}
    onpaneclick={() => onPaneClick?.()}
    onnodecontextmenu={({ event, node }) => onNodeContextMenu?.(node, event)}
    onnodeclick={({ event, node }) => onNodeClick?.(node, event)}
    onedgeclick={({ event, edge }) => onEdgeClick?.(edge, event)}
    ondragover={onDragOver}
    ondrop={onDrop}
    onbeforeconnect={onEdgeCreate}
    ondelete={onDelete}
    nodesConnectable={!$readOnly}
    elementsSelectable={!$readOnly}
    maxZoom={1.33}
    connectionRadius={20}
    isValidConnection={validateConnection}
  >
    <Background bgColor="var(--flow-bg)" />
    {#if $isMiniMapVisible}
      <Controls position="bottom-right" showLock={false}>
        <ControlButton onclick={() => { handleMiniMap(false)}}>
          <span class="minimap__closeBtn"><CloseIcon /></span>
        </ControlButton>
      </Controls>
      <MiniMap />
    {:else}
      <Button
        size="small"
        type="secondary"
        onClick={() => { handleMiniMap(true) }}
        className="absolute bottom-4 right-4 z-5 bg-bgSection px-1.5 border-strokeSub300"
        icon={MinimapIcon}
      />
    {/if}

  </SvelteFlow>

  {@render children?.()}
</div>


<style lang="postcss">
  :global {
    .svelte-flow {
      .svelte-flow__minimap {
        right: 28px;
      }

      .svelte-flow__attribution {
        display: none;
      }

      .svelte-flow__controls.svelte-flow__panel {
        display: block !important;
        right: 0 !important;
      }

      .svelte-flow__handle {
        background: var(--bg-sub-300);
        width: 10px;
        height: 10px;
      }

      .svelte-flow__node {
        padding: 8px;
      }

      .svelte-flow__handle.connectingto {
        background: var(--primary-base) !important;
      }

      .minimap__closeBtn {
        svg {
          max-width: 18px;
          max-height: 18px;
        }
      }
    }
  }
</style>

