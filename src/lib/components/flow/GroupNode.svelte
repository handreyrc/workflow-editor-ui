<script lang="ts">
  import { Handle, Position, type NodeProps, NodeResizer } from '@xyflow/svelte'

  import StateIcon from '$components/common/StateIcon.svelte'
  import { DotsIcon } from '$components/icons'
  import { Button } from '$components/common/ui'

  type $$Props = NodeProps

  interface Props {
    targetPosition: Position
    sourcePosition: Position
    data: $$Props['data']
    selected: $$Props['selected']
  }

  let {
    data,
    selected,
    targetPosition = Position.Top,
    sourcePosition = Position.Bottom,
  }: Props = $props()

  const label = data.name
</script>

<NodeResizer minWidth={160} minHeight={120} isVisible={selected} />
<div
  class="w-full h-full relative rounded-md"
  class:selected={selected}
  role="presentation"
>
  <div class="overflow-hidden h-full">
    <div class="mb-2 flex items-center justify-between gap-2">
      <div class="flex items-center gap-1">
        <span class="text-primaryBase"><StateIcon type="subflow" width={16} height={16} /></span>
        <span class="text-xs font-semibold">Subflow</span>
      </div>
    </div>
    <div class="text-left font-poppins text-xs font-medium text-textStrong950 overflow-hidden overflow-ellipsis">
      {label}
    </div>
  </div>
</div>

<Handle
  type="target"
  position={targetPosition}
/>

<style lang="postcss">
  :global {
    .svelte-flow {
      .svelte-flow__node-group {
        background: var(--bg-soft-200);

        &.highlight {
          background: var(--primary-alpha-10);
        }
      }
    }
  }
</style>
