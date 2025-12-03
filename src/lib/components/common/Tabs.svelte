<script lang="ts">
  import cx from 'classnames'

  interface Props {
    type?: 'filled' | 'outlined'
    selected?: string
    tabs?: Array<{ label: string, value: string }>
    onSelect?: (value: string) => void
    wrapperClassName?: string
    tabClassName?: string
  }

  let {
    type = 'filled',
    selected = '',
    tabs = [],
    onSelect,
    wrapperClassName = '',
    tabClassName = '',
  }: Props = $props()
</script>

<div
  class={cx('flex overflow-y-auto', wrapperClassName, {
    'bg-bgSoft200 rounded-md p-1': type === 'filled',
    'outlined border-b border-strokeSoft200': type === 'outlined',
  })}
>
  {#each tabs as tab}
    <button
      class={cx('whitespace-nowrap', tabClassName, {
        'filled rounded-md min-w-48 h-6 p-1 text-textSoft400 text-xs font-medium': type === 'filled',
        'outlined py-2 text-textSub600 text-sm hover:text-textStrong950 transition-colors border-b border-transparent': type === 'outlined',
      })}
      class:selected={selected === tab.value}
      onclick={() => onSelect?.(tab.value)}
    >
      {tab.label}
    </button>
  {/each}
</div>

<style lang="postcss">
  .selected {
    &.filled {
      background-color: var(--primary-base) !important;
      color: var(--static-white) !important;
    }
    &.outlined {
      color: var(--text-strong-950) !important;
      border-bottom: 2px solid var(--primary-base) !important;
    }
  }
</style>
