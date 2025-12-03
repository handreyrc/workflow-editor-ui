<script lang="ts">
  import { derived, writable } from 'svelte/store'
  import { onMount } from 'svelte'

  import { goto } from '$app/navigation'
  import { page } from '$app/state'

  import type { Column } from '$lib/types/table'
  import type { Deployment } from '$lib/types/deployment'
  import { deploymentsDataSelector, getDeploymentsAction } from '$lib/stores/deploymentsStore'
  import { theme, Theme } from '$lib/services/themeService'

  import GlobalLoader from '$components/loading/GlobalLoader.svelte'
  import Table from '$components/common/table/Table.svelte'
  import SearchBar from '$components/common/SearchBar.svelte'

  import EmptyImage from '$assets/images/emptyintegration.svg'
  import EmptyImageLight from '$assets/images/emptyintegration_light.svg'

  import DeploymentStatusCell from './DeploymentStatusCell.svelte'


  let isPageLoading = $state(true)
  let search = writable('')

  let projectId = page.params?.id

  const columns: Column<Deployment>[] = [
    { key: 'deploymentId', label: 'Deployment ID', isSorting: true },
    { key: 'workflowName', label: 'Workflow Name', isSorting: true },
    { key: 'status', label: 'Status', component: DeploymentStatusCell, isSorting: false },
  ]

  const deployments = derived(
    [deploymentsDataSelector, search],
    ([$deploymentsDataSelector, $search]) => {
      return $deploymentsDataSelector.items
        .filter((item) => item.workflowName.toLowerCase().includes($search.toLowerCase()))
    }
  )

  onMount(async () => {
    await getDeploymentsAction(projectId, { page: 0, size: 10 })
    isPageLoading = false
  })

  const handleRowClick = (row: Deployment) => {
    goto(`/project/${projectId}/deployments/${row.deploymentId}`)
  }
</script>

<div class="grow p-4 flex flex-col">
  {#if isPageLoading}
    <GlobalLoader internalLoader />
  {:else}
    {#if $deploymentsDataSelector.totalCount === 0}
      <div class="center grow">
        <div class="center flex-col text-center">
          <div class="center">
            <img src={$theme === Theme.Dark ? EmptyImage : EmptyImageLight} alt="empty Workflow" />
          </div>
          <h1 class="text-[18px] font-bold mb-2 mt-3">No deployments</h1>
        </div>
      </div>
    {:else}
      <SearchBar
        isFilter={false}
        onSearch={(value) => $search = value}
      />

      <div class="mt-4"></div>
      <Table
        {columns}
        data={$deployments}
        initialSortKey="deploymentId"
        initialSortAsc={true}
        isFiltering={!!$search}
        pageSize={10}
        onRowClick={handleRowClick}
      />
    {/if}
  {/if}
</div>
