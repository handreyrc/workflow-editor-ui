<script lang="ts">
  import { Specification } from '@severlessworkflow/sdk-typescript'
  import type { Writable } from 'svelte/store'

  import { type UseForm, useForm } from '$lib/utils/hooks/useForm'
  import type { WorkflowForm } from '$lib/types/forms/workflow'

  import { Button } from '$components/common/ui'
  import { PlusIcon } from '$components/icons'
  import EditableList from '$components/common/EditableList.svelte'

  import EmptyActionsImg from '$assets/images/emptyactions.svg'

  import AddError from './AddError.svelte'

  const EMPTY_ERROR: Specification.Errordef = new Specification.Errordef({
    name: ''
  })

  interface Props {
    form: Writable<UseForm<WorkflowForm>>
  }

  let { form }: Props = $props()
  let editAction = $state<Specification.Errordef>()

  const onViewChange = (item: Specification.Errordef) => {
    editAction = item
  }

  const handleError = (values: Record<string, any>) => {
    if (typeof $form.values.errors === 'string') return

    const errors = ($form.values.errors || []) as Specification.Errordef[]
    const existingIndex = errors.findIndex((f) => f.name === values.name)
    const updateError = new Specification.Errordef(values)

    if (existingIndex !== -1) {
      errors[existingIndex] = updateError
    } else {
      errors.push(updateError)
    }

    $form.change('errors', errors)
    $form.validate()
    editAction = undefined
  }
</script>

{#if editAction}
  <AddError
    item={editAction}
    onClose={() => editAction = undefined }
    onSave={handleError}
  />
{:else}
  {#if $form.values.errors?.length && typeof $form.values.errors === 'object'}
    {@const errors = $form.values.errors}
    <div>
      <EditableList
        items={errors}
        onEdit={(item) => onViewChange(item)}
        onDelete={(item) => {
          $form.change('errors', errors.filter((i) => i !== item))
          $form.validate()
        }}
        getName={(item) => item.name}
        onReorder={(items) => {
          $form.change('errors', items)
          $form.validate()
        }}
      />
      <div class="flex justify-end">
        <Button
          className="text-textSub600"
          type="empty"
          icon={PlusIcon}
          onClick={() => onViewChange(EMPTY_ERROR)}
        >Add Error</Button>
      </div>
    </div>
  {:else}
    <div class="pt-8 flex flex-col items-center justify-center">
      <img src={EmptyActionsImg} alt="" />
      <div class="text-sm font-bold mt-4 mb-4">No errors defined yet</div>
      <Button
        size="small"
        onClick={() => onViewChange(EMPTY_ERROR)}
        icon={PlusIcon}
      >
        Add Error
      </Button>
    </div>
  {/if}
{/if}
