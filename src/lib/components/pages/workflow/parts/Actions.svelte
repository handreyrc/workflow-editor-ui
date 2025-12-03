<script lang="ts">
  import type { Writable } from 'svelte/store'
  import { Specification } from '@severlessworkflow/sdk-typescript'

  import type { UseForm } from '$lib/utils/hooks/useForm'

  import { Button, Dropdown } from '$components/common/ui'
  import EditableList from '$components/common/EditableList.svelte'
  import { getActionRefName } from '$components/pages/workflow/utils'
  import { PlusIcon } from '$components/icons'
  import { actionModeOptions } from '$components/pages/workflow/constants'

  import EmptyActionsImg from '$assets/images/emptyactions.svg'

  interface Props {
    form:  Writable<UseForm<Record<string, any>>>
    onViewChange: (value: string, item?: any) => void
  }

  let {
    form,
    onViewChange
  }: Props = $props()
</script>

{#if $form.values.actionMode}
  <div class="mt-4">
    <Dropdown
      label="Action Mode"
      required
      selected={actionModeOptions.find((option) => option.value === $form.values.actionMode)}
      options={actionModeOptions}
      onChange={(option) => {
        $form.change('actionMode', option.value)
      }}
    />
  </div>
{/if}

{#if $form.values.mode}
  <div class="mt-4">
    <Dropdown
      label="Mode"
      required
      selected={actionModeOptions.find((option) => option.value === $form.values.mode)}
      options={actionModeOptions}
      onChange={(option) => {
        $form.change('mode', option.value)
      }}
    />
  </div>
{/if}

{#if $form.values.actions?.length}
  <div class="mt-4">
    <EditableList
      items={$form.values.actions}
      onEdit={(item) => onViewChange('addAction', item)}
      onDelete={(item) => {
        $form.change('actions', $form.values.actions.filter((i) => i !== item))
        $form.validate()
      }}
      getName={(item: Specification.Action) => item.name ?? `ref: ${getActionRefName(item)}`}
      isDraggable={$form.values.actionMode === 'sequential' || $form.values.mode === 'sequential'}
      onReorder={(items) => {
        $form.change('actions', items)
        $form.validate()
      }}
    />
    <div class="flex justify-end">
      <Button
        className="text-textSub600"
        type="empty"
        icon={PlusIcon}
        onClick={() => onViewChange('addAction')}
      >Add Action</Button>
    </div>
  </div>
{:else}
  <div class="mt-4 flex flex-col items-center justify-center">
    <img src={EmptyActionsImg} alt="" />
    <div class="text-sm font-bold mt-4 mb-4">No actions defined yet</div>
    <Button
      size="small"
      onClick={() => onViewChange('addAction')}
      icon={PlusIcon}
    >
      Add Action
    </Button>
  </div>
{/if}
