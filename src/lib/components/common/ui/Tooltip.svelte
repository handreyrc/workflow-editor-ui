<script lang="ts">
  import { Tooltip } from '@skeletonlabs/skeleton-svelte'
  import type { Snippet } from 'svelte'
  import type { PositioningOptions } from '@zag-js/popper'
  import cx from 'classnames'

  interface Props {
    content?: string
    tooltip?: Snippet
    children: Snippet
    positioning?: PositioningOptions
    className?: string
    triggerBase?: string
  }

  let openState = $state(false)

  const {
    children,
    content: tooltipContent,
    positioning,
    tooltip,
    className = '',
    triggerBase = ''
  }: Props = $props()


  $effect(() => {
    if (!tooltipContent) {
      openState = false
    }
  })
</script>

<Tooltip
  open={openState && !!tooltipContent}
  onOpenChange={(e) => (openState = e.open)}
  positioning={positioning}
  positionerBase="z-120!"
  classes={cx(className, 'flex')}
  triggerBase={cx(triggerBase, 'grow-1 flex')}
  contentBase="max-w-[300px] bg-[var(--purple-400)] text-staticWhite text-xs py-2 px-4 rounded-md"
  openDelay={0}
  closeDelay={0}
  arrow
  arrowBackground="!bg-[var(--purple-400)]"
>
  {#snippet trigger()}
    {@render children()}
  {/snippet}
  {#snippet content()}
    {#if tooltip}
      {@render tooltip()}
    {:else}
      {tooltipContent}
    {/if}
  {/snippet}
</Tooltip>
