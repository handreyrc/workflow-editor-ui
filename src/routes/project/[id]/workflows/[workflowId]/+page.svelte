<script lang="ts">
  import { onDestroy, onMount, setContext } from 'svelte'
  import { SvelteFlowProvider, type Node } from '@xyflow/svelte'
  import '@xyflow/svelte/dist/style.css'
  import { Pane, Splitpanes } from 'svelte-splitpanes'
  import { derived, writable } from 'svelte/store'
  import cx from 'classnames'
  import { Specification } from '@severlessworkflow/sdk-typescript'

  import { page } from '$app/state'
  import { goto } from '$app/navigation'

  import type { WorkflowUpdate, WorkflowContent } from '$lib/types/workflows'
  import {
    deleteWorkflowAction,
    getWorkflowInfoAction,
    setIsWorkflowSaved,
    setSelectedWorkflow,
    updateWorkflowAction,
    workflowsSelectedWorkflowSelector,
    workflowsSelector
  } from '$lib/stores/workflowStore'
  import type { Maybe } from '$lib/types/index.js'
  import { showErrorMessage } from '$lib/stores/toastsStore'
  import { setWorkflowSettings, workflowSettingsSelector } from '$lib/stores/appStore'
  import { WORKFLOW_DATA_CONTEXT } from '$lib/types/context/workflow'
  import { getNormalizedWorkflow, getStatesFromNodes } from '$lib/utils/flow/toServerless.js'

  import Loading from '$components/loading/Loading.svelte'
  import DeleteModal from '$components/modals/DeleteModal.svelte'
  import GlobalLoader from '$components/loading/GlobalLoader.svelte'

  import FlowWrapper from './FlowWrapper.svelte'
  import WorkflowHeader from './WorkflowHeader.svelte'
  import DeployForm from './DeployForm.svelte'
  import SidePanel from './SidePanel.svelte'
  import Definitions from './side-panel/Definitions.svelte'
  import { workflowDataContext } from './context'
  import { getEmptyWorkflowDefinition } from './utils'

  import EditForm from '../AddForm.svelte'


  let isPageLoading = $state(true)
  let isDeleteOpen = $state(false)
  let isDeployOpen = $state(false)
  let isEdit = $state(false)

  let flowRef: Maybe<FlowWrapper> = $state()
  let definitionsRef: Maybe<Definitions> = $state()

  let workflowId = page.params?.workflowId
  let projectId = page.params?.id

  let sidebarTab = writable($workflowSettingsSelector.sidebarTab || 'chat')
  const dndType = writable(null)

  setContext('dnd', dndType)
  setContext(WORKFLOW_DATA_CONTEXT, workflowDataContext)

  const isSidebarMinimized =  derived(workflowSettingsSelector, (store) => store.isSidebarMinimized || false)
  const selectedWorkflow = workflowsSelectedWorkflowSelector
  const workflowData = derived(workflowsSelectedWorkflowSelector, (store) => store?.content)
  const isWorkflowGenerating = derived(workflowsSelector, (store) => store?.isGenerating)
  const isWorkflowSaved = derived(workflowsSelector, (store) => store?.isSaved)

  const isFlowReadOnly = derived(sidebarTab, () => $sidebarTab !== 'builder')

  const workflow = workflowDataContext.workflow
  const subflows = workflowDataContext.subflows || []

  selectedWorkflow.subscribe((value) => {
    const content = value?.content
    const emptyWorkflow = getEmptyWorkflowDefinition(value?.key)
    workflowDataContext.setData(content?.workflow || emptyWorkflow, content?.subflows || [])
  })

  onMount(async () => {
    await getWorkflowInfoAction(projectId, workflowId)

    isPageLoading = false
  })

  onDestroy(() => {
    setSelectedWorkflow(null)
    setIsWorkflowSaved(true)
    dndType.set(null)
    workflowDataContext.clear()
  })

  isSidebarMinimized.subscribe(() => flowRef?.fitFlowView?.())
  sidebarTab.subscribe((val) => {
    flowRef?.fitFlowView?.()
    if (!$isWorkflowSaved) flowRef?.resetToSavedWorkflow?.()

    const emptyWorkflow = getEmptyWorkflowDefinition($selectedWorkflow?.key)
    workflowDataContext.setData($workflowData?.workflow || emptyWorkflow, $workflowData?.subflows || [])

    setWorkflowSettings('sidebarTab', val)
  })

  const handleUpdate = async (form: Record<string, any> = {}) => {
    if (!$selectedWorkflow) return

    let content: WorkflowContent = {
      workflow: $workflow,
      subflows: $subflows
    }

    if ($sidebarTab === 'builder') {
      const nodes = flowRef?.getNodes() || []

      try {
        const states = getStatesFromNodes(nodes)
        content.workflow = getNormalizedWorkflow({ ...$workflow, states })

        content.subflows = $subflows.map((subflow) => {
          const subflowStates = getStatesFromNodes(nodes, subflow.id)
          return getNormalizedWorkflow({ ...subflow, states: subflowStates })
        })
      } catch {
        showErrorMessage({ description: 'Workflow content is not valid. Please check the data' })
        return
      }
    }

    if ($sidebarTab === 'code') {
      const workflowDefinition = definitionsRef?.getDefinitions()

      if (workflowDefinition) {
        try {
          content.workflow = JSON.parse(workflowDefinition.workflow)
          content.subflows = workflowDefinition.subflows.map((subflow) => JSON.parse(subflow))
        } catch {
          showErrorMessage({ description: 'Workflow should be valid JSON' })
          return
        }
      }
    }

    const updatedWorkflow: WorkflowUpdate = {
      key: $selectedWorkflow.key,
      name: $selectedWorkflow.name,
      description: $selectedWorkflow.description,
      ...form,
      status: $selectedWorkflow.status,
      content: {
        workflow: content.workflow,
        subflows: content.subflows?.length ? content.subflows : undefined
      }
    }

    const data = await updateWorkflowAction(projectId, workflowId, updatedWorkflow)

    if (data) {
      setSelectedWorkflow(data)
      setIsWorkflowSaved(true)
      isEdit = false
      definitionsRef?.resetSavedTabs()
    }
  }

  const handleAddNode = (type?: string, groupId?: string) => {
    if (!flowRef || !type) return

    flowRef.addNode(type, groupId)
  }

  const handleMinimize = (value: boolean) => setWorkflowSettings('isSidebarMinimized', value)

  const handleDeleteClick = async () => {
    await deleteWorkflowAction(projectId, workflowId)
    isDeleteOpen = false

    goto('/project/' + projectId + '/workflows')
  }

  const buildWorkflowFromContext = (keepNodes?: boolean) => {
    flowRef?.buildWorkflowFromContext?.(keepNodes)
  }

  const zoomToNode = (nodeId: string) => {
    flowRef?.fitToNode(nodeId)
  }
