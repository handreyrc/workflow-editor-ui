<script lang="ts">
  import { Accordion } from '@skeletonlabs/skeleton-svelte'
  import {
    type Node,
  } from '@xyflow/svelte'
  import { Specification } from '@severlessworkflow/sdk-typescript'

  import { useForm } from '$lib/utils/hooks'
  import type { FlowNode } from '$lib/types/flow'
  import { WORKFLOW_OPERATIONS } from '$lib/constants/workflow'
  import type { DropDownOption } from '$lib/types/ui'
  import { addNewState } from '$lib/utils/flow/index.js'
  import { removeEmptyFields } from '$lib/utils/transformers/removeEmptyFields'

  import Flyout from '$components/common/ui/Flyout.svelte'
  import StateIcon from '$components/common/StateIcon.svelte'
  import { SaveIcon } from '$components/icons'
  import IconOpenClose from '$components/accordion'
  import { Button, Tooltip } from '$components/common/ui'

  import { getStateDefinition, getStateValues, validateForm } from './utils'
  import {
    Common,
    Action,
    Actions,
    Compensation,
    Conditions,
    DefaultCondition,
    OnErrors,
    StateDataFilter,
    Timeouts,
    Transition,
    Metadata, Branches
  } from './parts'

  interface Props {
    node: FlowNode
    allNodes: Node[]
    onClose: () => void
    onSave: (form: any) => void
    onViewChange: (value: string, item?: any) => void
  }

  let {
    node,
    allNodes,
    onClose,
    onSave,
    onViewChange
  }: Props = $props()

  let accordion = $state([''])

  const form = useForm({
    initialValues: getStateValues(node.data.state),
    validateOnInit: true,
    validate: validateForm
  })

  const getConditionType = () => {
    if ($form.values.dataConditions) return 'data'
    if ($form.values.eventConditions) return 'event'
    return undefined
  }
  let conditionType = $state(getConditionType())

  const getCompensationOptions = (usedForCompensation?: boolean): DropDownOption[] => {
    return (allNodes as FlowNode[])
      .filter(({ data }) => 'usedForCompensation' in data.state
        && data.state.usedForCompensation
        && (data.state.name !== node.data.state.name || !usedForCompensation))
      .map(({ data }) => ({
        id: data.state.name,
        label: data.state.name,
        value: data.state.name,
      } as DropDownOption)) || []
  }

  const getTransitionOptions = (): DropDownOption[] => {
    return (allNodes as FlowNode[])
      .filter(({ data }) => !data.state.usedForCompensation && (data.state.name !== node.data.state.name))
      .map(({ data }) => ({
        id: data.state.name,
        label: data.state.name,
        value: data.state.name,
      } as DropDownOption)) || []
  }

  const description = node.data?.type && node.data.type in WORKFLOW_OPERATIONS
    ? WORKFLOW_OPERATIONS[node.data.type as keyof typeof WORKFLOW_OPERATIONS]?.description
    : undefined

  const handleSave = () => {
    if ($form.status.isError) return

    const data = removeEmptyFields<Record<string, any>>({ ...node.data.state,  ...$form.values })
    const state = getStateDefinition(data || {})
    onSave(addNewState(state))
  }

  export const addNewAction = (action: Specification.Action, prevAction: any) => {
    const isCallbackState = node.data.type === 'callback'

    if (isCallbackState) {
      $form.change('action', action)
      return
    }

    if (prevAction) {
      $form.change(
        'actions',
        $form.values.actions
          .map((a: Specification.Action) => a === prevAction ? action : a)
      )
      return
    }

    $form.change('actions', [...$form.values.actions, action])
  }

  export const addNewBranch = (branch: Specification.Branch, prevBranch: any) => {
    if (prevBranch) {
      $form.change(
        'branches',
        $form.values.branches
          .map((b: Specification.Branch) => b === prevBranch ? branch : b)
      )
      return
    }

    $form.change('branches', [...$form.values.branches, branch])
  }

  export const addNewDataCondition = (condition: Specification.Datacondition, prevCondition: any) => {
    if (prevCondition) {
      $form.change(
        'dataConditions',
        $form.values.dataConditions
          .map((c: Specification.Datacondition) => c === prevCondition ? condition : c)
      )
      return
    }

    $form.change('dataConditions', [...($form.values.dataConditions || []), condition])
  }

  export const addNewError = (error: Specification.Error, prevError: any) => {
    if (prevError) {
      $form.change(
        'onErrors',
        $form.values.onErrors
          .map((e: Specification.Error) => e === prevError ? error : e)
      )
      return
    }

    $form.change('onErrors', [...$form.values.onErrors, error])
  }
