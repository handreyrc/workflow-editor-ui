<script lang="ts">
  import { Handle, Position, type NodeProps, type Node } from '@xyflow/svelte'
  import { Specification } from '@severlessworkflow/sdk-typescript'
  import cx from 'classnames'
  import { getContext } from 'svelte'

  import type { WorkflowState } from '$lib/types/workflows'
  import { WORKFLOW_OPERATIONS } from '$lib/constants/workflow'

  import StateIcon from '$components/common/StateIcon.svelte'
  import { Button } from '$components/common/ui'
  import { DotsIcon } from '$components/icons'
  import type { FlowNodeContext } from '$components/flow/interfaces'

  type $$Props = NodeProps

  interface Props {
    targetPosition: Position
    sourcePosition: Position
    id: $$Props['id']
    data: $$Props['data']
    selected: $$Props['selected']
  }

  let {
    id,
    data,
    selected,
    targetPosition = Position.Top,
    sourcePosition = Position.Bottom,
  }: Props = $props()

  const label = data.name
  const type = data.type as string
  const nodeState = data.state as WorkflowState

  let isTransition = $state(false)
  const flowNodeContext: FlowNodeContext = getContext('flowNodeContext')
  let isMenuDisabled = flowNodeContext.isMenuDisabled

  const isConnectable = !(nodeState instanceof Specification.Databasedswitchstate || nodeState instanceof Specification.Eventbasedswitchstate)

  const operation = type && type in WORKFLOW_OPERATIONS
    ? WORKFLOW_OPERATIONS[type as keyof typeof WORKFLOW_OPERATIONS]
    : undefined

  const handleMenuClick = (event: MouseEvent) => {
    flowNodeContext?.onNodeContextMenu?.({ id, data, targetPosition, sourcePosition } as Node, event)
  }
</script>

<div
  class="w-full h-full min-w-40 bg-pageBg p-2 py-3 relative border border-strokeSub300 rounded-md"
  class:selected={selected}
  role="presentation"
>
  {#if data.start}
    <div class="absolute px-1 py-0.5 rounded-sm bg-successBase text-staticWhite left-2 top-0 -translate-y-1/2 text-[11px] uppercase">start</div>
  {/if}
  <div class="overflow-hidden h-full">
    <div class="mb-2 flex items-center justify-between gap-2">
      <div class="flex items-center gap-1">
        <span class="text-primaryBase"><StateIcon type={type} width={16} height={16} /></span>
        <span class="text-xs font-semibold">{operation?.title || ''}</span>
      </div>

      <Button
        type="empty"
        icon={DotsIcon}
        onClick={handleMenuClick}
        isDisabled={$isMenuDisabled}
      />
    </div>
    <div class="font-poppins text-sm font-medium text-textStrong950 min-w-28 max-w-40 overflow-hidden overflow-ellipsis">
      {label}
    </div>
  </div>
  {#if data.end}
    <div class="absolute px-1 py-0.5 rounded-sm bg-errorBase text-staticWhite right-2 bottom-0 translate-y-1/2 text-[11px] uppercase">end</div>
  {/if}
</div>

<Handle
  id={id}
  type="source"
  position={sourcePosition}
  isConnectable={isConnectable && !isTransition}
  class={cx( { 'opacity-35': !isConnectable })}
/>

<Handle
  id={id}
  type="target"
  position={targetPosition}
  isConnectable
/>

<style lang="postcss">
  .selected {
    border-radius: var(--radius-8, 8px);
    border: 1px solid rgba(120, 77, 239, 0.50);
    box-shadow: 0 0 0 2px var(--bg-white-0, #181B25), 0 0 0 4px var(--primary-alpha-10, rgba(120, 77, 239, 0.10));
  }
</style>

