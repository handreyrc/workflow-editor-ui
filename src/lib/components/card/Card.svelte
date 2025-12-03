<script lang="ts">
  import { type Snippet } from 'svelte'
  import cx from 'classnames'

  interface Props {
    className?: string
    title?: Snippet
    isDisabled?: boolean
    description?: Snippet
    children?: Snippet
    onClick?: () => void
    testId?: string
  }

  let {
    className = '',
    title,
    description,
    children,
    isDisabled,
    onClick,
    testId
  }: Props = $props()
</script>

<div
  class={cx(className, 'w-full grow-1 p-3 overflow-hidden bg-bgSection border border-strokeSub300 rounded-lg cursor-pointer hover:border-primaryBase hover:bg-primaryAlpha16')}
  class:disabled={isDisabled}
  role="presentation"
  onclick={onClick}
  data-testid={testId}
>
  {#if title}
    <div class="mb-4">
      <div class="flex items-center gap-2 line-clamp-2">
        {@render title?.()}
      </div>
    </div>
  {/if}

  {#if description}
    <p class="text-xs line-clamp-2" >
      {@render description?.()}
    </p>
  {/if}

  {#if children}
    {@render children?.()}
  {/if}
</div>
