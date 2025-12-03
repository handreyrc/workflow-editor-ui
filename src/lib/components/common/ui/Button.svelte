<script lang="ts">
  import type { Component, Snippet } from 'svelte'
  import cx from 'classnames'

  interface Props {
    fill?: boolean
    className?: string
    isLoading?: boolean
    isDisabled?: boolean
    size?: 'small' | 'medium'
    type?: 'primary' | 'secondary' | 'danger' | 'empty'
    onClick: (event: MouseEvent) => void
    icon?: Component<Record<string, any>>
    iconSize?: number
    iconPosition?: 'left' | 'right'
    children?: Snippet
  }

  let {
    fill = true,
    className = '',
    isLoading = false,
    type = 'primary',
    onClick,
    isDisabled = false,
    icon,
    iconSize = 16,
    size = 'medium',
    iconPosition = 'left',

    children
  }: Props = $props()
</script>

<button
  class={cx(className, 'button', {
    'button__primary': type === 'primary',
    'button__secondary': type === 'secondary',
    'button__danger': type === 'danger',
    'button__empty': type === 'empty',
    'button--sm': size === 'small',
    'button__primary--outline': type === 'primary' && !fill,
    'button__danger--outline': type === 'danger' && !fill,
  })}
  onclick={onClick}
  disabled={isDisabled}
>
  {#if isLoading || icon}
    <span class={cx('flex shrink-0', { 'order-1': iconPosition === 'right'  })}>
      {#if isLoading}
        <span class="loader" style="width: {iconSize}px; height: {iconSize}px;"></span>
      {:else}
        {#if icon}
          {@const Icon = icon}
          <Icon width={iconSize} height={iconSize} />
        {/if}
      {/if}
    </span>
  {/if}

  {@render children?.()}
</button>

<style lang="postcss">
  .loader {
    border: 1px solid currentColor;
    border-top: 1px solid transparent;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
  }
</style>
