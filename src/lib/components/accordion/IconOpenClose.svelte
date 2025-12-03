<script lang="ts">
  import { ArrowDownLineIcon } from '$components/icons'

  interface Props {
    type?: 'open' | 'closed'
  }

  let { type = 'open' }: Props = $props()
</script>

{#if type === 'open'}
  <span class="block rotate-x-180"><ArrowDownLineIcon width={16} height={16} /></span>
{/if}

{#if type === 'closed'}
  <ArrowDownLineIcon width={16} height={16} />
{/if}
