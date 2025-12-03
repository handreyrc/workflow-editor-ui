<script lang="ts">
  import { type Snippet } from 'svelte'
  import cx from 'classnames'

  import { clickOutside } from '$lib/utils/dom'

  import { CloseIcon, SaveIcon } from '$components/icons'

  interface Props {
    className?: string
    inputClassName?: string
    initialValue?: string
    content?: Snippet
    placeholder?: string
    isEditing?: boolean
    validate?: (val: string) => boolean
    onCancel: () => void
    onApply: (val: string) => void
  }

  let {
    isEditing = false,
    className = '',
    inputClassName = '',
    initialValue = '',
    placeholder,
    content,
    validate,
    onCancel,
    onApply
  }: Props = $props()

  let value = $state(initialValue)

  let isValid = $state(validate?.(initialValue))
  let ref = $state<HTMLInputElement>()

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleApply(value)
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  const handleApply = (value: string) => {
    if (!isValid) return
    onApply(value)
  }

  $effect(() => {
    isValid = validate?.(value)
  })

  $effect( () => {
    if (isEditing) {
      value = initialValue
      ref?.focus()
    }
  })
</script>


{#if isEditing}
  <div
    class="flex items-center max-w-full min-w-0 gap-0.5"
    onkeydown={handleKeyDown}
    role="presentation"
    onclick={(e) => e.stopPropagation()}
    use:clickOutside={() => onCancel()}
  >
    <input
      type="text"
      bind:value={value}
      bind:this={ref}
      class={cx('outline-0 px-2 border border-strokeSub300 rounded-xs min-w-0', inputClassName)}
      {placeholder}
    />

    <div class="shrink-0 flex items-center">
      <button
        class="button button__empty text-errorBase center w-5 h-5"
        onclick={(e) => {
          onCancel()
        }}
        type="button"
      >
        <CloseIcon />
      </button>
      <button
        class="button button__empty text-primaryBase center w-5 h-5"
        onclick={() => handleApply(value)}
        disabled={!isValid}
        type="button"
      >
        <SaveIcon width={10} height={10} />
      </button>
    </div>
  </div>
{:else}
  {@render content?.()}
{/if}


