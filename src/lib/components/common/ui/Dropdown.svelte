<script lang="ts">
  import type { PositioningOptions } from '@zag-js/popper'
  import cx from 'classnames'

  import type { DropDownOption } from '$lib/types/ui'

  import Tooltip from '$components/common/ui/Tooltip.svelte'
  import InfoIcon from '$components/icons/InfoIcon.svelte'
  import { ArrowDownLineIcon, CheckIcon, PlusIcon } from '$components/icons'

  import Popover from './Popover.svelte'

  interface Props {
    className?: string
    label?: string
    positioning?: PositioningOptions
    options?: DropDownOption[]
    emptyText?: string
    selected?: DropDownOption | undefined
    plusOption?: DropDownOption | undefined
    required?: boolean
    tooltip?: string
    disabled?: boolean
    onChange: (option: DropDownOption) => void
    onAdd?: () => void
  }

  let {
    className = '',
    label,
    options = [],
    emptyText,
    selected = $bindable(undefined),
    plusOption = undefined,
    required = false,
    tooltip = '',
    disabled = false,
    onChange,
    onAdd
  }: Props = $props()

  let isOpen = $state(false)

  const selectOption = (option: DropDownOption) => {
    selected = option
    onChange(option)

    isOpen = false
  }

  const onOpenChange = (value: boolean) => {
    isOpen = value
  }

  export const close = () => {
    isOpen = false
  }
</script>

<Popover
  isOpen={isOpen}
  onOpenChange={onOpenChange}
  classes={cx('w-full', { 'disabled': disabled })}
  positioning={{
    placement: 'bottom',
    sameWidth: true,
    gutter: 4
  }}
>
  {#snippet button()}
    <div
      class={cx('dropdown__button relative rounded-md border bg-transparent border-strokeSub300 flex flex-col transition-colors cursor-pointer', className)}
      class:isOpen={isOpen}
    >
      {#if label}
        <div
          class="flex items-center px-2.5 pt-0.5 text-sm leading-[20px]"
        >
          <span class="text-[11px]">{label || ''}</span>
          <span class="text-errorBase ml-1">{required ? '*' : ''}</span>
          {#if tooltip}
            <Tooltip
              content={tooltip}
            >
              <span class="ml-1 text-iconSub600"><InfoIcon width={16} height={16} /></span>
            </Tooltip>
          {/if}
        </div>
      {/if}
      <div class="selectedOption h-6 text-xs px-2.5 pr-12 flex items-center">
        {selected?.label || ''}
      </div>

      <span
        class="absolute right-2 top-1/2 -translate-y-1/2"
        class:rotate-180={isOpen}
      ><ArrowDownLineIcon /></span>
    </div>
  {/snippet}
  <ul class="w-full p-2 bg-bgWhite0 text-textStrong950 rounded-lg overflow-hidden border border-strokeSoft200">
    {#if options.length === 0 && emptyText}
      <li class="px-2 py-2 text-xs text-textSub600 text-center">
        {emptyText}
      </li>
    {/if}
    {#each options as option (option.id)}
      <li
        class="dropdown__option px-2 py-2 hover:bg-fadedLight border-b last:border-b-0 border-b-strokeSoft200 cursor-pointer flex items-center justify-between"
        onclick={() => selectOption(option)}
        role="presentation"
        class:isDisabled={option.disabled}
      >
        {#if option.component}
          {@const Component = option.component}
          <Component
            isSelected={selected?.id === option.id}
            option={option}
          />
        {:else}
          <span class="text-xs leading-5">{option.label}</span>
          {#if selected?.id === option.id}
            <span class="text-primaryBase"><CheckIcon /></span>
          {/if}
        {/if}
      </li>
    {/each}
    {#if plusOption}
      <li
        class="px-4 py-3 hover:bg-fadedLight border-b last:border-b-0 border-b-strokeSoft200 cursor-pointer flex items-center justify-between"
        onclick={onAdd}
        role="presentation"
      >
        <div class="flex items-center">
          <span class="mr-2 text-iconSub600"><PlusIcon width={12} height={12} /></span>
          <span class="text-xs leading-5">{plusOption.label}</span>
        </div>
      </li>
    {/if}
  </ul>
</Popover>

<style lang="postcss">
  .dropdown__button.isOpen {
    border-color: var(--primary-base) !important;
    background: var(--bg-white-0) !important;
  }

  .dropdown__button.isDisabled {
    pointer-events: none;
  }

  .dropdown__button.isDisabled > * {
    opacity: 0.5;
  }

  .dropdown__option.isDisabled {
    opacity: 0.5;
    pointer-events: none;
  }
</style>
