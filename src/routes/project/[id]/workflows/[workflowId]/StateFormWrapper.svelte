<script lang="ts">
  import { Specification } from '@severlessworkflow/sdk-typescript'

  import type { FlowNode } from '$lib/types/flow'
  import type { Maybe } from '$lib/types'

  import { StateForm, AddAction, AddError, AddDataCondition, AddBranch } from '$components/pages/workflow'

  interface Props {
    node: FlowNode
    allNodes: FlowNode[]
    events?: Specification.Events
    functions?: Specification.Functions
    errors?: Specification.Errors
    subflows: Specification.Workflow[]
    onClose: () => void
    onSave: (form: any) => void
  }

  let {
    node,
    allNodes,
    functions,
    events,
    errors,
    subflows,
    onClose,
    onSave,
  }: Props = $props()

  let currentView = $state('state')
  let editAction = $state<Specification.Action>()
  let editBranch = $state<Specification.Branch>()
  let editError = $state<Specification.Error>()
  let editCondition = $state<Specification.Datacondition | Specification.Eventcondition>()
  let stateFormRef: Maybe<StateForm> = $state()

  const onViewChange = (value?: string, item?: any) => {
    currentView = value || 'state'

    if (value === 'addAction') {
      editAction = item as Specification.Action
      return
    }

    if (value === 'addBranch') {
      editBranch = item as Specification.Branch
      return
    }

    if (value === 'addError') {
      editError = item as Specification.Error
      return
    }

    if (value === 'addDataCondition') {
      editCondition = item as Specification.Datacondition
      return
    }

    if (value === 'addEventCondition') {
      editCondition = item as Specification.Eventcondition
      return
    }

    clearView()
  }

  const clearView = () => {
    currentView = 'state'

    editAction = undefined
    editError = undefined
    editCondition = undefined
    editBranch = undefined
  }

  const handleAddAction = (action: Specification.Action) => {
    if (action) {
      stateFormRef?.addNewAction(action, editAction)
    }

    clearView()
  }

  const handleAddBranch = (branch: Specification.Branch) => {
    if (branch) {
      stateFormRef?.addNewBranch(branch, editBranch)
    }

    clearView()
  }

  const handleAddError = (error: Specification.Error) => {
    if (error && 'onErrors' in node.data.state) {
      stateFormRef?.addNewError(error, editError)
    }

    clearView()
  }

  const handleAddDataCondition = (condition: Specification.Datacondition) => {
    if (condition) {
      stateFormRef?.addNewDataCondition(condition, editCondition)
    }

    clearView()
  }
</script>

<div
  class:hidden={currentView !== 'state'}
>
  <StateForm
    bind:this={stateFormRef}
    node={node}
    allNodes={allNodes}
    onSave={onSave}
    onClose={onClose}
    onViewChange={onViewChange}
  />
</div>

{#if currentView === 'addAction'}
  <AddAction
    type={editAction ? 'edit' : 'add'}
    functions={functions}
    events={events}
    action={editAction}
    subflows={subflows}
    onViewChange={onViewChange}
    onSave={handleAddAction}
  />
{/if}

{#if currentView === 'addBranch'}
  <AddBranch
    type={editBranch ? 'edit' : 'add'}
    functions={functions}
    events={events}
    branch={editBranch}
    subflows={subflows}
    onViewChange={onViewChange}
    onSave={handleAddBranch}
  />
{/if}

{#if currentView === 'addError'}
  <AddError
    type={editError ? 'edit' : 'add'}
    error={editError}
    errors={errors}
    allNodes={allNodes}
    onViewChange={onViewChange}
    onSave={handleAddError}
  />
{/if}


{#if currentView === 'addDataCondition'}
  <AddDataCondition
    type={editCondition ? 'edit' : 'add'}
    condition={editCondition}
    nodes={allNodes.filter((n: FlowNode) => node.data.state.name !== n.data.state?.name)}
    onViewChange={onViewChange}
    onSave={handleAddDataCondition}
  />
{/if}
