<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import cx from 'classnames'

  import { Button } from '$components/common/ui'

  interface Props {
    children: Snippet
    maxHeight?: number
    className?: string
    bgColor?: string
  }

  let { children, maxHeight = 120, className, bgColor = 'var(--bg-section)' }: Props = $props()
  let isExpanded = $state(false)
  let overflow = $state(false)

  let container = $state<HTMLDivElement>()

  onMount(() => {
    const checkOverflow = () => {
      if (container!.scrollHeight > maxHeight) {
        overflow = true
      }
    }

    requestAnimationFrame(checkOverflow)
  })
</script>

<div
  class={cx('overflow-hidden relative', className)}
  style="max-height: {isExpanded || !overflow ? 'none' : `${maxHeight}px`}"
  bind:this={container}
>
  {@render children()}
  {#if overflow}
    <div
      class="w-full flex justify-end pt-2 bottom-0"
      style={overflow && !isExpanded ? `position: absolute; padding-top: 32px; background-image: linear-gradient(transparent, ${bgColor} 70%, ${bgColor})` : ''}
    >
      <Button
        type="empty"
        size="small"
        onClick={() => {
          isExpanded = !isExpanded
        }}
        className="text-xs"
      >
        Show {isExpanded ? 'Less' : 'More'}
      </Button>
    </div>
  {/if}
</div>
