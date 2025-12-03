<script lang="ts">
  import { onDestroy, onMount, type Snippet } from 'svelte'

  import { page } from '$app/state'
  import { goto } from '$app/navigation'

  import { getProjectAction, selectedProjectSelector, setSelectedProject } from '$lib/stores/projectsStore'
  import { createPortal } from '$lib/utils/dom/portal'
  import { Portals } from '$lib/constants/ui'

  import GlobalLoader from '$components/loading/GlobalLoader.svelte'
  import { Breadcrumbs, PageHeader } from '$components/header'

  import Tabs from './Tabs.svelte'

  interface Props {
    children?: Snippet
  }

  let { children }: Props = $props()

  let selectedTab = $state('workflows')
  let isTabsHidden = $state(false)

  onMount(async () => {
    const data = await getProjectAction(page.params.id)

    if (!data) {
      goto('/project')
      return
    }
  })

  onDestroy(() => {
    setSelectedProject(null)
  })

  const handleSelectTab = (value: string) => {
    selectedTab = value
    goto(`/project/${page.params.id}/${value}`)
  }

  $effect(() => {
    selectedTab = page.route.id?.match(/\/project\/[^/]+\/([^/]+)(?:\/[^/]*)?$/)?.[1] || 'workflows'

    // we do not display tabs if we are on a nested route
    isTabsHidden = Object.keys(page.params).length > 1
  })
</script>

{#if !isTabsHidden}
  <PageHeader>
    {#snippet breadcrumbs()}
      <Breadcrumbs breadcrumbs={[
        { link: '/project', title: 'Projects' },
        { link: '', title: $selectedProjectSelector?.name || '' }
      ]} />
    {/snippet}
    {#snippet content()}
      <div use:createPortal={Portals.PageHeader}></div>
    {/snippet}
  </PageHeader>

  <div class="px-4 border-b border-strokeSoft200">
    <Tabs
      selectedTab={selectedTab}
      onSelect={handleSelectTab}
    />
  </div>
{/if}
{#if $selectedProjectSelector}
  <div class="grow flex flex-col min-h-0">
    {@render children?.()}
  </div>
{:else}
  <GlobalLoader internalLoader />
{/if}




