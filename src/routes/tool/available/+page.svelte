<script lang="ts">
  import { derived, writable } from 'svelte/store'
  import { onMount } from 'svelte'
  import { flip } from 'svelte/animate'

  import { page } from '$app/state'
  import { goto } from '$app/navigation'

  import {
    createProvisionAction,
    createToolActionAdapter,
    deleteToolAction,
    getToolsAction,
    toolsDataSelector
  } from '$lib/stores/toolsStore'
  import type { Nullable } from '$lib/types'
  import { type Tool, type Configuration } from '$lib/types/tool'

  import GlobalLoader from '$components/loading/GlobalLoader.svelte'
  import SearchBar from '$components/common/SearchBar.svelte'
  import Pagination from '$components/common/table/Pagination.svelte'
  import Card from '$components/card/Card.svelte'
  import ToolImage from '$components/common/ToolImage.svelte'
  import DeleteModal from '$components/modals/DeleteModal.svelte'
  import { CloudIcon } from '$components/icons'
  import InfoIcon from '$components/icons/InfoIcon.svelte'
  import { Button, Tooltip } from '$components/common/ui'
  import Modal from '$components/common/ui/Modal.svelte'

  import AddForm from './AddForm.svelte'
  import HeaderPortal from './HeaderPortal.svelte'
  import type { FormValues } from './types'

  import ToolForm from '../ToolForm.svelte'


  let itemsPerPage = 20
  let itemsPage = $state(1)

  let isDeleteOpen = $state(false)
  let isDeleting = $state(false)
  let isAddFormOpen = $state(page.url.searchParams.has('create'))
  let isPageLoading = $state(true)
  let isLoading = $state(false)
  let search = writable('')
  let filter = writable('')
  let selectedTool: Nullable<Tool> = $state(null)
  let isModalOpen = $state(false)

  onMount(async () => {
    await getTools()
    isPageLoading = false

    goto('/tool/available')
  })

  const tools = derived(
    [toolsDataSelector, search, filter],
    ([$toolsDataSelector, $search, $filter]) => {
      return $toolsDataSelector.items
        .filter((item) =>
          item.label.toLowerCase().includes($search.toLowerCase())
        || item.description.toLowerCase().includes($search.toLowerCase())
        )
        .filter((item) => item.type?.toLowerCase().includes($filter.toLowerCase()) || $filter === 'All')
    }
  )

  const getTools = async () => {
    const type = $filter && $filter !== 'All' ? $filter.toLowerCase() : undefined
    await getToolsAction({ page: itemsPage - 1, size: itemsPerPage, type  })
  }

  const onPageChange = (value: number) => {
    itemsPage = value
    getTools()
  }

  const closeForm = () => {
    selectedTool = null
    isAddFormOpen = false
  }

  const handleCloseModal = () => {
    closeForm()
    isModalOpen = false
    isLoading = false
  }

  const handleFilter = (value: string) => {
    filter.set(value)
    itemsPage = 1
    getTools()
  }

  const handleDeleteClick = async () => {
    isDeleting = true
    const data = await deleteToolAction(selectedTool!.id)

    isDeleting = false
    isDeleteOpen = false

    if (data) {
      await getTools()
      closeForm()
    }
  }

  const handleAdd = async (values: FormValues) => {
    isLoading = true

    const timeout = setTimeout(() => {
      isModalOpen = true
      isLoading = false

      getTools()
    }, 3_000)

    const response = await createToolActionAdapter(values)
    clearTimeout(timeout)
    isLoading = false

    if (response) {
      isModalOpen = false

      await getTools()
    }
  }

  const handleSave = async (values: { form: Record<string, any>, tool: Nullable<Tool> }) => {
    const { form, tool } = values
    const data = {
      name: form.name,
      type: tool?.type,
      format: tool?.format,
      value: form.value,
      referenceId: tool?.id,
      schema: tool?.name,
      toolName: tool?.label,
    }

    isLoading = true
    const provision = await createProvisionAction(data as Configuration)
    if (provision) {
      goto('/tool/provisioned')
      return
    }

    isLoading = false
  }