</script>

<Flyout
  isOpen
  overlay={false}
  onClose={onClose}
  className="absolute! top-4! right-4! bottom-4! h-auto! rounded-xl max-w-[480px]"
>
  {#snippet header()}
    <div class="flex gap-2">
      <span class="text-iconSub600"><StateIcon type={node.data.type} width={24} height={24} /></span>
      <div>
        <div class="capitalize text-lg">{node.data.type}</div>
        {#if description}
          <p class="text-textSub600 text-xs mt-2">{description}</p>
        {/if}
      </div>
    </div>
  {/snippet}

  {#snippet body()}
    <div class="form">
      <Common form={form} />

      <Accordion
        value={accordion}
        onValueChange={(e) => (accordion = e.value)}
        collapsible
        multiple
      >
        {#snippet iconOpen()}<IconOpenClose />{/snippet}
        {#snippet iconClosed()}<IconOpenClose type="closed" />{/snippet}

        {#if node.data.state.type === 'switch'}
          <div class="my-4 w-full border-b border-strokeSub300"></div>
          <Accordion.Item
            value="conditions"
            panelPadding="0"
            controlPadding="0"
          >
            {#snippet control()}
              <div class="flex items-center"><h4 class="text-sm font-500">Conditions</h4></div>
            {/snippet}
            {#snippet panel()}
              <Conditions
                form={form}
                bind:conditionType={conditionType}
                onViewChange={onViewChange}
              />
            {/snippet}
          </Accordion.Item>
        {/if}

        {#if 'branches' in $form.values}
          <div class="my-4 w-full border-b border-strokeSub300"></div>
          <Accordion.Item
            value="branches"
            panelPadding="0"
            controlPadding="0"
          >
            {#snippet control()}
              <div class="flex items-center">
                <h4 class="text-sm font-500">
                  Branches
                  <span class="ml-1 px-1 rounded-sm bg-[var(--neutral-alpha-16)]">{$form.values.branches?.length || 0}</span>
                </h4>
              </div>
            {/snippet}

            {#snippet panel()}
              <Branches form={form} onViewChange={onViewChange} />
            {/snippet}
          </Accordion.Item>
        {/if}

        {#if 'defaultCondition' in $form.values}
          <div class="my-4 w-full border-b border-strokeSub300"></div>
          <Accordion.Item
            value="default_condition"
            panelPadding="0"
            controlPadding="0"
          >
            {#snippet control()}
              <div class="flex items-center"><h4 class="text-sm font-500">Default Condition</h4></div>
            {/snippet}
            {#snippet panel()}
              <DefaultCondition form={form} options={getTransitionOptions()} />
            {/snippet}
          </Accordion.Item>
        {/if}

        {#if 'actions' in $form.values}
          <div class="my-4 w-full border-b border-strokeSub300"></div>
          <Accordion.Item
            value="actions"
            panelPadding="0"
            controlPadding="0"
          >
            {#snippet control()}
              <div class="flex items-center">
                <h4 class="text-sm font-500">
                  Actions
                  <span class="ml-1 px-1 rounded-sm bg-[var(--neutral-alpha-16)]">{$form.values.actions?.length || 0}</span>
                </h4>
              </div>
            {/snippet}

            {#snippet panel()}
              <Actions form={form} onViewChange={onViewChange} />
            {/snippet}
          </Accordion.Item>
        {/if}

        {#if 'action' in $form.values}
          <div class="my-4 w-full border-b border-strokeSub300"></div>
          <Accordion.Item
            value="action"
            panelPadding="0"
            controlPadding="0"
          >
            {#snippet control()}
              <div class="flex items-center"><h4 class="text-sm font-500">Action</h4></div>
            {/snippet}

            {#snippet panel()}
              <Action form={form} onViewChange={onViewChange} />
            {/snippet}
          </Accordion.Item>
        {/if}

        {#if 'stateDataFilter' in $form.values}
          <div class="my-4 w-full border-b border-strokeSub300"></div>
          <Accordion.Item
            value="stateDataFilter"
            panelPadding="0"
            controlPadding="0"
          >
            {#snippet control()}
              <div class="flex items-center"><h4 class="text-sm font-500">State Data Filter</h4></div>
            {/snippet}

            {#snippet panel()}
              <StateDataFilter form={form} />
            {/snippet}
          </Accordion.Item>
        {/if}

        {#if 'transition' in $form.values || 'end' in $form.values}
          <div class="my-4 w-full border-b border-strokeSub300"></div>
          <Accordion.Item
            value="transition"
            panelPadding="0"
            controlPadding="0"
          >
            {#snippet control()}
              <div class="flex items-center"><h4 class="text-sm font-500">Transition Details</h4></div>
            {/snippet}
            {#snippet panel()}
              <Transition form={form} options={getTransitionOptions()} />
            {/snippet}
          </Accordion.Item>
        {/if}

        {#if 'timeouts' in $form.values}
        <div class="my-4 w-full border-b border-strokeSub300"></div>
          <Accordion.Item
            value="timeouts"
            panelPadding="0"
            controlPadding="0"
          >
            {#snippet control()}
              <div class="flex items-center"><h4 class="text-sm font-500">Timeouts</h4></div>
            {/snippet}
            {#snippet panel()}
              <Timeouts form={form} />
            {/snippet}
          </Accordion.Item>
        {/if}

        <div class="my-4 w-full border-b border-strokeSub300"></div>
        <Accordion.Item
          value="compensations"
          panelPadding="0"
          controlPadding="0"
        >
          {#snippet control()}
            <div class="flex items-center"><h4 class="text-sm font-500">Compensation Settings</h4></div>
          {/snippet}
          {#snippet panel()}
            <Compensation form={form} options={getCompensationOptions($form.values.usedForCompensation)} />
          {/snippet}
        </Accordion.Item>

        {#if 'onErrors' in $form.values}
          <div class="my-4 w-full border-b border-strokeSub300"></div>
          <Accordion.Item
            value="errors"
            panelPadding="0"
            controlPadding="0"
          >
            {#snippet control()}
              <div class="flex items-center">
                <h4 class="text-sm font-500">Errors</h4>
                <span class="ml-1 px-1 rounded-sm bg-[var(--neutral-alpha-16)]">{$form.values.onErrors?.length || 0}</span>
              </div>
            {/snippet}
            {#snippet panel()}
              <OnErrors form={form} onViewChange={onViewChange} />
            {/snippet}
          </Accordion.Item>
        {/if}

        <div class="my-4 w-full border-b border-strokeSub300"></div>
        <Accordion.Item
          value="metadata"
          panelPadding="0"
          controlPadding="0"
        >
          {#snippet control()}
            <div class="flex items-center"><h4 class="text-sm font-500">Metadata</h4></div>
          {/snippet}
          {#snippet panel()}
            <Metadata form={form} />
          {/snippet}
        </Accordion.Item>
      </Accordion>
    </div>
  {/snippet}

  {#snippet footer()}
    <div class="flex justify-between gap-2">
      <Button type="secondary" className="basis-1/2" onClick={onClose}>Cancel</Button>

      <Tooltip
        className="basis-1/2"
        content={$form.status.isError ? 'Error' : ''}
      >
        {#snippet tooltip()}
          {@const errors = Object.values($form?.errors || {}).filter(Boolean)}
          {#each errors as error, index (index)}
            <div class="text-xs">- {error}</div>
          {/each}
        {/snippet}
        <Button
          className="basis-full"
          onClick={handleSave}
          isDisabled={$form.status.isError}
          icon={SaveIcon}
          iconSize={12}
        >
          Save
        </Button>
      </Tooltip>
    </div>
  {/snippet}
</Flyout>
