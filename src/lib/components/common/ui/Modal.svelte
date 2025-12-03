<script lang="ts">
  import { onDestroy, onMount, type Snippet } from 'svelte'
  import { fly, fade } from 'svelte/transition'
  import cx from 'classnames'

  import { clickOutside } from '$lib/utils/dom'
  import { portal } from '$lib/utils/dom/portal'
  import { Portals } from '$lib/constants/ui'

  interface Props {
    isOpen?: boolean
    className?: string
    header?: Snippet
    children?: Snippet
    footer?: Snippet
    onClose: () => void
  }

  let {
    isOpen = false,
    className = '',
    header,
    children,
    footer,
    onClose
  }: Props = $props()

  const handleKeydown = (event: KeyboardEvent) => {
    if (isOpen && event.key === 'Escape') {
      event.stopImmediatePropagation()
      onClose()
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
</script>

{#if isOpen}
  <div
    use:portal={Portals.Modal}
    class="fixed inset-0 center z-201"
  >
    <div
      class="absolute inset-0 overlay z-202"
      in:fade={{ duration: 150 }}
    ></div>

    <div
      class={cx(className, 'relative bg-pageBg rounded-lg max-w-[680px] mx-4 z-203 p-6')}
      use:clickOutside={onClose}
      in:fly={{ y: 100, duration: 150 }}
      out:fly={{ y: 100, duration: 150 }}
    >
      {#if header}
        <div class="pb-6">
          {@render header?.()}
        </div>
      {/if}

      {@render children?.()}

      {#if footer}
        <div class="pt-6 flex justify-end items-center">
          {@render footer?.()}
        </div>
      {/if}
    </div>
  </div>
{/if}

