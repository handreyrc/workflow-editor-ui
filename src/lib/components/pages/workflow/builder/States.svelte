<script lang="ts">
  import { getContext } from 'svelte'
  import type { Writable } from 'svelte/store'

  import { WORKFLOW_OPERATIONS } from '$lib/constants/workflow'

  import StateIcon from '$components/common/StateIcon.svelte'

  interface Props {
    onAddNode: (type?: string) => void
  }

  const DISABLED_NODES = [
    WORKFLOW_OPERATIONS.event.type,
  ]

  let { onAddNode }: Props = $props()
  const type = getContext('dnd') as Writable<string | null>

  const nodes = $state([
    WORKFLOW_OPERATIONS.event,
    WORKFLOW_OPERATIONS.operation,
    WORKFLOW_OPERATIONS.switch,
    WORKFLOW_OPERATIONS.sleep,
    WORKFLOW_OPERATIONS.parallel,
    WORKFLOW_OPERATIONS.inject,
    WORKFLOW_OPERATIONS.foreach,
    WORKFLOW_OPERATIONS.callback,
  ])

  const onDragStart = (event: DragEvent, nodeType?: string) => {
    if (!event.dataTransfer || !nodeType) {
      type.set(null)
      return null
    }

    type.set(nodeType)
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('width', String(event.currentTarget?.clientWidth))
    event.dataTransfer.setData('height', String(event.currentTarget?.clientHeight))
  }
</script>

<div class="grid grid-cols-2 gap-2">
  {#each nodes as node, index (index)}
    <div
      class="flex basis-1/2 gap-2 px-4 py-2 items-center bg-pageBg border border-strokeSoft200 rounded-lg cursor-grab"
      onclick={() => onAddNode(node.type)}
      ondragstart={(event) => onDragStart(event, node.type)}
      ondragend={() => type.set(null)}
      draggable={true}
      role="presentation"
      class:disabled={DISABLED_NODES.includes(node.type)}
      class:pointer-events-disabled={DISABLED_NODES.includes(node.type)}
    >
      <div class="p-1 bg-bgWeak50 rounded-full"><StateIcon type={node.type} /></div>
      <div class="flex flex-col gap-1 text-xs">
        <span>{node.title}</span>
      </div>
    </div>
  {/each}
</div>
