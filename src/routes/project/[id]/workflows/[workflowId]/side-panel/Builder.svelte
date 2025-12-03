<script lang="ts">
  import { getContext } from 'svelte'
  import { derived, get, type Readable, type Unsubscriber, writable, type Writable } from 'svelte/store'
  import { Specification } from '@severlessworkflow/sdk-typescript'

  import { WORKFLOW_DATA_CONTEXT, type WorkflowDataContext } from '$lib/types/context/workflow'
  import { getNormalizedWorkflow, getStatesFromNodes } from '$lib/utils/flow/toServerless'
  import { setIsWorkflowSaved } from '$lib/stores/workflowStore'
  import { type UseForm } from '$lib/utils/hooks/useForm'
  import type { WorkflowForm } from '$lib/types/forms/workflow'
  import type { DropDownOption } from '$lib/types/ui'
  import type { Maybe } from '$lib/types'

  import { Button, Dropdown, Tooltip } from '$components/common/ui'

  import BuilderContextForm from './BuilderContextForm.svelte'

  interface Props {
    onAddNode: (type?: string, groupId?: string) => void
    buildWorkflowFromContext: (keepNodes?: boolean) => void
    zoomToNode?: (nodeId: string) => void
  }

  let { onAddNode, buildWorkflowFromContext, zoomToNode }: Props = $props()
  const workflowDataContext: WorkflowDataContext = getContext(WORKFLOW_DATA_CONTEXT)

  let workflow = workflowDataContext.workflow
  let subflows = workflowDataContext.subflows

  let selectedWf = $state<Specification.Workflow>($workflow)
  let form: UseForm<WorkflowForm> | undefined = $state()
  let flowsDropdown: Maybe<Dropdown> = $state()
  let unsubscribeForm: Maybe<Unsubscriber>

  const { nodes } = workflowDataContext

  const workflowOptions: Readable<DropDownOption[]> = derived([workflow, subflows], ([wf, sf]) => {
    return [
      { id: wf.id, value: wf.id, label: 'Main Workflow', data: wf },
      ...sf.map((s) => ({
        id: s.id,
        value: s.id,
        label: `Subflow - ${s.id || s.name}`,
        data: s,
        type: 'subflow',
      }))
    ]
  })

  subflows.subscribe((sf) => {
    if (!sf.some((s) => s.id === selectedWf.id)) {
      selectedWf = $workflow
      zoomToNode?.(selectedWf.id)
    }
  })

  const handleFormInit = (localForm: Writable<UseForm<WorkflowForm>>) => {
    unsubscribeForm?.()

    unsubscribeForm = localForm.subscribe((v) => form = v)
  }

  const getNodesBySelectedWf = () => {
    if (selectedWf.id === $workflow.id) return $nodes.filter((n) => n.data.state && !n.parentId)
    return $nodes.filter((n) => n.data.state && (n.parentId && n.parentId === selectedWf.id))
  }

  const handleAddSubflow = () => {
    const newSubflow = {
      id: 'subflow_' + Math.random().toString(36).substr(2, 5),
      name: 'New Subflow',
      start: '',
      states: [],
    } as unknown as Specification.Workflow
    workflowDataContext.addSubflow(newSubflow)
    flowsDropdown?.close()

    selectedWf = newSubflow

    buildWorkflowFromContext()
    setIsWorkflowSaved(false)
  }

  const handleUpdateWorkflow = () => {
    const isTouched = Object.keys(form?.touched || {}).length > 0
    const isError = form?.status.isError
    if (!isTouched || isError || !form) return

    const isWorkflow = selectedWf.id === $workflow.id
    const prevStartNode = selectedWf?.start
    const states = getStatesFromNodes(getNodesBySelectedWf(), isWorkflow ? undefined : selectedWf.id)
    const data: Record<string, any> = {
      ...form.values,
      dataInputSchema: form.values.dataInputSchema ? JSON.parse(form.values.dataInputSchema) : undefined,
      constants: form.values.constants ? JSON.parse(form.values.constants) : undefined,
      metadata: form.values.metadata ? JSON.parse(form.values.metadata) : undefined,
    }

    const wf = getNormalizedWorkflow({
      ...selectedWf,
      ...data,
      states
    })

    if (isWorkflow) {
      workflowDataContext.updateWorkflow(wf)
    } else {
      workflowDataContext.updateSubflowById(selectedWf.id, wf, true)
    }

    form.resetTouched()

    if (wf.id !== selectedWf.id || (data?.start && prevStartNode !== data?.start)) {
      buildWorkflowFromContext()
    }

    setIsWorkflowSaved(false)
    selectedWf = wf
  }
</script>

<div class="w-full h-full flex flex-col gap-2 py-4 min-h-0">
  <div class="px-4 mb-4">
    <Dropdown
      bind:this={flowsDropdown}
      label="Workflow"
      selected={$workflowOptions.find((option) => option.value === selectedWf.id)}
      options={$workflowOptions}
      onChange={(option) => {
        selectedWf = option.data
        zoomToNode?.(selectedWf.id)
      }}
      plusOption={{ id: '', value: '', label: 'Add Subflow' }}
      onAdd={handleAddSubflow}
      disabled={form?.status.isChanged || form?.status.isError}
    />
  </div>
  <div class="overflow-auto grow">
    {#key selectedWf.id}
      <BuilderContextForm
        onAddNode={(type) => onAddNode(type, selectedWf.id === $workflow.id ? undefined : selectedWf.id)}
        workflow={selectedWf}
        isIdDisabled={selectedWf.id === $workflow.id}
        nodes={getNodesBySelectedWf()}
        onFormInit={handleFormInit}
      />
    {/key}
  </div>

  <div class="flex justify-end py-2 px-4">
    {#if form}
      <Tooltip
        className="shrink-0"
        content={form.status.isError ? 'Error' : ''}
      >
        {#snippet tooltip()}
          {@const errors = Object.values(form?.errors || {}).filter(Boolean)}
          {#each errors as error, index (index)}
            <div class="text-xs">- {error}</div>
          {/each}
        {/snippet}
        <Button
          size="small"
          className="basis-full text-xs"
          onClick={handleUpdateWorkflow}
          isDisabled={form.status.isError || !form?.status.isChanged}
        >
          Apply Changes
        </Button>
      </Tooltip>
    {/if}
  </div>
</div>
