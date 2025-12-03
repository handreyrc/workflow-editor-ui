<script lang="ts">
  import { get, type Writable, writable } from 'svelte/store'
  import type monacoEditor from 'monaco-editor'
  import { Accordion } from '@skeletonlabs/skeleton-svelte'
  import { getContext, tick } from 'svelte'

  import type { Nullable } from '$lib/types'
  import { setIsWorkflowSaved } from '$lib/stores/workflowStore'
  import { WORKFLOW_DATA_CONTEXT, type WorkflowDataContext } from '$lib/types/context/workflow'

  import MonacoEditor from '$components/common/MonacoEditor.svelte'
  import {
    ArrowDownLineIcon,
    CloseIcon,
    DotsIcon,
    FlowChartIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon
  } from '$components/icons'
  import Tooltip from '$components/common/ui/Tooltip.svelte'
  import EditableInput from '$components/common/EditableInput.svelte'
  import Popover from '$components/common/ui/Popover.svelte'

  interface Tab {
    id: string
    name: string
    isOpened?: boolean
    isSaved?: boolean
    isAdded?: boolean
    originalValue?: string
  }

  const workflowDataContext: WorkflowDataContext = getContext(WORKFLOW_DATA_CONTEXT)

  const workflowTab: Tab = {
    id: 'workflow',
    name: 'workflow.sw.json',
    isSaved: true,
    isOpened: true,
    originalValue: '',
  }
  let accordion = $state(['subflows'])

  let selectedTab = $state(workflowTab)
  let tabs = $state<Tab[]>([workflowTab])
  let editingTab = $state<Nullable<{
    id: string
    name: string
    isSaved?: boolean
    isAdded?: boolean
  }>>()
  let workflowPopoverOpenId = $state()
  let tabRefs: Record<string, HTMLButtonElement> = {}
  let workflowEditorRef: monacoEditor.editor.IStandaloneCodeEditor

  const workflow = writable('')
  let subflows = $state<Record<string, Writable<string>>>({})

  $effect(() => {
    const isAnyNotSaved = tabs.some((tab) => !tab.isSaved)
    setIsWorkflowSaved(!isAnyNotSaved)
  })

  workflowDataContext.workflow.subscribe(async (value) => {
    try {
      const stringifiedValue = JSON.stringify(value, undefined, 2)

      workflow.set(stringifiedValue)

      await tick()
      const model = workflowEditorRef?.getModel()
      if (model && !model.isDisposed()) workflowEditorRef?.setValue(stringifiedValue)
    } catch { /* do nothing */ }
  })

  workflowDataContext.subflows.subscribe((value) => {
    subflows = {}
    value?.forEach((subflow) => {
      try {
        subflows[subflow.id] = writable(JSON.stringify(subflow, undefined, 2))
      } catch { /* do nothing */ }
    })
  })

  const getTabValue = (id: string): Writable<string> => {
    if (id === workflowTab.id) {
      return workflow
    }

    const subflow = subflows[id]
    if (subflow) {
      return subflow
    }

    return writable('')
  }

  const onEditorMount = (
    _editor: monacoEditor.editor.IStandaloneCodeEditor,
    id: string
  ) => {
    const originalValue = _editor.getValue()
    const currentTabIndex = tabs.findIndex((t) => t.id === id)

    if (id === workflowTab.id) {
      workflowEditorRef = _editor
    }

    tabs[currentTabIndex].originalValue = originalValue
    _editor.onDidChangeModelContent(() => {
      const originalValue = tabs[currentTabIndex].originalValue
      tabs[currentTabIndex].isSaved = originalValue === _editor!.getValue()
    })
  }

  const onClickNav = (tab: Tab) => {
    const currentTabIndex = tabs.findIndex((t) => t.id === tab.id)
    if (currentTabIndex === -1) {
      tabs.push({
        ...tab,
        isSaved: true,
        isOpened: true,
      })
    }

    if (currentTabIndex > -1) {
      tabs[currentTabIndex].isOpened = true
    }

    selectedTab = tab
    tabRefs[tab.id]?.scrollIntoView({ behavior: 'smooth', inline: 'center' })
  }

  const handleAddSubflow = async (e: MouseEvent) => {
    e.stopPropagation()

    if (!accordion.includes('subflows')) {
      accordion.push('subflows')
    }

    const newSubflow = {
      id: `subflow-${Date.now()}`,
      name: '',
      isSaved: false,
      isAdded: true,
      isOpened: true,
    }

    editingTab = newSubflow
    tabs.push(newSubflow)
    selectedTab = newSubflow
    subflows[newSubflow.id] = writable('')

    await tick()
    tabRefs[newSubflow.id]?.scrollIntoView({ behavior: 'smooth', inline: 'center' })
  }

  const validateSubflowName = (value: string) => {
    const subflowNames = Object.keys(subflows)
    return !!value && subflowNames.every((subflowName) => subflowName !== value)
  }

  const handleCloseTab = (id: string) => {
    const currentTabIndex = tabs.findIndex((t) => t.id === id)
    if (currentTabIndex > -1) tabs[currentTabIndex].isOpened = false

    const openedTabs = tabs.filter((t) => t.isOpened)
    selectedTab = openedTabs[openedTabs.length - 1]
  }

  const handleCancelEdit = () => {
    if (editingTab?.isAdded) {
      handleCloseTab(editingTab.id)
      delete subflows[editingTab.id]
    }

    editingTab = null
  }

  const handleDeleteSubflow = (id: string) => {
    handleCloseTab(id)
    delete subflows[id]
  }

  const handleApplyEdit = (value: string, id: string) => {
    if (!value) {
      return
    }

    editingTab = null

    const subflow = subflows[id]
    if (subflow) {
      subflows[value] = subflow
      delete subflows[id]
    }

    const currentTabIndex = tabs.findIndex((t) => t.id === id)
    if (currentTabIndex > -1) {
      tabs[currentTabIndex].id = value
      tabs[currentTabIndex].name = value
    }

    if (selectedTab.id === id) {
      selectedTab = { ...selectedTab, id: value, name: value }
    }
  }

  export const getDefinitions = () => {
    return {
      workflow: $workflow,
      subflows: Object.keys(subflows).map((key) => get(subflows[key])),
    }
  }

  export const resetSavedTabs = () => {
    tabs = tabs.map((tab) => ({
      ...tab,
      isSaved: true,
      isAdded: false,
      originalValue: get(getTabValue(tab.id))
    }))
  }
