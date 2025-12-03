<script lang="ts">
  import { derived, writable } from 'svelte/store'
  import { onMount } from 'svelte'

  import { goto } from '$app/navigation'

  import { createProjectAction, getProjectsAction, projectsDataSelector } from '$lib/stores/projectsStore'
  import type { Project } from '$lib/types/project'

  import GlobalLoader from '$components/loading/GlobalLoader.svelte'
  import SearchBar from '$components/common/SearchBar.svelte'
  import { PlusIcon } from '$components/icons'
  import Card from '$components/card/Card.svelte'
  import Pagination from '$components/common/table/Pagination.svelte'
  import { PageHeader, Breadcrumbs } from '$components/header'
  import { Button } from '$components/common/ui'

  import EmptyScreen from './EmptyScreen.svelte'
  import AddForm from './AddForm.svelte'

  let itemsPerPage = 12
  let page = $state(1)

  let isPageLoading = $state(false)
  let isFormOpen = $state(false)
  let isLoading = $state(false)
  let search = writable('')
  let filter = writable('')

  onMount(async () => {
    isPageLoading = true
    await getProjects()
    isPageLoading = false
  })

  const projects = derived(
    [projectsDataSelector, search, filter],
    ([$projectsDataSelector, $search, $filter]) => {
      return $projectsDataSelector.items
        .filter((item) =>
          item.name.toLowerCase().includes($search.toLowerCase())
          || item.description.toLowerCase().includes($search.toLowerCase())
        )
    }
  )

  const getProjects = async () => {
    await getProjectsAction({ size: itemsPerPage, page: page - 1 })
  }

  const onPageChange = (value: number) => {
    page = value
    getProjects()
  }

  const handleSave = async (form: Record<string, string>) => {
    isLoading = true
    const data = await createProjectAction(form as unknown as Project)

    if (data) {
      isFormOpen = false
      await getProjects()
    }

    isLoading = false
  }
</script>

<PageHeader>
  {#snippet breadcrumbs()}
    <Breadcrumbs breadcrumbs={[{ link: '/project', title: 'Projects' }]} />
  {/snippet}
  {#snippet content()}
    <Button
      size="small"
      onClick={() => isFormOpen = true}
      icon={PlusIcon}
      iconSize={14}
      iconPosition="right"
    >
      New Project
    </Button>
  {/snippet}
</PageHeader>

{#if isPageLoading}
  <GlobalLoader internalLoader />
{:else}
  {#if $projectsDataSelector.totalCount === 0}
    <div class="grow center">
      <EmptyScreen
        onAdd={() => isFormOpen = true}
      />
    </div>
  {:else}
    <div class="p-4 grow flex flex-col">
      <div class="flex justify-end items-center">
        <SearchBar onSearch={(value) => $search = value} isFilter={false} />
      </div>

      <div class="mt-4"></div>
      <div class="grow grid grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[120px]">
        {#each $projects as project}
          <Card onClick={() => goto(`/project/${project.id}`)}>
            {#snippet title()}
              <div class="flex items-center gap-2">{project.name} (v. {project.version})</div>
            {/snippet}
            {#snippet description()}
              {project.description}
            {/snippet}
          </Card>
        {/each}
      </div>

      {#if $projects.length === 0}
        <div class="center mt-8 text-sm">No results found</div>
      {/if}

      <div class="mt-4"></div>
      {#if !$search && (!$filter || $filter === 'All')}
        <Pagination
          currentPage={page}
          totalPages={Math.ceil($projectsDataSelector.totalCount / itemsPerPage)}
          onChange={onPageChange}
        />
      {/if}
    </div>
  {/if}
{/if}

{#if isFormOpen}
  <AddForm
    isLoading={isLoading}
    onClose={() => isFormOpen = false}
    onSave={handleSave}
  />
{/if}
