<script lang="ts">
  import { goto } from '$app/navigation'

  import type { Breadcrumb } from '$lib/types'

  interface Props {
    breadcrumbs?: Array<Breadcrumb>
  }

  const { breadcrumbs = [] }: Props = $props()

  const onClickLink = (link: string) => {
    goto(link)
  }
</script>

<nav aria-label="breadcrumb" class="flex items-center flex-wrap text-sm text-gray-700">
  {#each breadcrumbs as crumb, index (crumb)}
    <span class="flex items-center text-base">
      {#if index < breadcrumbs.length - 1}
        <a
          href={crumb.link}
          class="font-medium text-textDisabled300"
          onclick={(e) => {
            e.preventDefault()
            onClickLink(crumb.link)
          }}>{crumb.title}</a>
        <span class="mx-1 text-textDisabled300">/</span>
      {:else}
        <span class="text-textStrong950 font-semibold">{crumb.title}</span>
      {/if}
    </span>
  {/each}
</nav>
