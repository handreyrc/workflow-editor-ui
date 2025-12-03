<script lang="ts" generics="T">
  import ToolImage from '$components/common/ToolImage.svelte'

  interface Props {
    row: Record<string, any>
  }

  const { row }: Props = $props()
</script>

{#if row?.toolName}
  <div class="flex items-center">
    <div class="bg-bgWhite0 p-2 w-8 h-8 center rounded-full border border-strokeSoft200 mr-2">
      <ToolImage iconName={row.schema} />
    </div>
    {row.toolName}
  </div>
{/if}
