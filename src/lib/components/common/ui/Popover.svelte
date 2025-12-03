<script lang="ts">
  import { Popover as SkeletonPopover } from '@skeletonlabs/skeleton-svelte'
  import type { Snippet } from 'svelte'
  import type { PositioningOptions } from '@zag-js/popper'
  import cx from 'classnames'

  interface Props {
    isOpen: boolean
    isDisabled?: boolean
    onOpenChange: (isOpen: boolean) => void
    children: Snippet
    button: Snippet
    arrow?: Snippet
    positioning?: PositioningOptions
    classes?: string
  }

  let {
    isOpen,
    isDisabled,
    onOpenChange,
    children,
    button,
    arrow,
    positioning = { placement: 'bottom' },
    classes
  }: Props = $props()
</script>

<div
  class="popover-wrapper"
  onclick={(e) => e.stopPropagation()}
  role="presentation"
>
  <SkeletonPopover
    open={isOpen}
    onOpenChange={(e) => onOpenChange(e.open)}
    positioning={positioning}
    classes={classes}
    triggerClasses={cx('w-full', { 'isDisabled': isDisabled }  )}
    zIndex="125"
    autoFocus
    closeOnInteractOutside
  >
    {#snippet trigger()}
      {@render button?.()}
    {/snippet}
    {#snippet content()}
      {@render arrow?.()}
      {@render children?.()}
    {/snippet}
  </SkeletonPopover>
</div>

<style lang="postcss">
  .popover-wrapper {
    :global(.isDisabled) {
      pointer-events: none;
      opacity: 0.6;
    }
  }
</style>
