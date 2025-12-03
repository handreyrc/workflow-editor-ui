<script lang="ts">
  import type { Writable } from 'svelte/store'
  import { Specification } from '@severlessworkflow/sdk-typescript'

  import type { UseForm } from '$lib/utils/hooks/useForm'
  import type { Maybe } from '$lib/types'

  import { Button, Dropdown } from '$components/common/ui'
  import EditableList from '$components/common/EditableList.svelte'
  import { getActionRefName } from '$components/pages/workflow/utils'
  import { PlusIcon } from '$components/icons'

  import EmptyActionsImg from '$assets/images/emptyactions.svg'

  interface Props {
    form:  Writable<UseForm<Record<string, any>>>
    conditionType: Maybe<string>
    onViewChange: (value: string, item?: any) => void
  }

  let {
    form,
    conditionType = $bindable(),
    onViewChange
  }: Props = $props()

  const options = [
    { id: 'data', label: 'Data Conditions', value: 'data' },
    { id: 'event', label: 'Event Conditions', value: 'event' },
  ]
</script>
<div class="mt-4">
  <Dropdown
    required
    label="Condition Type"
    selected={options.find((option) => option.id === conditionType)}
    options={options}
    onChange={(option) => {
      conditionType = option.value
      $form.validate()
    }}
  />
</div>

{#if conditionType === 'data'}
  <div class="mt-4"></div>
  {#if $form.values.dataConditions?.length}
    <div class="mt-4">
      <EditableList
        items={$form.values.dataConditions}
        onEdit={(item) => onViewChange('addDataCondition', item)}
        onDelete={(item) => {
          $form.change('dataConditions', $form.values.dataConditions.filter((i) => i !== item))
          $form.validate()
        }}
        getName={(item: Specification.Datacondition) => item.name ?? `ref: ${getActionRefName(item)}`}
      />
      <div class="flex justify-end">
        <Button
          className="text-textSub600"
          type="empty"
          icon={PlusIcon}
          onClick={() => onViewChange('addDataCondition')}
        >Add Action</Button>
      </div>
    </div>
  {:else}
    <div class="mt-4 flex flex-col items-center justify-center">
      <img src={EmptyActionsImg} alt="" />
      <div class="text-sm font-bold mt-4 mb-4">No data conditions defined yet</div>
      <Button
        size="small"
        onClick={() => onViewChange('addDataCondition')}
        icon={PlusIcon}
      >
        Add Data Condition
      </Button>
    </div>
  {/if}
{/if}

{#if conditionType === 'event'}
  <div class="pt-8 flex flex-col items-center justify-center">
    <img src={EmptyActionsImg} alt="" />
    <div class="text-sm mt-8 text-center">Event conditions will be available <br /> in a future update</div>
  </div>
{/if}