</script>

{#if isDeployOpen}
  <DeployForm
    projectId={projectId}
    workflowId={workflowId}
    functions={$workflow?.functions}
    onClose={() => isDeployOpen = false}
  />
{/if}

<WorkflowHeader
  bind:isDeployOpen={isDeployOpen}
  bind:isEdit={isEdit}
  onSave={() => handleUpdate()}
/>

{#if isPageLoading}
  <GlobalLoader internalLoader />
{:else}
  <div class="relative grow max-h-[calc(100%-48px)] min-h-0 flex">
    <div class="w-full min-h-0 grow flex pageWrapper">
      <Splitpanes
        class={cx('panesWrapper min-h-0', { 'panesWrapper--minimized': $isSidebarMinimized })}
      >
        <Pane
          class="pane-0 grow min-h-0 h-full"
          size={$sidebarTab === 'code' ? 50 : 25}
          maxSize={75}
        >
          <SidePanel
            bind:definitionsRef={definitionsRef}
            selectedTab={sidebarTab}
            isMinimized={isSidebarMinimized}
            onMinimize={handleMinimize}
            addNode={handleAddNode}
            buildWorkflowFromContext={buildWorkflowFromContext}
            zoomToNode={zoomToNode}
          />
        </Pane>
        <Pane class="pane-1">
          {#if $isWorkflowGenerating}
            <div class="w-full h-full center"><Loading /></div>
          {:else}
            <SvelteFlowProvider>
              <FlowWrapper
                readOnly={isFlowReadOnly}
                bind:this={flowRef}
              />
            </SvelteFlowProvider>
          {/if}
        </Pane>
      </Splitpanes>
    </div>
  </div>
{/if}

<DeleteModal
  isOpen={isDeleteOpen}
  title="Delete Workflow?"
  text="Are you sure you want to delete this workflow? This action cannot be undone."
  onClose={() => isDeleteOpen = false}
  onSubmit={handleDeleteClick}
/>

{#if isEdit}
  <EditForm
    isOpen
    type="edit"
    initialValues={{
      key: $selectedWorkflow?.key,
      name: $selectedWorkflow?.name,
      description: $selectedWorkflow?.description
    }}
    onClose={() => isEdit = false}
    onDelete={() => isDeleteOpen = true}
    onSave={handleUpdate}
  />
{/if}

<style lang="postcss">
  @reference '$lib/styles/tailwind.css';

  .pageWrapper {
    :global {

      .panesWrapper {
        .pane-0 {
          @apply min-w-[420px];
        }
      }

      .panesWrapper--minimized {
        .pane-0 {
          min-width: 0 !important;
          width: 0 !important;
        }

        .splitpanes__splitter {
          @apply hidden;
        }

        .pane-1 {
          width: 100% !important;
        }
      }
    }
  }
</style>
