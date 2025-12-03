<script lang="ts">
  import cx from 'classnames'
  import { onDestroy, onMount, type Snippet } from 'svelte'
  import { fly, fade } from 'svelte/transition'

  import CloseIcon from '$components/icons/CloseIcon.svelte'

  interface Props {
    isOpen?: boolean
    overlay?: boolean
    className?: string
    header?: Snippet
    body?: Snippet
    footer?: Snippet
    onClose: () => void
  }

  let {
    isOpen = false,
    overlay = true,
    className = '',
    header,
    body,
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
  {#if overlay}
    <div
      class="fixed inset-0 overlay z-109"
      onclick={onClose}
      role="presentation"
      in:fade={{ duration: 150 }}
      out:fade={{ duration: 150 }}
    ></div>
  {/if}
  <div
    class={cx(className, 'flyout', {
      'z-111!': overlay
    })}
    in:fly={{ x: 200, duration: 150 }}
    out:fly={{ x: 200, duration: 150 }}
  >
    {#if header}
      <div class="flyout__header">
        {@render header?.()}
        <button onclick={onClose} class="text-iconSub600 absolute top-4 right-4"><CloseIcon /></button>
      </div>
    {/if}

    <div class="flyout__body flex-1 p-4 overflow-auto">
      {@render body?.()}
    </div>

    {#if footer}
      <div class="flyout__footer p-4 border-t border-t-strokeSoft200 ">
        {@render footer?.()}
      </div>
    {/if}
  </div>
{/if}

<style lang="postcss">
  @reference '$lib/styles/tailwind.css';

  .flyout {
    @apply fixed right-[0] top-[0] h-full min-w-[480px] bg-bgSection z-110 flex flex-col;
  }

  .flyout__header {
    @apply p-4 border-b border-b-strokeSoft200 flex justify-between items-center relative;
  }
</style>
