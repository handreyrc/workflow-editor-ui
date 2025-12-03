<script lang="ts">
  import { onMount, type Snippet } from 'svelte'

  import { goto } from '$app/navigation'
  import { page } from '$app/state'

  import { createPortal } from '$lib/utils/dom/portal'
  import { Portals } from '$lib/constants/ui'

  import Tabs from '$components/common/Tabs.svelte'
  import { Breadcrumbs, PageHeader } from '$components/header'

  interface Props {
    children?: Snippet
  }

  let { children }: Props = $props()

  let selectedTab = $state('available')

  const handleTabChange = (value: string) => {
    if (value === 'provisioned') {
      goto('/tool/provisioned')
      return
    }

    if (value === 'available') {
      goto('/tool/available')
      return
    }
  }

  $effect(() => {
    selectedTab = page.route.id?.replace('/tool/', '') || 'available'
  })
</script>

<PageHeader>
  {#snippet breadcrumbs()}
    <Breadcrumbs breadcrumbs={[{ link: '', title: 'Credentials' }]} />
  {/snippet}
  {#snippet content()}
    <div use:createPortal={Portals.PageHeader}></div>
  {/snippet}
</PageHeader>

<div class="mx-4 my-2 flex">
  <Tabs
    selected={selectedTab}
    tabs={[
      { label: 'Available', value: 'available' },
      { label: 'Provisioned', value: 'provisioned' },
    ]}
    onSelect={handleTabChange}
  />
</div>

<div class="p-4 grow flex flex-col">
  {@render children?.()}
</div>
