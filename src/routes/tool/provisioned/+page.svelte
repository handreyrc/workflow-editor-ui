<script lang="ts">
  import { onMount } from 'svelte'
  import { derived, writable } from 'svelte/store'

  import { goto } from '$app/navigation'

  import type { Column } from '$lib/types/table'
  import {
    deleteProvisionAction,
    getProvisionsAction,
    provisionsDataSelector,
    updateProvisionAction
  } from '$lib/stores/toolsStore'
  import type { Nullable } from '$lib/types'
  import type { Tool, Configuration } from '$lib/types/tool'
  import { theme, Theme } from '$lib/services/themeService'

  import Table from '$components/common/table/Table.svelte'
  import DeleteModal from '$components/modals/DeleteModal.svelte'
  import SearchBar from '$components/common/SearchBar.svelte'
  import GlobalLoader from '$components/loading/GlobalLoader.svelte'
  import ToolCell from '$components/common/table/ToolCell.svelte'

  import EmptyImage from '$assets/images/emptyintegration.svg'
  import EmptyImageLight from '$assets/images/emptyintegration_light.svg'

  import ToolForm from '../ToolForm.svelte'

  let selected: Nullable<Configuration> = $state(null)
  let tool: Nullable<Tool> = $state(null)
  let isDeleteOpen = $state(false)
  let isDeleting = $state(false)
  let isPageLoading = $state(true)

  let search = writable('')
  let filter = writable('')

  const columns: Column<Configuration>[] = [
    { key: 'name', label: 'Name', isSorting: true },
    {
      key: 'format',
      label: 'Tool',
      isSorting: false,
      component: ToolCell,
    },
    { key: 'type', label: 'Type', isSorting: false },
  ]

  const provisions = derived(
    [provisionsDataSelector, search, filter],
    ([$provisionsDataSelector, $search, $filter]) => {
      return $provisionsDataSelector.items
        .filter((item) => item.name.toLowerCase().includes($search.toLowerCase()))
        .filter((item) => item.type?.toLowerCase().includes($filter.toLowerCase()) || $filter === 'All')
    }
  )

  onMount(async () => {
    await getProvisionsAction({ page: 0, size: 10 })
    isPageLoading = false
  })

  const handleRowClick = async (row: Configuration) => {
    tool = {
      label: row.toolName,
      type: row.type,
      format: row.format,
    } as Tool
    selected = row
  }

  const handleDeleteClick = async () => {
    isDeleting = true
    const data = await deleteProvisionAction(selected!.id)

    isDeleting = false
    if (data) {
      isDeleteOpen = false
      selected = null
      tool = null
    }
  }

  const handleSave = async (prop: {
    form: Record<string, any>,
    tool: Nullable<Tool>
  }) => {
    const data = {
      name: prop.form.name,
    }

    const response = await updateProvisionAction(selected!.id, data as Configuration)
    if (response) {
      selected = null
      tool = null
    }
  }

</script>

{#if isPageLoading}
  <GlobalLoader internalLoader />
{:else}
  {#if $provisionsDataSelector.totalCount === 0}
    <div class="center grow">
      <div class="center flex-col text-center">
        <div class="center">
          <img src={$theme === Theme.Dark ? EmptyImage : EmptyImageLight} alt="empty Workflow" />
        </div>
        <h1 class="text-[18px] font-bold mb-2 mt-3">Start Adding Tools</h1>
        <p class="text-[13px] mb-2">
          <button class="text-primaryBase cursor-pointer" onclick={() => goto('/tool/available')}>Browse</button> the available tools or
          <button class="text-primaryBase cursor-pointer" onclick={() => goto('/tool/available?create')}>create your own</button>
        </p>
      </div>
    </div>
  {:else}
    <SearchBar
      onFilter={(value) => $filter = value}
      onSearch={(value) => $search = value}
    />

    <div class="mt-4"></div>
    <Table
      {columns}
      isFiltering={Boolean($search || ($filter && $filter !== 'All'))}
      data={$provisions}
      initialSortKey="name"
      initialSortAsc={true}
      pageSize={10}
      onRowClick={handleRowClick}
    />

    <DeleteModal
      isOpen={isDeleteOpen}
      isLoading={isDeleting}
      title="Delete Tool"
      text={`Are you sure you want to delete ${selected?.name || ''} from your tools?`}
      onClose={() => isDeleteOpen = false}
      onSubmit={handleDeleteClick}
    />

    {#if selected}
      <ToolForm
        isOpen
        isLoading={false}
        tool={tool}
        initialValues={{ name: selected.name }}
        type="edit"
        hideActions
        onClose={() => selected = null}
        onDelete={() => isDeleteOpen = true}
        onSave={handleSave}
      />
    {/if}
  {/if}
{/if}