</script>

<HeaderPortal bind:isAddFormOpen={isAddFormOpen} />

{#if isPageLoading}
  <GlobalLoader internalLoader />
{:else}
  <SearchBar
    onFilter={handleFilter}
    onSearch={(value) => $search = value}
  />

  <div class="mt-4"></div>
  {#if $tools.length}
    <div class="grow grid grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[120px]">
      {#each $tools as tool (tool.id)}
        {@const isDisabled = !(tool.status === 'READY' || tool.status === 'IMPORT_PARTIAL_SUCCESS')}
        <div
          class="flex grow-1"
          animate:flip={{ duration: 200 }}
        >
          <Tooltip
            className="flex flex-col grow-1 overflow-hidden"
            content={isDisabled ? 'This tool is still in progress. Please, check later' : undefined}
            triggerBase="flex-col"
          >
            <Card
              onClick={() => {
                if (isDisabled) return
                selectedTool = tool
              }}
              isDisabled={isDisabled}
              testId={`tool-${tool.name}`}
            >
              <div class="flex items-center gap-2 mb-2">
                <div class="bg-bgWhite0 p-2 w-10 h-10 center rounded-full border border-strokeSoft200">
                  <ToolImage iconName={tool.label}  />
                </div>
                <div class="line-clamp-2">{tool.label}</div>
              </div>
              <div class="text-xs line-clamp-2 text-left">{tool.description}</div>
            </Card>
          </Tooltip>
        </div>
      {/each}
    </div>
  {:else}
    <div class="flex grow items-start justify-center">
      <div class="center mt-8 text-sm">No results found</div>
    </div>
  {/if}

  <div class="mt-4"></div>
  {#if !$search && (!$filter || $filter === 'All')}
    <Pagination
      currentPage={itemsPage}
      totalPages={Math.ceil($toolsDataSelector.totalCount / itemsPerPage)}
      onChange={onPageChange}
    />
  {/if}

  <DeleteModal
    isOpen={isDeleteOpen}
    isLoading={isDeleting}
    title="Delete Tool"
    text={`Are you sure you want to delete ${selectedTool?.name || ''} from your tools?`}
    onClose={() => isDeleteOpen = false}
    onSubmit={handleDeleteClick}
  />
{/if}

{#if isAddFormOpen}
  <AddForm
    isOpen
    isLoading={isLoading}
    onClose={closeForm}
    onDelete={() => isDeleteOpen = true}
    onSave={handleAdd}
  />
{/if}

{#if selectedTool}
  <ToolForm
    isOpen
    hideActions={!selectedTool?.global}
    showDelete={!selectedTool?.global}
    isLoading={isLoading}
    tool={selectedTool}
    onClose={() => selectedTool = null}
    onDelete={() => isDeleteOpen = true}
    onSave={handleSave}
  />
{/if}

<Modal
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  className="w-[440px]"
>
  {#snippet header()}
    <div class="flex items-center gap-2">
      <span class="p-2 bg-primaryAlpha16 text-primaryBase roundex-xs"><CloudIcon /></span>
      <h4 class="font-500">Importing...</h4>
    </div>
  {/snippet}

  <div class="text-sm text-textSub600 ">
    This operation could take some time, please close this modal and resume your work normally.
  </div>
  <div class="mt-6 p-2 bg-primaryAlpha16 rounded-sm text-textSub600 text-sm flex gap-2 items-center">
    <span class="text-primaryBase "><InfoIcon /></span>
    <span>We will notify you when the tool will be imported.</span>
  </div>

  {#snippet footer()}
    <Button type="secondary" className="grow-1" onClick={handleCloseModal}>Close</Button>
  {/snippet}
</Modal>
