<script lang="ts">
  import { TagsInput } from '@skeletonlabs/skeleton-svelte'

  import Tooltip from '$components/common/ui/Tooltip.svelte'
  import InfoIcon from '$components/icons/InfoIcon.svelte'

  interface Props {
    name: string
    label?: string
    value?: string[]
    placeholder?: string
    errorMessage?: string
    required?: boolean
    tooltip?: string
    disabled?: boolean
    onChange: (value: string[]) => void
  }

  let {
    name,
    label,
    value = $bindable([]),
    placeholder,
    errorMessage,
    required = false,
    tooltip,
    disabled,
    onChange
  }: Props = $props()
</script>

<div
  class="form-field-wrapper rounded-md border bg-transparent border-strokeSub300 flex flex-col"
  class:error={errorMessage}
>
  <label
    class="flex items-center px-2.5 pt-0.5 text-sm leading-[20px]"
    class:opacity-50={disabled}
    for={name}
  >
    <span class="text-[11px]">{label}</span>
    {#if required}
      <span class="text-errorBase ml-1 mr-1">*</span>
    {/if}

    {#if tooltip}
      <Tooltip content={tooltip}>
        <span class="ml-0.5 text-iconSub600 mt-[-2px]"><InfoIcon width={16} height={16} /></span>
      </Tooltip>
    {/if}
  </label>
  <TagsInput
    {name}
    value={value}
    onValueChange={(e) => onChange(e.value)}
    placeholder={placeholder}
    base="p-0!"
    inputBase="outline-0 text-textStrong950 placeholder:text-textSoft400 text-xs px-2.5 py-1 w-full"
    tagClasses="overflow-hidden"
    tagListBase="px-2.5 py-1 flex gap-1 flex-wrap"
    tagBase="itemTag text-xs py-1 px-2 whitespace-nowrap overflow-ellipsis max-w-60 flex gap-2 rounded-sm"
    tagBackground="bg-bgSoft200"
    {disabled}
  />
</div>

<style lang="postcss">
  .form-field-wrapper {
    :global {
      .itemTag {
        span {
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
