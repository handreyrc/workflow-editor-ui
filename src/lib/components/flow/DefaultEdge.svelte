<script lang="ts">
  import { BaseEdge, EdgeLabel, type EdgeProps, getSmoothStepPath } from '@xyflow/svelte'
  import cx from 'classnames'
  import { getContext } from 'svelte'

  import { TrashIcon } from '$components/icons'
  import { Button } from '$components/common/ui'
  import type { FlowNodeContext } from '$components/flow/interfaces'

  const { ...rest }: EdgeProps = $props()

  let path = $state('')
  let labelX = $state(0)
  let labelY = $state(0)
  let isHovered = $state(false)

  const flowNodeContext: FlowNodeContext = getContext('flowNodeContext')

  $effect(() => {
    [path, labelX, labelY] = getSmoothStepPath({
      sourceX: rest.sourceX,
      sourceY: rest.sourceY,
      targetX: rest.targetX,
      targetY: rest.targetY,
      sourcePosition: rest.sourcePosition,
      targetPosition: rest.targetPosition,
      borderRadius: rest.pathOptions?.borderRadius,
      offset: rest.pathOptions?.offset
    })
  })
</script>

<BaseEdge
  {path}
  {labelX}
  {labelY}
  {...rest}
  onmouseenter={() => isHovered = true }
  onmouseleave={() => isHovered = false}
  style={rest.selected ? 'stroke-width: 2px; stroke: var(--primary-base)' : rest.style}
/>

<EdgeLabel
  x={labelX}
  y={labelY}
  onmouseenter={() => isHovered = true }
  onmouseleave={() => isHovered = false}
  class={cx('p-0.5 bg-bgSection border border-primaryBase rounded-md opacity-0 invisible transition-opacity duration-200', {
    'opacity-100! visible!': isHovered,
  })}
>
  <Button
    size="small"
    type="empty"
    className=""
    icon={TrashIcon}
    iconSize={12}
    onClick={() => {
      flowNodeContext.onDeleteTransition({
        ...rest
      })
    }}
  />
</EdgeLabel>
