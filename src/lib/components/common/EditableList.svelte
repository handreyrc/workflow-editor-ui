<script lang="ts" generics="T">
  import { fade } from 'svelte/transition'

  import { Button } from '$components/common/ui'
  import { PencilIcon, TrashIcon } from '$components/icons'

  interface Props {
    items: Array<T>
    onEdit: (item: T) => void
    onDelete: (item: T) => void
    getName?: (item: T) => string
    isDraggable?: boolean
    onReorder?: (items: Array<T>) => void
  }

  let {
    items,
    onEdit,
    onDelete,
    getName,
    isDraggable,
    onReorder
  }: Props = $props()

  let dragSrcIndex = $state<number>()
  let draggingId = $state<string>()

  const handleDragStart = (event: DragEvent, index: number, id: string) => {
    dragSrcIndex = index
    draggingId = id

    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', String(index))
      event.dataTransfer.effectAllowed = 'move'
    }
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer!.dropEffect = 'move'
  }

  const handleDrop = (event: DragEvent, index: number) => {
    event.preventDefault()
    const fromIndex = dragSrcIndex
    if (fromIndex === undefined || fromIndex === index) return

    const updated = [...items]
    const [movedItem] = updated.splice(fromIndex, 1)
    updated.splice(index, 0, movedItem)

    draggingId = undefined
    dragSrcIndex = undefined

    onReorder?.(updated)
  }
</script>

{#each items as item, index}
  {@const label = getName ? getName(item) : item.name}
  <div
    class="bg-pageBg flex items center justify-between rounded-md p-2 border border-strokeSoft200 mb-2"
    class:bg-pageBgSoft={label === draggingId}
    class:cursor-grab={isDraggable}
    draggable={isDraggable}
    ondragstart={(event) => handleDragStart(event, index, label)}
    ondragover={isDraggable ? handleDragOver : undefined}
    ondrop={(event) => isDraggable && handleDrop(event, index)}
    transition:fade={{ duration: 100 }}
    role="presentation"
  >
    <div class="text-sm font-semibold">
      {label}
    </div>
    <div class="flex">
      <Button type="empty" onClick={() => onEdit(item)} icon={PencilIcon} />
      {#if item.canBeDeleted !== false}
        <Button className="text-errorDark" type="empty" onClick={() => onDelete(item)} icon={TrashIcon} />
      {/if}
    </div>
  </div>
{/each}
