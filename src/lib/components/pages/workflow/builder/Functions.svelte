<script lang="ts">
  import { Specification } from '@severlessworkflow/sdk-typescript'
  import type { Writable } from 'svelte/store'

  import { type UseForm } from '$lib/utils/hooks/useForm'
  import type { WorkflowForm } from '$lib/types/forms/workflow'

  import { Button } from '$components/common/ui'
  import { PlusIcon } from '$components/icons'
  import EditableList from '$components/common/EditableList.svelte'

  import EmptyActionsImg from '$assets/images/emptyactions.svg'

  import AddFunction from './AddFunction.svelte'

  const EMPTY_FUNCTION: Specification.Function = new Specification.Function({
    name: '',
    type: 'rest',
  })

  interface Props {
    form: Writable<UseForm<WorkflowForm>>
  }

  let { form }: Props = $props()
  let editAction = $state<Specification.Function>()

  const onViewChange = (item: Specification.Function) => {
    editAction = item
  }

  const handleFunction = (values: Record<string, any>) => {
    if (typeof $form.values.functions === 'string') return

    const functions = ($form.values.functions || []) as Specification.Function[]
    const existingIndex = functions.findIndex((f) => f.name === values.name)
    const updateFunction = new Specification.Function(values)

    if (existingIndex !== -1) {
      functions[existingIndex] = updateFunction
    } else {
      functions.push(updateFunction)
    }

    $form.change('functions', functions)
    $form.validate()
    editAction = undefined
  }
</script>

{#if editAction}
  <AddFunction
    item={editAction}
    onClose={() => editAction = undefined }
    onSave={handleFunction}
  />
{:else}
  {#if $form.values.functions?.length && typeof $form.values.functions === 'object'}
    {@const functions = $form.values.functions}
    <div>
      <EditableList
        items={functions}
        onEdit={(item) => onViewChange(item)}
        onDelete={(item) => {
          $form.change('functions', functions.filter((i) => i !== item))
          $form.validate()
        }}
        getName={(item) => item.name}
        onReorder={(items) => {
          $form.change('functions', items)
          $form.validate()
        }}
      />
      <div class="flex justify-end">
        <Button
          className="text-textSub600"
          type="empty"
          icon={PlusIcon}
          onClick={() => onViewChange(EMPTY_FUNCTION)}
        >Add Action</Button>
      </div>
    </div>
  {:else}
    <div class="flex flex-col items-center justify-center pt-8">
      <img src={EmptyActionsImg} alt="" />
      <div class="text-sm font-bold mt-4 mb-4">No functions defined yet</div>
      <Button
        size="small"
        onClick={() => onViewChange(EMPTY_FUNCTION)}
        icon={PlusIcon}
      >
        Add Functions
      </Button>
    </div>
  {/if}
{/if}
