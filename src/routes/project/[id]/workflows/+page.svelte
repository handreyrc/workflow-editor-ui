<script lang="ts">
  import { derived, writable } from 'svelte/store'
  import { onMount } from 'svelte'

  import { goto } from '$app/navigation'

  import {
    deleteProjectAction,
    selectedProjectSelector,
    setSelectedProject,
    updateProjectAction
  } from '$lib/stores/projectsStore'
  import { createWorkflowAction, getWorkflowsAction, workflowsDataSelector } from '$lib/stores/workflowStore'
  import type { WorkflowEntity } from '$lib/types/workflows'
  import type { Project } from '$lib/types/project'

  import SearchBar from '$components/common/SearchBar.svelte'
  import GlobalLoader from '$components/loading/GlobalLoader.svelte'
  import Card from '$components/card/Card.svelte'
  import Pagination from '$components/common/table/Pagination.svelte'
  import DeleteModal from '$components/modals/DeleteModal.svelte'

  import EmptyScreen from './EmptyScreen.svelte'
  import AddForm from './AddForm.svelte'
  import HeaderPortal from './HeaderPortal.svelte'

  import EditForm from '../../AddForm.svelte'

  let itemsPerPage = 12
  let page = $state(1)

  let isFormOpen = $state(false)
  let isEdit = $state(false)
  let isDeleteOpen = $state(false)
  let isLoading = $state(false)
  let isPageLoading = $state(false)
  let search = writable('')
  let filter = writable('')

  const workflows = derived(
    [workflowsDataSelector, search, filter],
    ([$workflowsDataSelector, $search, $filter]) => {
      return $workflowsDataSelector.items
        .filter((item) =>
          item.name.toLowerCase().includes($search.toLowerCase())
          || item.description.toLowerCase().includes($search.toLowerCase())
        )
    }
  )

  onMount(async () => {
    if ($selectedProjectSelector?.id) {
      isPageLoading = true

      await getWorkflows()
      isPageLoading = false

      return
    }

    goto('/project')
  })

  const getWorkflows = async () => {
    await getWorkflowsAction(
      $selectedProjectSelector!.id,
      { page: page - 1, size: itemsPerPage }
    )
  }

  const onPageChange = (value: number) => {
    page = value
    getWorkflows()
  }

  const handleClickWorkflow = (id: string) => goto(`/project/${$selectedProjectSelector?.id}/workflows/${id}`)

  const handleDeleteProject = async () => {
    const data = await deleteProjectAction($selectedProjectSelector!.id)

    if (data) {
      goto('/project')
      setSelectedProject(null)
    }
  }

  const handleUpdateProject = async (values: {
    name: string
    description: string
  }) => {
    const data = await updateProjectAction(
      $selectedProjectSelector!.id,
      values as Project
    )

    if (data) {
      setSelectedProject(data)
      isEdit = false
    }
  }

  const handleSave = async (values: Record<string, any>) => {
    isLoading = true
    const data = await createWorkflowAction($selectedProjectSelector!.id, {
      ...values,
      content: {},
      status: 'ACTIVE'
    } as unknown as WorkflowEntity)

    if (data) {
      await getWorkflows()
      isFormOpen = false
    }

    isLoading = false
  }
</script>

<HeaderPortal
  bind:isFormOpen={isFormOpen}
  bind:isEdit={isEdit}
/>

{#if isPageLoading}
  <GlobalLoader internalLoader />
{:else}
  {#if $workflowsDataSelector.totalCount === 0}
    <div class="grow center">
      <EmptyScreen
        onAdd={() => isFormOpen = true}
      />
    </div>
  {:else}
    <div class="grow p-4 flex flex-col">
      <div class="flex justify-end items-center">
        <SearchBar
          onSearch={(value) => $search = value}
          isFilter={false}
        />
      </div>

      <div class="mt-4"></div>
      <div class="grow grid grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[120px] mt-4">
        {#each $workflows as workflow (workflow.id)}
          <Card onClick={() => handleClickWorkflow(workflow.id)}>
            {#snippet title()}
              {workflow.name}
            {/snippet}
            {#snippet description()}
              {workflow.description}
            {/snippet}
          </Card>
        {/each}
      </div>

      {#if $workflows.length === 0}
        <div class="center mt-8 text-sm">No results found</div>
      {/if}

      <div class="mt-4"></div>
      {#if !$search && (!$filter || $filter === 'All')}
        <Pagination
          currentPage={page}
          totalPages={Math.ceil($workflowsDataSelector.totalCount / itemsPerPage)}
          onChange={onPageChange}
        />
      {/if}
    </div>
  {/if}
{/if}

<DeleteModal
  isOpen={isDeleteOpen}
  title="Delete Project?"
  text="Are you sure you want to delete this project? This action cannot be undone."
  onClose={() => isDeleteOpen = false}
  onSubmit={handleDeleteProject}
/>

{#if isFormOpen}
  <AddForm
    isOpen
    isLoading={isLoading}
    onSave={handleSave}
    onClose={() => isFormOpen = false}
  />
{/if}

{#if $selectedProjectSelector && isEdit}
  <EditForm
    type="edit"
    initialValues={{
      name: $selectedProjectSelector.name,
      description: $selectedProjectSelector.description
    }}
    isLoading={isLoading}
    onDelete={() => isDeleteOpen = true}
    onSave={handleUpdateProject}
    onClose={() => isEdit = false}
  />
{/if}
