<script lang="ts">
  import { onMount } from 'svelte'

  import { clickOutside } from '$lib/utils/dom'
  import type { IContextMenu } from '$lib/types/flow'

  import { PencilIcon, TrashIcon } from '$components/icons'

  interface Props {
    menu: IContextMenu
    onOptionSelect: (id: string, option: string) => void
    onClose: () => void
  }

  let { menu, onOptionSelect, onClose }: Props = $props()
  const {
    id,
    top,
    left,
    width,
  } = menu

  const APPROXIMATE_WIDTH = 130 // Approximate width of the context menu
  const leftPosition = (left + width > window.innerWidth - APPROXIMATE_WIDTH)
    ? window.innerWidth - APPROXIMATE_WIDTH
    : left + width

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose()
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })
</script>

<div
  id="nodemenu_acnhor"
  style={`top: ${top}px; left: ${leftPosition}px; transform: translateX(-${width / 5}px) translateY(calc(-100% - 10px));`}
  class="fixed contextmenu"
  use:clickOutside={onClose}
>
  <div class="bg-bgWhite0 py-2 min-w-32 rounded-md flex flex-col">
    <button
      class="flex gap-2 items-center text-left text-xs p-2 hover:bg-primaryAlpha16"
      onclick={() => onOptionSelect(id, 'edit')}
    >
      <span><PencilIcon width={12} height={12} /></span>
      Edit
    </button>
    <button
      onclick={() => onOptionSelect(id, 'delete')}
      class="flex items-center gap-2 text-left text-xs p-2 hover:bg-primaryAlpha16"
    >
      <span class="text-errorBase"><TrashIcon width={12} height={12} /></span>
      Delete
    </button>
  </div>
</div>