</script>

<div class="h-full w-full relative px-4 py-4 flex gap-2">
  <div class="w-48 shrink-0 z-1">
    <div class="flex items-center justify-between">
      <h5 class="text-sm font-semibold">Resources</h5>
    </div>

    <div class="ml-2 mt-6">
      <button
        class="text-xs flex items-center text-textSub600"
        onclick={() => onClickNav(workflowTab)}
        class:text-textStrong950!={selectedTab.id === workflowTab.id}
      >
        <span class="mr-1"><FlowChartIcon width={14} height={14} /></span>
        <span>{workflowTab.name}</span>
      </button>

      <div class="mt-4">
        <Accordion
          collapsible
          multiple
          value={accordion}
          onValueChange={(e) => (accordion = e.value)}
        >
          {#snippet iconOpen()}
            <span class="block rotate-x-180"><ArrowDownLineIcon width={16} height={16} /></span>
          {/snippet}

          {#snippet iconClosed()}
            <ArrowDownLineIcon width={16} height={16} />
          {/snippet}

          <Accordion.Item
            value="subflows"
            panelPadding="0"
            controlPadding="0"
            indicatorBase="order-[-1] mr-1"
          >
            {#snippet control()}
              <div class="flex items-center justify-between">
                <span class="text-xs">Subflows</span>
                <div class="mr-[-16px]">
                  <Tooltip
                    content="Add Subflow"
                  >
                    <button
                      class="button button__empty"
                      onclick={handleAddSubflow}
                    ><PlusIcon width={14} height={14} /></button>
                  </Tooltip>
                </div>
              </div>
            {/snippet}
            {#snippet panel()}
              <div class="flex flex-col items-start gap-1 mt-2 text-textSub600">
                {#each Object.keys(subflows) as subflow (subflow)}
                  {@const isEditing = editingTab?.id === subflow}
                  <button
                    class="w-full text-xs text-left text-textSub600 flex items-center pl-4 py-1 rounded-sm"
                    onclick={() => onClickNav({ id: subflow, name: subflow })}
                    class:text-textStrong950!={selectedTab.id === subflow}
                    class:bg-pageBg={selectedTab.id === subflow && !isEditing}
                  >
                    {#if !isEditing}
                      <span class="mr-1"><FlowChartIcon width={14} height={14} /></span>
                    {/if}
                    <EditableInput
                      validate={validateSubflowName}
                      isEditing={isEditing}
                      initialValue={editingTab?.name}
                      onCancel={handleCancelEdit}
                      onApply={(value) => handleApplyEdit(value, subflow)}
                      inputClassName="py-0.5 text-xs"
                      placeholder="Enter name"
                    >
                      {#snippet content()}
                        <div class="grow-1 flex items-center justify-between overflow-hidden">
                          <span class="block truncate py-0.5">{subflow}</span>
                          <Popover
                            isOpen={workflowPopoverOpenId === subflow}
                            onOpenChange={(isOpen) => {
                              workflowPopoverOpenId = isOpen ? subflow : undefined
                            }}
                          >
                            {#snippet button()}
                              <span class="button button__empty mr-[-2px]" role="button">
                                <DotsIcon height={14} />
                              </span>
                            {/snippet}
                            <div class="bg-bgWhite0 rounded-sm p-1 flex flex-col min-w-32 text-[10px]">
                              <button
                                class="grow-1 p-1 flex items-center gap-2 hover:bg-primaryAlpha16"
                                onclick={() => {
                                  workflowPopoverOpenId = undefined
                                  editingTab = { id: subflow, name: subflow, isSaved: true }
                                }}>
                                <PencilIcon width={12} />
                                Edit name
                              </button>
                              <button
                                class="grow-1 p-1 flex items-center gap-2 hover:bg-primaryAlpha16"
                                onclick={() => handleDeleteSubflow(subflow)}>
                                <span class="text-errorBase"><TrashIcon width={12} /></span>
                                Delete schema
                              </button>
                            </div>
                          </Popover>
                        </div>
                      {/snippet}
                    </EditableInput>
                  </button>
                {/each}
              </div>
            {/snippet}
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  </div>

  <div class="flex flex-1 flex-col min-h-0 mb-2 border border-strokeSub300 max-w-full overflow-hidden">
    <div class="flex items-center border-b border-b-strokeSoft200 bg-pageBg px-1 overflow-x-auto">
      {#each tabs.filter((t) => t.isOpened) as tab (tab.id)}
        <button
          class="tab__item"
          class:isSelected={selectedTab.id === tab.id}
          onclick={() => onClickNav(tab)}
        >
          <span class="truncate">{tab.name}</span>
          {#if !tab.isSaved || tab.isAdded}
            <span class="shrink-0 w-1.5 h-1.5 rounded-full bg-textSoft400 ml-1"></span>
          {/if}
          {#if tab.id !== workflowTab.id}
            <span
              class="ml-2"
              role="presentation"
              onclick={(e) => {
                e.stopPropagation()
                handleCloseTab(tab.id)
              }}
            >
              <CloseIcon width={14} height={14} />
            </span>
          {/if}
        </button>
      {/each}
    </div>
    <div class="flex flex-1 min-h-0">
      {#each tabs as tab (tab.id)}
        {@const value = getTabValue(tab.id)}
        <div
          class="w-full h-full"
          class:hidden={selectedTab.id !== tab.id}
        >
          <MonacoEditor
            value={value}
            onEditorMount={(_editor) => onEditorMount(_editor, tab.id)}
            options={{ minimap: { enabled: false } }}
          />
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="postcss">
  @reference '$lib/styles/tailwind.css';

  .tab__item {
    @apply max-w-[160px] overflow-hidden flex items-center px-2 py-2 text-[10px] text-textSub600 border border-transparent mb-[-3px] whitespace-nowrap;

    &.isSelected {
      @apply bg-bgSection text-textStrong950 border-strokeSoft200 border-b-bgSection rounded-t-lg;

      .icon {
        @apply text-primaryBase;
      }
    }
  }
</style>
