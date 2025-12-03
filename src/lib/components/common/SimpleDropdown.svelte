<script lang="ts">
  import type { PositioningOptions } from '@zag-js/popper'
  import cx from 'classnames'

  import type { DropDownOption } from '$lib/types/ui'

  import { ArrowDownLineIcon, CheckIcon, PlusIcon } from '$components/icons'
  import Popover from '$components/common/ui/Popover.svelte'

  interface Props {
    buttonClassName?: string
    placeholder?: string
    positioning?: PositioningOptions
    options?: DropDownOption[]
    selected?: DropDownOption | undefined
    plusOption?: DropDownOption | undefined
    disabled?: boolean
    componentForSelected?: boolean
    onChange: (option: DropDownOption) => void
    onAdd?: () => void
  }

  let {
    buttonClassName = '',
    placeholder,
    positioning,
    options = [],
    selected = $bindable(undefined),
    plusOption = undefined,
    disabled = false,
    componentForSelected = false,
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
</script>

<Popover
  isOpen={isOpen}
  onOpenChange={onOpenChange}
  classes={cx('w-full center', { 'disabled': disabled })}
  positioning={positioning}
>
  {#snippet button()}
    <div
      class={cx(buttonClassName, 'dropdown__button')}
      class:isOpen={isOpen}
    >
      {#if componentForSelected && selected?.component}
        {@const Component = selected.component}
        {#key selected.id}
          <div class="w-full h-full text-xs px-1.5 truncate">
             <Component
               option={selected}
             />
          </div>
          {/key}
      {:else}
        <span class="w-full h-full text-xs px-2.5 truncate">
          {selected?.label || placeholder || ''}
        </span>
      {/if}
      <span><ArrowDownLineIcon /></span>
    </div>
  {/snippet}
  <ul class="w-full max-h-[300px] p-1 bg-bgWhite0 text-textStrong950 rounded-lg overflow-hidden overflow-y-auto border border-strokeSoft200">
    {#each options as option (option.id)}
      <li
        class="dropdown__option"
        onclick={() => selectOption(option)}
        role="presentation"
        class:isDisabled={option.disabled}
      >
        {#if option.component}
          {@const Component = option.component}
          <Component
            isSelected={selected?.id === option.id}
            option={option}
            checkIconSize={12}
          />
        {:else}
          <span class="text-xs leading-5">{option.label}</span>
          {#if selected?.id === option.id}
            <span class="text-primaryBase"><CheckIcon width={12} height={12} /></span>
          {/if}
        {/if}
      </li>
    {/each}
    {#if plusOption}
      <li
        class="px-2 py-1.5 hover:bg-fadedLight border-b last:border-b-0 border-b-strokeSoft200 cursor-pointer flex items-center justify-between"
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
  @reference '$lib/styles/tailwind.css';

  .dropdown__button {
    @apply flex items-center justify-between relative overflow-hidden bg-transparent transition-colors cursor-pointer;
  }

  .dropdown__button.isDisabled {
    pointer-events: none;
  }

  .dropdown__button.isDisabled > * {
    opacity: 0.5;
  }

  .dropdown__option {
    @apply max-w-[200px] overflow-hidden whitespace-nowrap px-2 py-1 hover:bg-fadedLight border-b
    last:border-b-0 border-b-strokeSoft200 cursor-pointer flex items-center justify-between gap-2;
  }

  .dropdown__option.isDisabled {
    opacity: 0.5;
    pointer-events: none;
  }
</style>
