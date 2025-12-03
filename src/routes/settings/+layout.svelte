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

  let selectedTab = $derived(page.route.id?.replace('/settings/', '') || 'account')

  const handleTabChange = (value: string) => {
    if (value === 'account') {
      goto('/settings/account')
      return
    }

    if (value === 'billing') {
      goto('/settings/billing')
      return
    }

    if (value === 'team') {
      goto('/settings/team')
      return
    }
  }


</script>

<PageHeader>
  {#snippet breadcrumbs()}
    <Breadcrumbs breadcrumbs={[{ link: '', title: 'Settings' }]} />
  {/snippet}
  {#snippet content()}
    <div use:createPortal={Portals.PageHeader}></div>
  {/snippet}
</PageHeader>

<div class="mx-4 my-2 flex">
  <Tabs
    selected={selectedTab}
    tabs={[
      { label: 'Account', value: 'account' },
      { label: 'Billing', value: 'billing' },
      { label: 'Team', value: 'team' },
    ]}
    onSelect={handleTabChange}
  />
</div>

<div class="p-4 grow flex flex-col">
  {@render children?.()}
</div>
