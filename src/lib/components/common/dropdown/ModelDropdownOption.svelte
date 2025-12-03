<script lang="ts">
  import type { DropDownOption } from '$lib/types/ui'

  import { CheckIcon } from '$components/icons'
  import ToolImage from '$components/common/ToolImage.svelte'

  interface Props {
    isSelected?: boolean
    option: DropDownOption
    checkIconSize?: number
  }

  let { isSelected = false, option, checkIconSize }: Props = $props()
</script>

<div class="flex items-center text-xs overflow-hidden">
  <span class="icon shrink-0"><ToolImage iconName={option.toolName} /></span>
  <span class="text-xs leading-5 truncate">{option.label}</span>
</div>
{#if isSelected}
  <span class="text-primaryBase"><CheckIcon width={checkIconSize} height={checkIconSize} /></span>
{/if}

<style lang="postcss">
  @reference '$lib/styles/tailwind.css';

  .icon {
    @apply w-4 h-4 mr-2;

    :global(svg) {
      max-width: 100%;
      max-height: 100%;
    }
  }
</style>
